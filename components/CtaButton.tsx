import { WhatsappLogo } from "@phosphor-icons/react/ssr";
import { CTA_LABEL, contact } from "@/lib/content";

type Props = {
  size?: "sm" | "md";
  className?: string;
};

const sizes = {
  sm: "h-10 px-4 text-sm gap-2",
  md: "h-12 px-6 text-[15px] gap-2.5",
};

export function CtaButton({ size = "md", className = "" }: Props) {
  return (
    <a
      href={contact.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full bg-accent font-semibold text-accent-ink transition-[background-color,transform] duration-300 ease-out-expo hover:bg-accent-strong active:scale-[0.98] ${sizes[size]} ${className}`}
    >
      <WhatsappLogo size={size === "sm" ? 18 : 20} weight="fill" aria-hidden />
      {CTA_LABEL}
    </a>
  );
}
