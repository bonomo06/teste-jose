import Image from "next/image";
import {
  Buildings,
  ChatCircleText,
  ClipboardText,
  House,
  PencilRuler,
  Wrench,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";
import { Reveal } from "@/components/Reveal";
import { services } from "@/lib/content";

type Cell = {
  key: keyof typeof services.items;
  icon: Icon;
  className: string;
  image?: { src: string; alt: string };
  tone?: "surface" | "surface-2" | "accent";
};

// Grade 4x3 no desktop: 6 serviços, 6 células, sem célula vazia.
const cells: Cell[] = [
  {
    key: "residencial",
    icon: House,
    className: "md:col-span-2 md:row-span-2",
    image: { src: "/images/casainicio.webp", alt: "Casa residencial moderna com fachada em madeira e vidro" },
  },
  { key: "comercial", icon: Buildings, className: "md:col-span-2", tone: "surface" },
  { key: "projetos", icon: PencilRuler, className: "", tone: "surface-2" },
  { key: "gerenciamento", icon: ClipboardText, className: "", tone: "accent" },
  { key: "reformas", icon: Wrench, className: "", tone: "surface-2" },
  {
    key: "consultoria",
    icon: ChatCircleText,
    className: "md:col-span-3",
    image: { src: "/images/projeto2.webp", alt: "Casa moderna com piscina e deck iluminados à noite" },
  },
];

const tones = {
  surface: "bg-surface",
  "surface-2": "bg-surface-2",
  accent: "bg-accent/12 ring-1 ring-inset ring-accent/25",
};

export function ServicesBento() {
  return (
    <section id="servicos" className="mx-auto max-w-[1400px] scroll-mt-16 md:scroll-mt-[72px] px-4 pb-24 md:px-10 md:pb-36">
      <Reveal className="max-w-2xl">
        <h2 className="font-display text-5xl leading-[1] md:text-6xl">{services.title}</h2>
        <p className="mt-5 max-w-[48ch] leading-relaxed text-muted">{services.subtitle}</p>
      </Reveal>

      <div className="mt-12 grid gap-3 md:mt-16 md:auto-rows-[240px] md:grid-cols-4">
        {cells.map((cell, i) => {
          const item = services.items[cell.key];
          const CellIcon = cell.icon;
          return (
            <Reveal
              key={cell.key}
              index={i % 3}
              as="article"
              className={`group relative flex min-h-[200px] flex-col justify-end overflow-hidden rounded-block p-6 md:p-8 ${
                cell.image ? "min-h-[320px]" : ""
              } ${cell.tone ? tones[cell.tone] : ""} ${cell.className}`}
            >
              {cell.image && (
                <>
                  <Image
                    src={cell.image.src}
                    alt={cell.image.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/35 to-transparent" />
                </>
              )}
              <div className="relative">
                <CellIcon size={28} className="text-accent" aria-hidden />
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.01em] md:text-[1.4rem]">{item.title}</h3>
                <p className="mt-2 max-w-[40ch] text-[15px] leading-relaxed text-fg/70">{item.text}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
