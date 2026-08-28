import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Faq } from "@/components/Faq";
import { Reveal } from "@/components/Reveal";
import { whatsappUrl } from "@/lib/whatsapp";

const BASE_URL = "https://www.grupomirrow.com.ar";

const title = "Preguntas Frecuentes | Mirrow Indumentaria Mayorista";
const description =
  "Resolvemos las dudas más comunes sobre comprar ropa por mayor en Mirrow: compra mínima, pedidos por WhatsApp, medios de pago, envíos a todo el país, talles y producción con marca propia.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${BASE_URL}/preguntas-frecuentes`,
  },
  openGraph: {
    title,
    description,
    url: `${BASE_URL}/preguntas-frecuentes`,
    type: "website",
  },
};

export default function PreguntasFrecuentesPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Preguntas frecuentes",
        item: `${BASE_URL}/preguntas-frecuentes`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <section className="bg-[var(--color-ink)] pb-10 pt-28 text-white sm:pt-36">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/50">
              <Link href="/" className="transition-colors hover:text-white">
                Inicio
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-white/70">Preguntas frecuentes</span>
            </nav>
            <h1 className="font-display mt-4 text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
              Preguntas frecuentes
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              {description}
            </p>
          </div>
        </section>

        <Faq heading="Todo sobre comprar por mayor en Mirrow" bajada="" />

        <section className="bg-[var(--color-red)] py-14 text-center sm:py-16">
          <Reveal className="mx-auto max-w-2xl px-6 lg:px-8">
            <p className="text-xl font-medium leading-relaxed text-white sm:text-2xl">
              ¿Tenés otra consulta? Escribinos y te respondemos al instante.
            </p>
            <a
              href={whatsappUrl("Hola! Tengo una consulta sobre la venta mayorista de Mirrow.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-red)] transition-colors hover:bg-white/90"
            >
              Escribinos por WhatsApp
            </a>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
