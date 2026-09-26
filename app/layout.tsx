import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { contact } from "@/lib/content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://monobuild.com.br";
const DESCRIPTION =
  "Construtora em Indaiatuba - SP. Construção residencial e comercial em EPS monolítico, alvenaria estrutural e light steel frame. Solicite um orçamento.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Monobuild | Construtora em Indaiatuba - SP",
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Monobuild",
    title: "Monobuild | Construímos com qualidade. Entregamos confiança.",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Monobuild | Construtora em Indaiatuba - SP",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0e10",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: "Monobuild",
  url: SITE_URL,
  image: `${SITE_URL}/frames/final.jpg`,
  description: DESCRIPTION,
  telephone: "+55-19-99636-4658",
  email: contact.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Indaiatuba",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  areaServed: "Indaiatuba - SP",
  sameAs: [contact.instagramUrl],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
