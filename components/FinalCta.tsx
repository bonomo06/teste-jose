import Image from "next/image";
import { CtaButton } from "@/components/CtaButton";
import { Reveal } from "@/components/Reveal";
import { contact, finalCta } from "@/lib/content";

export function FinalCta() {
  return (
    <section id="contato" className="relative isolate flex min-h-[85dvh] scroll-mt-16 md:scroll-mt-[72px] items-end overflow-hidden">
      <Image
        src="/images/projeto3.webp"
        alt="Fachada de casa moderna com garagem e jardim iluminados ao anoitecer"
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bg via-bg/60 to-bg/20" />

      <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 md:px-10 md:pb-24">
        <Reveal className="max-w-2xl">
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">{finalCta.title}</h2>
          <p className="mt-5 text-lg text-fg/80">{finalCta.text}</p>
          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <CtaButton />
            <a
              href={contact.phoneHref}
              className="text-fg/75 underline-offset-4 transition-colors hover:text-fg hover:underline"
            >
              ou ligue {contact.phoneDisplay}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
