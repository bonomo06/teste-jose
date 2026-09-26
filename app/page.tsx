import { About } from "@/components/About";
import { FinalCta } from "@/components/FinalCta";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollHouse } from "@/components/ScrollHouse";
import { ServicesBento } from "@/components/ServicesBento";
import { SystemsShowcase } from "@/components/SystemsShowcase";
import { HERO_END_ID } from "@/lib/use-past-hero";

export default function Home() {
  return (
    <>
      <a
        href="#conteudo"
        className="fixed left-4 top-4 z-50 -translate-y-24 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main>
        <ScrollHouse />
        <div id={HERO_END_ID} aria-hidden />
        <div id="conteudo">
          <SystemsShowcase />
          <ServicesBento />
          <About />
          <FinalCta />
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
