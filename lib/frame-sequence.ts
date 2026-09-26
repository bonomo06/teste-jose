// Carrega uma sequência de frames (0001.avif ... NNNN.avif) em ordem de prioridade:
// primeiro um frame a cada 16, depois a cada 8, 4, 2 e por fim todos. Assim o scrub
// funciona cedo em baixa "resolução temporal" e vai ficando fluido enquanto carrega.

const CONCURRENCY = 6;
const STRIDES = [16, 8, 4, 2, 1];

export class FrameSequence {
  private images: (HTMLImageElement | null)[];
  private queue: number[];
  private destroyed = false;

  constructor(
    private basePath: string,
    readonly count: number,
    private onFrameLoaded: (index: number) => void,
  ) {
    this.images = new Array(count).fill(null);
    this.queue = buildLoadOrder(count);
    for (let i = 0; i < CONCURRENCY; i++) this.next();
  }

  // Frame carregado mais próximo do índice pedido (ou null se nenhum carregou ainda).
  nearest(index: number): HTMLImageElement | null {
    const i = Math.max(0, Math.min(this.count - 1, index));
    for (let d = 0; d < this.count; d++) {
      const before = this.images[i - d];
      if (before) return before;
      const after = this.images[i + d];
      if (after) return after;
    }
    return null;
  }

  destroy() {
    this.destroyed = true;
    this.queue = [];
  }

  private next() {
    if (this.destroyed) return;
    const index = this.queue.shift();
    if (index === undefined) return;

    const img = new Image();
    img.decoding = "async";
    img.src = `${this.basePath}/${String(index + 1).padStart(4, "0")}.avif`;
    img
      .decode()
      .then(() => {
        if (this.destroyed) return;
        this.images[index] = img;
        this.onFrameLoaded(index);
      })
      .catch(() => {
        // Frame que falhou fica de fora; nearest() usa o vizinho carregado.
      })
      .finally(() => {
        this.next();
      });
  }
}

function buildLoadOrder(count: number): number[] {
  const seen = new Set<number>();
  const order: number[] = [];
  const push = (i: number) => {
    if (i < count && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };
  push(0);
  push(count - 1);
  for (const stride of STRIDES) {
    for (let i = 0; i < count; i += stride) push(i);
  }
  return order;
}

// Desenha a imagem cobrindo o canvas inteiro (equivalente a object-fit: cover, centralizado).
export function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
  const { width: cw, height: ch } = ctx.canvas;
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
}
