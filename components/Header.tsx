"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react/ssr";
import { CtaButton } from "@/components/CtaButton";
import { Wordmark } from "@/components/Wordmark";
import { nav } from "@/lib/content";
import { usePastHero } from "@/lib/use-past-hero";

export function Header() {
  const solid = usePastHero();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          solid ? "border-b border-line bg-bg/80 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-4 md:h-[72px] md:px-10">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Monobuild, voltar ao início">
            <Image src="/images/logo-mark.png" alt="" width={32} height={28} className="h-7 w-auto" />
            <Wordmark className="h-3.5 w-auto text-fg" />
          </a>

          <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-fg/75 transition-colors duration-300 hover:text-fg"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <CtaButton size="sm" />
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid size-10 place-items-center rounded-full text-fg transition-colors hover:bg-fg/10 active:scale-[0.96] lg:hidden"
              aria-label="Abrir menu"
              aria-expanded={open}
              aria-controls="menu-mobile"
            >
              <List size={24} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu-mobile"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 z-50 flex flex-col bg-bg px-4 pb-10 lg:hidden"
      >
        <div className="flex h-16 items-center justify-between">
          <Wordmark className="h-3.5 w-auto text-fg" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid size-10 place-items-center rounded-full text-fg transition-colors hover:bg-fg/10"
            aria-label="Fechar menu"
          >
            <X size={24} aria-hidden />
          </button>
        </div>
        <nav aria-label="Menu mobile" className="mt-10 flex flex-col gap-2">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-4 text-3xl font-semibold tracking-tight"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <CtaButton className="mt-auto w-full" />
      </div>
    </>
  );
}
