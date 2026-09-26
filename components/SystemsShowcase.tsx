"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import {
  Buildings,
  Crosshair,
  Feather,
  Leaf,
  Lightning,
  Recycle,
  ShieldCheck,
  SlidersHorizontal,
  Stack,
  Thermometer,
  Timer,
  TrendDown,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";
import { Reveal } from "@/components/Reveal";
import { systems, type SystemBenefitIcon } from "@/lib/content";

const benefitIcons: Record<SystemBenefitIcon, Icon> = {
  shield: ShieldCheck,
  thermometer: Thermometer,
  lightning: Lightning,
  recycle: Recycle,
  leaf: Leaf,
  trend: TrendDown,
  timer: Timer,
  buildings: Buildings,
  feather: Feather,
  crosshair: Crosshair,
  sliders: SlidersHorizontal,
  stack: Stack,
};

export function SystemsShowcase() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const system = systems[active];

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const delta = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    const next = (active + delta + systems.length) % systems.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="sistema-construtivo" className="mx-auto max-w-[1400px] scroll-mt-16 md:scroll-mt-[72px] px-4 py-24 md:px-10 md:py-36">
      <div className="grid gap-10 md:grid-cols-12 md:gap-12 lg:gap-20">
        <div className="md:col-span-5">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand">Sistemas construtivos</p>
            <h2 className="mt-5 font-display text-5xl leading-[1] md:text-6xl">
              Escolha o sistema construtivo da sua obra.
            </h2>
            <p className="mt-5 max-w-[48ch] leading-relaxed text-muted">
              Trabalhamos com três sistemas. Cada um tem vantagens diferentes em prazo, custo e desempenho.
            </p>
          </Reveal>

          <Reveal index={1}>
            <div
              role="tablist"
              aria-label="Sistemas construtivos"
              aria-orientation="vertical"
              className="mt-10 flex flex-wrap gap-2 md:flex-col md:flex-nowrap md:gap-0"
            >
              {systems.map((s, i) => {
                const selected = i === active;
                return (
                  <button
                    key={s.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    role="tab"
                    id={`tab-${s.id}`}
                    aria-selected={selected}
                    aria-controls={`painel-${s.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onKeyDown={onTabKeyDown}
                    className={`group relative shrink-0 rounded-full border px-4 py-2.5 text-left text-sm transition-colors duration-300 md:rounded-none md:border-0 md:border-t md:px-0 md:py-6 ${
                      selected
                        ? "border-accent bg-accent/10 text-fg md:border-line md:bg-transparent"
                        : "border-line text-fg/55 hover:text-fg md:border-line"
                    }`}
                  >
                    <span
                      className={`absolute -top-px left-0 hidden h-px bg-accent transition-[width] duration-700 ease-out-expo md:block ${
                        selected ? "w-full" : "w-0"
                      }`}
                      aria-hidden
                    />
                    <span className="block font-medium md:font-display md:text-[2rem] md:font-normal md:leading-tight">{s.name}</span>
                    <span className="mt-1 hidden text-sm text-muted md:block">{s.tagline}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-7">
          <Reveal index={2} className="md:sticky md:top-28">
            <div className="relative aspect-[4/3] overflow-hidden rounded-block bg-surface">
              {systems.map((s, i) => (
                <Image
                  key={s.id}
                  src={s.image}
                  alt={s.imageAlt}
                  fill
                  sizes="(min-width: 768px) 58vw, 100vw"
                  aria-hidden={i !== active}
                  className={`object-cover transition-[opacity,transform] duration-700 ease-out-expo ${
                    i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                  }`}
                />
              ))}
            </div>

            <div
              role="tabpanel"
              id={`painel-${system.id}`}
              aria-labelledby={`tab-${system.id}`}
              className="mt-8 grid gap-8 lg:grid-cols-2"
            >
              <div>
                <h3 className="font-display text-3xl leading-tight">{system.name}</h3>
                <p className="mt-3 leading-relaxed text-muted">{system.description}</p>
              </div>
              <ul className="grid gap-3">
                {system.benefits.map((b) => {
                  const BenefitIcon = benefitIcons[b.icon];
                  return (
                    <li key={b.label} className="flex items-center gap-3 text-[15px] text-fg/85">
                      <BenefitIcon size={20} className="shrink-0 text-accent" aria-hidden />
                      {b.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
