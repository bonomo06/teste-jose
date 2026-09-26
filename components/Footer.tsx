import Image from "next/image";
import { EnvelopeSimple, InstagramLogo, MapPin, Phone } from "@phosphor-icons/react/ssr";
import { Wordmark } from "@/components/Wordmark";
import { contact, nav } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-16 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <Image src="/images/logo-mark.png" alt="" width={32} height={28} className="h-7 w-auto" />
            <Wordmark className="h-3.5 w-auto text-fg" />
          </div>
          <p className="mt-5 max-w-[36ch] text-sm leading-relaxed text-muted">
            Soluções construtivas inteligentes, seguras e sustentáveis.
          </p>
        </div>

        <nav aria-label="Rodapé" className="md:col-span-3">
          <ul className="grid gap-3 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-fg/75 transition-colors hover:text-fg">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <address className="grid gap-3 text-sm not-italic md:col-span-4">
          <a href={contact.phoneHref} className="flex items-center gap-3 text-fg/75 transition-colors hover:text-fg">
            <Phone size={18} className="text-accent" aria-hidden />
            {contact.phoneDisplay}
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-3 text-fg/75 transition-colors hover:text-fg"
          >
            <EnvelopeSimple size={18} className="text-accent" aria-hidden />
            {contact.email}
          </a>
          <span className="flex items-center gap-3 text-fg/75">
            <MapPin size={18} className="text-accent" aria-hidden />
            {contact.city}
          </span>
          <a
            href={contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-fg/75 transition-colors hover:text-fg"
          >
            <InstagramLogo size={18} className="text-accent" aria-hidden />
            {contact.instagramHandle}
          </a>
        </address>
      </div>

      <div className="mx-auto max-w-[1400px] border-t border-line px-4 py-6 text-xs text-muted md:px-10">
        © 2026 Monobuild. Todos os direitos reservados.
      </div>
    </footer>
  );
}
