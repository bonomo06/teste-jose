# Monobuild LP - Design

Data: 2026-09-26
Status: design aprovado em chat, aguardando revisão do spec

## Objetivo

Landing page moderna para **apresentar como proposta à Monobuild** (construtora em Indaiatuba - SP), substituindo visualmente o site atual (monobuild.com.br). O elemento central é um hero em que a casa é construída conforme o usuário rola a página para baixo e desconstruída ao rolar para cima, usando o vídeo `gemini_generated_video_341642ea.mp4` (terreno vazio → casa pronta iluminada à noite, 10s, 1280x720, 24fps).

**Sucesso =** a animação responde ao scroll de forma fluida nos dois sentidos (desktop e mobile), a página comunica os serviços e sistemas construtivos da Monobuild, e todo caminho de conversão leva ao WhatsApp.

### Premissas
- Conteúdo vem do site atual (serviços, 3 sistemas construtivos, 5 etapas do processo, sobre, contato). Sem depoimentos, números ou métricas inventados.
- Mantém logo e cor de marca `#4FB5CE`.
- Imagens: frames do vídeo + fotos do site atual (baixadas de monobuild.com.br/imagens/).

### Design read (taste-skill)
Landing de construtora para quem vai construir casa de médio/alto padrão, linguagem premium-cinematográfica com scrollytelling, apoiada em Next.js + Tailwind v4 + GSAP ScrollTrigger.
Dials: `DESIGN_VARIANCE 7 / MOTION_INTENSITY 8 / VISUAL_DENSITY 3`.

## Stack

- Next.js (App Router, TypeScript) + Tailwind v4 (`@tailwindcss/postcss`)
- GSAP + ScrollTrigger, isolado em componentes client (`"use client"`), com cleanup via `gsap.context().revert()`
- Fonte: Geist + Geist Mono via pacote `geist`
- Ícones: `@phosphor-icons/react`, stroke/weight padronizado
- Deploy alvo: Vercel
- Local: `construtora/monobuild-lp/`

## Assets

Gerados por `construtora/scripts/extract-frames.sh` (ffmpeg, já executado):

| Conjunto | Frames | Resolução | Tamanho | Destino no app |
|---|---|---|---|---|
| desktop | 160 (16 fps) | 1280x720 WebP q72 | 8,9 MB | `public/frames/desktop/0001-0160.webp` |
| mobile | 96 (9,6 fps) | 854x480 WebP q68 | 3,1 MB | `public/frames/mobile/0001-0096.webp` |
| posters | `first.jpg`, `final.jpg` | 1280x720 | ~150 KB cada | `public/frames/` |

Fotos do site atual → `public/images/` (casainicio, projeto1-3, casaeps, casaestrutural, casasteel, logotipo.svg).

## Estrutura da página

Tema: **escuro na página inteira** (aprovado; justificado pelo vídeo terminar à noite e pelo posicionamento premium). Um único tema, sem seções invertidas.

1. **Header**: logo + nav em linha única (Sistemas, Serviços, Empresa, Contato) + CTA "Solicitar orçamento". Transparente sobre o hero, ganha fundo com blur após o hero. Mobile: menu hambúrguer.

2. **Hero ScrollHouse** (seção pinada, ~500vh desktop / ~350vh mobile)
   - Canvas desenha o frame correspondente ao progresso do scroll (`scrub`), descendo constrói, subindo desconstrói.
   - Progresso 0-12%: headline "Construímos com qualidade. Entregamos confiança." + subtexto curto + CTA. Sai com fade ao iniciar a construção.
   - Capítulos sincronizados com o vídeo (etapas do processo, conteúdo do site atual):
     - Planejamento (~12-35%, terreno e marcação)
     - Execução (~35-60%, estrutura e alvenaria)
     - Acompanhamento (~60-82%, fechamento e acabamento)
     - Entrega (~82-100%, paisagismo e luzes acesas)
   - Indicador lateral discreto com as 4 etapas (estado real: etapa atual).
   - Ao final, CTA "Solicitar orçamento" reaparece sobre a casa pronta.
   - **Desktop:** canvas em tela cheia, `cover`.
   - **Mobile (<768px):** palco quadrado no topo (cover, recorte central, mostra ~56% da largura, preserva a casa), capítulos abaixo sobre fundo escuro.

