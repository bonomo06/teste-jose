"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const HERO_END_ID = "fim-do-hero";

// true quando o fim do hero já passou por baixo do header. Usa ScrollTrigger (e não
// IntersectionObserver) porque ele acerta o estado mesmo quando a página pula direto
// para o meio, como num reload ou link com âncora.
export function usePastHero(offset = 72) {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById(HERO_END_ID);
    if (!sentinel) return;
    const trigger = ScrollTrigger.create({
      trigger: sentinel,
      start: `top ${offset}px`,
      end: "max",
      // Calcula depois do pin do hero, que adiciona a altura extra antes do marcador.
      refreshPriority: -1,
      onToggle: (self) => setPast(self.isActive),
      onRefresh: (self) => setPast(self.isActive),
    });
    return () => trigger.kill();
  }, [offset]);

  return past;
}
