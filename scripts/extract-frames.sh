#!/usr/bin/env bash
# Converte o vídeo da obra em sequências de frames AVIF para o scroll do hero.
# Uso: bash scripts/extract-frames.sh [video.mp4] [pasta-de-saida]
#
# Por que AVIF 4:4:4: no mesmo tamanho do WebP q72 que usávamos antes (~9 MB), ele preserva
# muito mais textura (SSIM na área da pedra: 0.989 contra 0.970). Medições em 2026-09-26.
set -euo pipefail

cd "$(dirname "$0")/.."

SRC="${1:-gemini_generated_video_341642ea.mp4}"
OUT="${2:-public/frames}"
JOBS="${JOBS:-8}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Os dois conjuntos usam a resolução cheia do vídeo (1280x720): no celular o palco
# quadrado recorta o centro e amplia, então frames menores ficavam visivelmente borrados.
# Desktop: 160 frames (16 fps sobre 10s)
# Mobile:  96 frames (9.6 fps sobre 10s), compressão um pouco maior para poupar dados
extract() {
  local name="$1" fps="$2" crf="$3"
  local dir="$OUT/$name"
  rm -rf "$dir" "$TMP/$name"
  mkdir -p "$dir" "$TMP/$name"
  ffmpeg -v error -y -i "$SRC" -an -vf "fps=$fps" "$TMP/$name/%04d.png"
  ls "$TMP/$name" | sed 's/\.png$//' | xargs -P "$JOBS" -I{} \
    ffmpeg -v error -y -i "$TMP/$name/{}.png" \
      -c:v libaom-av1 -still-picture 1 -crf "$crf" -cpu-used 6 -pix_fmt yuv444p \
      "$dir/{}.avif"
  local count size
  count=$(ls "$dir" | wc -l)
  size=$(du -sh "$dir" | cut -f1)
  echo "$name: $count frames, $size"
}

extract desktop 16 18
extract mobile 9.6 22

# Primeiro e último frame em alta, para o poster do hero e a imagem de compartilhamento
ffmpeg -v error -y -sseof -0.05 -i "$SRC" -frames:v 1 -q:v 2 "$OUT/final.jpg"
ffmpeg -v error -y -i "$SRC" -frames:v 1 -q:v 2 "$OUT/first.jpg"
cp "$OUT/final.jpg" app/opengraph-image.jpg
echo "posters: first.jpg, final.jpg (final também em app/opengraph-image.jpg)"
