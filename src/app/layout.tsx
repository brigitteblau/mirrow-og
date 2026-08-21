import type { Metadata } from "next";
import { Anybody, Inter } from "next/font/google";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

const displayFont = Anybody({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const siteUrl = "https://www.grupomirrow.com.ar";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mirrow Mayorista | Indumentaria masculina al por mayor desde 1970",
    template: "%s | Mirrow Mayorista",
  },
  description:
    "Mirrow provee indumentaria masculina al por mayor a más de 100 comercios en Argentina. Importación propia, producción y distribución con 56 años de trayectoria familiar.",
  keywords: [
    "indumentaria mayorista",
    "ropa masculina por mayor",
    "importador de indumentaria Argentina",
    "Mirrow mayorista",
    "proveedor de ropa para comercios",
    "sweaters por mayor",
    "jeans por mayor",
    "camperas por mayor",
  ],
  authors: [{ name: "Mirrow" }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: siteUrl,
    siteName: "Mirrow Mayorista",
    title: "Mirrow Mayorista | Indumentaria masculina al por mayor desde 1970",
    description:
      "56 años de trayectoria familiar. Importación, producción y distribución mayorista de indumentaria masculina para más de 100 comercios en Argentina.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mirrow Mayorista | Indumentaria masculina al por mayor",
    description:
      "56 años de trayectoria familiar proveyendo indumentaria masculina a comercios de todo el país.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "Mirrow",
  description:
    "Importador, productor y distribuidor mayorista de indumentaria masculina en Argentina, con más de 56 años de trayectoria familiar.",
  foundingDate: "1970",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Buenos Aires",
    addressCountry: "AR",
  },
  areaServed: "AR",
  url: siteUrl,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[var(--color-ink)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PageTransition>{children}</PageTransition>
        <WhatsAppFloat />
      </body>
    </html>
  );
}
