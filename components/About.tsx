import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { about } from "@/lib/content";

export function About() {
  return (
    <section id="empresa" className="scroll-mt-16 md:scroll-mt-[72px] border-t border-line">
      <div className="mx-auto max-w-[1400px] px-4 py-24 md:px-10 md:py-36">
        <Reveal as="h2" className="max-w-5xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
          {about.statement[0]} <span className="text-muted">{about.statement[1]}</span>
        </Reveal>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:items-end md:gap-12">
          <Reveal index={1} className="md:col-span-4 md:pb-2">
            <p className="text-lg leading-relaxed text-fg/80">{about.text}</p>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-accent">
              {about.values.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal index={2} className="md:col-span-8">
            <div className="relative aspect-[16/10] overflow-hidden rounded-block">
              <Image
                src="/images/projeto1.webp"
                alt="Fachada de casa moderna com varanda de vidro e iluminação embutida"
                fill
                sizes="(min-width: 768px) 66vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
