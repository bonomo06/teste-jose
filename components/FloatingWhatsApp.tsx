"use client";

import { WhatsappLogo } from "@phosphor-icons/react/ssr";
import { contact } from "@/lib/content";
import { usePastHero } from "@/lib/use-past-hero";

// Aparece só depois do hero, para não competir com o CTA principal.
export function FloatingWhatsApp() {
  const visible = usePastHero();

  return (
    <a
      href={contact.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Solicitar orçamento pelo WhatsApp"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`fixed bottom-5 right-5 z-30 grid size-14 place-items-center rounded-full bg-accent text-accent-ink shadow-[0_12px_32px_-8px_rgb(79_181_206/0.45)] transition-[opacity,transform,background-color] duration-500 ease-out-expo hover:bg-accent-strong active:scale-[0.96] md:bottom-8 md:right-8 ${
        visible ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <WhatsappLogo size={28} weight="fill" aria-hidden />
    </a>
  );
}