3. **Sistemas construtivos**: lista dos 3 sistemas (EPS Monolítico, Alvenaria Estrutural, Light Steel Frame) à esquerda; imagem grande à direita que troca ao selecionar (hover/click/teclado). Benefícios do sistema ativo abaixo da descrição. Mobile: abas horizontais + imagem + conteúdo empilhados.

4. **Serviços**: bento de 6 células com tamanhos variados (2-3 com foto), um por serviço. Mobile: 1 coluna.

5. **Sobre**: frase grande "Construímos mais que obras, construímos relações." + parágrafo do site atual + foto `projeto1`. Layout editorial (texto largo, imagem deslocada).

6. **CTA final**: `final.jpg` em tela cheia com scrim, "Vamos tirar seu projeto do papel?", subtexto "Solicite um orçamento sem compromisso." e botão "Solicitar orçamento".

7. **Footer**: logo, telefone (19) 99636-4658, e-mail monobuild@outlook.com.br, Indaiatuba - SP, Instagram @monobuildbr, © 2026.

8. **Botão flutuante WhatsApp**: ícone, aria-label "Solicitar orçamento pelo WhatsApp".

Todos os CTAs usam o mesmo rótulo "Solicitar orçamento" e o link `https://wa.me/5519996364658` com mensagem pré-preenchida.

## Sistema visual

- Fundo off-black neutro frio (sem `#000`), superfícies em tons de zinc; texto off-white.
- Único acento: `#4FB5CE` (botões, etapa ativa, links em hover).
- Raio único: 14px em blocos/imagens, botões em pill. Regra documentada e seguida em todo lugar.
- Eyebrows: no máximo 1 a cada 3 seções.
- Zero em-dash/en-dash em texto visível.

## Componentes

| Componente | Tipo | Responsabilidade |
|---|---|---|
| `ScrollHouse` | client | preload progressivo dos frames, desenho no canvas (cover + DPR), ScrollTrigger pin/scrub, capítulos |
| `useFrameSequence` | hook | carrega frames (primeiro imediato, resto em lotes), retorna o frame carregado mais próximo de um índice |
| `SystemsShowcase` | client | seleção do sistema ativo (estado local), troca de imagem com transição |
| `ServicesBento` | server | grid de serviços |
| `About`, `FinalCta`, `Footer`, `Header` | server (Header client só pelo menu mobile/scroll state via IntersectionObserver) | |
| `lib/content.ts` | dados | todo o texto da página em um só lugar |

## Comportamentos e estados

- **Loading:** `first.jpg` como poster instantâneo no canvas; frames carregam em segundo plano; se o scroll passar do carregado, desenha o frame carregado mais próximo.
- **Reduced motion:** sem pin/scrub; hero mostra `final.jpg` estático e as 4 etapas como lista normal.
- **Resize/orientação:** canvas redimensiona com DPR; ScrollTrigger `invalidateOnRefresh`; troca desktop↔mobile de conjunto de frames conforme breakpoint.
- Proibido `window.addEventListener('scroll')`: tudo via ScrollTrigger / IntersectionObserver.

## SEO

`title`, `description`, Open Graph/Twitter com `final.jpg`, JSON-LD `HomeAndConstructionBusiness` (nome, telefone, e-mail, Indaiatuba-SP, Instagram), `robots.txt` e `sitemap.xml` via rotas do Next, favicons do site atual, `lang="pt-BR"`.

## Verificação

- `npm run build` sem erros ou warnings de tipo.
- Rodar local e checar: scrub para frente e para trás, capítulos sincronizados, mobile (viewport 390px), reduced motion.
- Screenshots em desktop e mobile via Playwright (headless) para checagem visual.
- Checklist Pre-Flight da taste-skill (Seção 14).

## Fora de escopo

Formulário de contato, blog, portfólio com páginas internas, CMS, analytics (pode ser proposto depois).
