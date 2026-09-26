#!/usr/bin/env bash
# Converte o vídeo da obra em sequências de frames AVIF para o scroll do hero.
# Uso: bash scripts/extract-frames.sh [video.mp4] [pasta-de-saida]
#
# Pipeline (medições em 2026-09-26, vídeo de 1280x720 a 24 fps, 240 frames):
# 1. Master: todos os frames decodificados com matriz BT.709 explícita. O vídeo não traz
#    metadado de cor e o padrão do ffmpeg (BT.601) deslocava levemente os tons; no Chrome o
#    resultado novo bate com o vídeo original (PSNR 35,6 dB contra 30,2 dB do pipeline antigo).
# 2. Upscale lanczos para 1920x1080 + CAS (nitidez adaptativa). Antes o navegador esticava
#    1280px para a tela inteira e a pedra/folhagem ficavam moles.
# 3. AVIF 10 bits, faixa completa, com cor marcada (BT.709/sRGB): sem banding no céu e sem o
#    navegador ter que adivinhar a matriz.
# 4. Cadência uniforme: desktop usa todos os 240 frames; mobile usa 1 a cada 2 (120). O corte
#    antigo para 16 fps / 9,6 fps a partir de 24 fps pulava frames de forma irregular.
set -euo pipefail

cd "$(dirname "$0")/.."

SRC="${1:-gemini_generated_video_341642ea.mp4}"
OUT="${2:-public/frames}"
JOBS="${JOBS:-$(nproc)}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

DESKTOP_CRF=26 # ~80 KB por frame, ~19 MB no total (carregado progressivamente)
MOBILE_CRF=28  # ~37 KB por frame, ~4,5 MB no total

# 1-2. Master em PNG 16 bits.
mkdir -p "$TMP/master"
ffmpeg -v error -y -i "$SRC" -an \
  -vf "scale=1920:1080:in_color_matrix=bt709:in_range=tv:out_range=pc:flags=lanczos+accurate_rnd+full_chroma_int,format=gbrp16le,cas=0.5" \
  "$TMP/master/%04d.png"
MASTER_COUNT=$(ls "$TMP/master" | wc -l)
echo "master: $MASTER_COUNT frames 1920x1080"

# encode <entrada.png> <saida.avif> <crf> <pix_fmt> [filtro extra antes da conversão]
encode() {
  ffmpeg -v error -y -i "$1" \
    -vf "${5:-}scale=out_color_matrix=bt709:out_range=pc:flags=lanczos+accurate_rnd+full_chroma_int,format=$4" \
    -c:v libaom-av1 -still-picture 1 -crf "$3" -cpu-used 5 \
    -colorspace bt709 -color_primaries bt709 -color_trc iec61966-2-1 -color_range pc \
    "$2"
}
export -f encode

report() {
  echo "$1: $(ls "$OUT/$1" | wc -l) frames, $(du -sh "$OUT/$1" | cut -f1)"
}

# 3a. Desktop: todos os frames, 1920x1080, 4:4:4 (cor sem perda nas bordas finas).
rm -rf "$OUT/desktop"
mkdir -p "$OUT/desktop"
ls "$TMP/master" | sed 's/\.png$//' | xargs -P "$JOBS" -I{} \
  bash -c 'encode "$0/master/{}.png" "$1/desktop/{}.avif" "$2" yuv444p10le' "$TMP" "$OUT" "$DESKTOP_CRF"
report desktop

# 3b. Mobile: 1 a cada 2 frames, já recortado no quadrado central que o palco mobile mostra
# (mesmo enquadramento do object-fit: cover). 960x960 cobre um celular com DPR 2 sem ampliar.
# 4:2:0 (perfil Main do AV1) por ser o mais compatível com decodificadores de celular.
rm -rf "$OUT/mobile"
mkdir -p "$OUT/mobile"
for ((i = 1; i <= MASTER_COUNT; i += 2)); do
  printf '%04d %04d\n' "$i" $(((i + 1) / 2))
done | xargs -P "$JOBS" -L1 \
  bash -c 'encode "$0/master/$3.png" "$1/mobile/$4.avif" "$2" yuv420p10le "crop=1080:1080:420:0,scale=960:960:flags=lanczos,"' \
  "$TMP" "$OUT" "$MOBILE_CRF"
report mobile

# 4. Posters (primeiro e último frame do master), na mesma cor e nitidez dos frames para não
# haver "salto" quando o canvas assume. A imagem de compartilhamento sai em 1200x630.
ffmpeg -v error -y -i "$TMP/master/0001.png" -q:v 2 -pix_fmt yuvj444p "$OUT/first.jpg"
ffmpeg -v error -y -i "$TMP/master/$(printf '%04d' "$MASTER_COUNT").png" -q:v 2 -pix_fmt yuvj444p "$OUT/final.jpg"
ffmpeg -v error -y -i "$TMP/master/$(printf '%04d' "$MASTER_COUNT").png" \
  -vf "crop=1920:1008:0:36,scale=1200:630:flags=lanczos" -q:v 2 -pix_fmt yuvj420p app/opengraph-image.jpg
echo "posters: first.jpg, final.jpg (1920x1080), app/opengraph-image.jpg (1200x630)"
