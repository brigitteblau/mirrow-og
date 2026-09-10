import type { Metadata } from "next";
import { preconnect, prefetchDNS } from "react-dom";
import { Anybody, Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import { ContactChat } from "@/components/ContactChat";
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
    "Mayorista de indumentaria masculina para comercios y revendedores. Importación y producción propia, con distribución a todo el país. Comprá ropa de hombre por mayor con más de 56 años de trayectoria.",

  keywords: [
    "ropa de hombre por mayor",
    "ropa de hombre mayorista argentina",
    "indumentaria masculina mayorista",
    "comprar ropa al por mayor",
    "distribuidor de ropa hombre",
    "mayorista de ropa argentina",
    "proveedor de indumentaria",
  ],

  alternates: {
    canonical: siteUrl,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "es_AR",
    url: siteUrl,
    siteName: "Mirrow",
    title: "Mirrow Mayorista | Indumentaria masculina desde 1970",
    description:
      "Ropa de hombre por mayor para comercios y revendedores. Importación, producción y distribución en toda Argentina.",
    images: [
      {
        url: "/images/fabrica-fachada.jpg",
        width: 1200,
        height: 630,
        alt: "Mirrow, mayorista de indumentaria masculina en Argentina",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Mirrow Mayorista | Indumentaria masculina",
    description:
      "Venta mayorista para comercios y revendedores de todo el país.",
    images: ["/images/fabrica-fachada.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  "@id": `${siteUrl}/#organization`,
  name: "Mirrow",
  alternateName: "Grupo Mirrow",
  description:
    "Importador, productor y distribuidor mayorista de indumentaria masculina en Argentina, con más de 56 años de trayectoria familiar.",
  foundingDate: "1970",
  url: siteUrl,
  logo: `${siteUrl}/images/mirrow-icon.svg`,
  image: `${siteUrl}/images/fabrica-fachada.jpg`,
  telephone: "+5491160192099",
  priceRange: "$$",
  currenciesAccepted: "ARS",
  paymentAccepted: "Transferencia, depósito, débito, crédito, efectivo",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ciudad Autónoma de Buenos Aires",
    addressRegion: "CABA",
    addressCountry: "AR",
  },
  areaServed: {
    "@type": "Country",
    name: "Argentina",
  },
  knowsLanguage: "es-AR",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: "+5491160192099",
    availableLanguage: "Spanish",
    areaServed: "AR",
  },
};

function pocketbaseOrigin(): string | null {
  const raw = process.env.POCKETBASE_URL;
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Resource hints: la fuente de datos (PocketBase) sirve imágenes dentro del
  // HTML de los posts, y Google Analytics carga desde googletagmanager.com.
  // Adelantar la conexión reduce el tiempo hasta la primera imagen y el LCP.
  const pbOrigin = pocketbaseOrigin();
  if (pbOrigin) {
    preconnect(pbOrigin, { crossOrigin: "anonymous" });
    prefetchDNS(pbOrigin);
  }
  preconnect("https://www.googletagmanager.com");

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

        <ContactChat />
      </body>

      <GoogleAnalytics gaId="G-EDMW6GN7HJ" />
    </html>
  );
}