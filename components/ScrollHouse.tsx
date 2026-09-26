"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CtaButton } from "@/components/CtaButton";
import { FrameSequence, drawFrame } from "@/lib/frame-sequence";
import { hero, stages } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

// Gerados por scripts/extract-frames.sh. Desktop: todos os 240 frames do vídeo em 1920x1080.
// Mobile: 1 a cada 2 frames, já recortados no quadrado central do palco (960x960).
const FRAME_SETS = {
  desktop: { path: "/frames/desktop", count: 240 },
  mobile: { path: "/frames/mobile", count: 120 },
};

// Parte do scroll em que o vídeo roda. Antes: terreno parado com o título. Depois: casa pronta.
const BUILD_START = 0.05;
const BUILD_END = 0.95;
// Quantas alturas de tela o hero fica fixo.
const PIN_SCREENS = { desktop: 4, mobile: 3 };

export function ScrollHouse() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const markerRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const ctx2d = canvas?.getContext("2d");
    if (!section || !canvas || !ctx2d) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const set = isMobile ? FRAME_SETS.mobile : FRAME_SETS.desktop;
    const state = { frame: 0 };
    let rafId = 0;

    const render = () => {
      rafId = 0;
      drawFrame(ctx2d, sequence, state.frame);
    };
    const scheduleRender = () => {
      if (!rafId) rafId = requestAnimationFrame(render);
    };

    const sequence = new FrameSequence(set.path, set.count, scheduleRender);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      ctx2d.imageSmoothingQuality = "high";
      scheduleRender();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const setActiveStage = (progress: number) => {
      const active = stages.findIndex((s) => progress >= s.start && progress < s.end + 0.001);
      markerRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i === active) el.setAttribute("aria-current", "step");
        else el.removeAttribute("aria-current");
      });
    };

    const gsapCtx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        // Usa o progresso suavizado da timeline, para o indicador andar junto com o vídeo.
        onUpdate: () => setActiveStage(tl.progress()),
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * (isMobile ? PIN_SCREENS.mobile : PIN_SCREENS.desktop)}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        state,
        { frame: set.count - 1, duration: BUILD_END - BUILD_START, onUpdate: scheduleRender },
        BUILD_START,
      );

      tl.to(introRef.current, { autoAlpha: 0, y: -32, duration: 0.05 }, 0.04);

      const fade = 0.03;
      chapterRefs.current.forEach((el, i) => {
        if (!el) return;
        const { start, end } = stages[i];
        tl.fromTo(el, { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: fade }, start);
        if (i < stages.length - 1) tl.to(el, { autoAlpha: 0, y: -32, duration: fade }, end - fade);
      });

      // Garante que a timeline dure exatamente 1 (posições acima = progresso do scroll).
      tl.to({}, { duration: 1 - BUILD_END }, BUILD_END);
    }, section);

    return () => {
      gsapCtx.revert();
      sequence.destroy();
      resizeObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      aria-label="Da fundação à entrega"
      className="relative flex h-[100dvh] flex-col overflow-hidden bg-bg motion-reduce:h-auto motion-reduce:min-h-[100dvh]"
    >
      {/* Palco: tela cheia no desktop, quadrado no topo no mobile (o vídeo é horizontal). */}
      <div className="relative mt-16 aspect-square w-full shrink-0 md:absolute md:inset-0 md:mt-0 md:aspect-auto">
        <Image
          src="/frames/first.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover motion-reduce:hidden"
        />
        <Image
          src="/frames/final.jpg"
          alt="Casa moderna de dois pavimentos construída pela Monobuild, iluminada ao anoitecer"
          fill
          sizes="100vw"
          className="hidden object-cover motion-reduce:block"
        />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full motion-reduce:hidden" aria-hidden />

        {/* Scrims leves e localizados: só onde há texto e header, para não escurecer a casa. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-bg/55 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent md:h-[42%] md:from-bg/80 md:via-bg/25" />
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[42%] bg-gradient-to-r from-bg/50 to-transparent md:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[18%] bg-gradient-to-l from-bg/40 to-transparent md:block" />
      </div>

      {/* Texto */}
      <div className="relative mx-auto grid w-full max-w-[1400px] flex-1 px-4 pb-8 pt-4 md:absolute md:inset-0 md:grid-cols-12 md:items-end md:px-10 md:pb-16 md:[text-shadow:0_1px_18px_rgb(15_14_12/0.6)] motion-reduce:md:relative motion-reduce:md:pt-40">
        <div className="relative h-full md:col-span-8 md:h-auto">
          <div ref={introRef} className="md:pb-2">
            <h1 className="font-display text-[2.6rem] leading-[1] md:text-[3.9rem] lg:text-[4.9rem]">
              {hero.title[0]}
              <br />
              <em className="text-accent">{hero.title[1]}</em>
            </h1>
            <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-fg/80 md:mt-6 md:text-lg">
              {hero.subtitle}
            </p>
            <CtaButton className="mt-6 md:mt-8" />
          </div>

          <div className="motion-reduce:mt-10 motion-reduce:grid motion-reduce:gap-6 motion-reduce:sm:grid-cols-2">
            {stages.map((stage, i) => (
              <div
                key={stage.title}
                ref={(el) => {
                  chapterRefs.current[i] = el;
                }}
                className="invisible absolute inset-x-0 top-0 opacity-0 md:bottom-0 md:top-auto motion-reduce:visible motion-reduce:static motion-reduce:opacity-100"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand tabular-nums">
                  {String(i + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
                </p>
                <h2 className="mt-3 font-display text-[2.6rem] leading-[1] md:text-7xl motion-reduce:text-3xl motion-reduce:md:text-4xl">
                  {stage.title}
                </h2>
                <p className="mt-3 max-w-[42ch] text-base leading-relaxed text-fg/80 md:mt-4 md:text-lg">
                  {stage.text}
                </p>
                {i === stages.length - 1 && <CtaButton className="mt-6 md:mt-8 motion-reduce:hidden" />}
              </div>
            ))}
          </div>
        </div>

        {/* Indicador da etapa atual (desktop). */}
        <ol className="hidden self-center justify-self-end md:col-span-4 md:flex md:flex-col md:gap-4 motion-reduce:hidden!">
          {stages.map((stage, i) => (
            <li
              key={stage.title}
              ref={(el) => {
                markerRefs.current[i] = el;
              }}
              className="group flex items-center justify-end gap-3 text-sm font-medium text-fg/60 transition-colors duration-500 aria-[current=step]:text-fg"
            >
              <span className="tabular-nums text-fg/40 transition-colors duration-500 group-aria-[current=step]:text-sand">
                {String(i + 1).padStart(2, "0")}
              </span>
              {stage.title}
              <span className="h-px w-6 bg-fg/30 transition-all duration-500 group-aria-[current=step]:w-12 group-aria-[current=step]:bg-accent" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
