import type { Metadata } from "next";
import { Anybody, Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

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
    default: "Ropa de Hombre por Mayor en Argentina | Mirrow",
    template: "%s | Mirrow",
  },

  description:
    "Mayorista de indumentaria masculina para comercios y revendedores. Importación y producción propia, con distribución a todo el país.",

  alternates: {
    canonical: siteUrl,
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "es_AR",
    url: siteUrl,
    siteName: "Mirrow",
    title: "Mirrow Mayorista | Indumentaria masculina desde 1970",
    description:
      "Ropa de hombre por mayor para comercios y revendedores. Importación, producción y distribución en toda Argentina.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Mirrow Mayorista | Indumentaria masculina",
    description:
      "Venta mayorista para comercios y revendedores de todo el país.",
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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        <PageTransition>{children}</PageTransition>

        <WhatsAppFloat />
      </body>

      <GoogleAnalytics gaId="G-EDMW6GN7HJ" />
    </html>
  );
}