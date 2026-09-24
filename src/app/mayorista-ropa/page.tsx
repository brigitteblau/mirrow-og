import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Faq } from "@/components/Faq";
import { getCatalogo, getPortada, type Foto } from "@/lib/catalogo";
import { PREGUNTAS } from "@/lib/preguntas";
import { whatsappUrl } from "@/lib/whatsapp";
import { mailtoUrl } from "@/lib/email";

const BASE_URL = "https://www.grupomirrow.com.ar";
const URL = `${BASE_URL}/mayorista-ropa`;

const title = "Mayorista de Ropa en Argentina | Cómo Comprar al Por Mayor | Mirrow";
const description =
  "Qué es comprar ropa al por mayor, ventajas para tu comercio, mínimos de compra y modalidades de pedido. Mirrow es mayorista de indumentaria masculina desde 1970, con envíos a todo el país.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "mayorista ropa argentina",
    "ropa al por mayor",
    "comprar ropa al por mayor argentina",
    "ropa de hombre mayorista argentina",
    "distribuidor ropa hombre",
    "mínimo de compra mayorista",
  ],
  alternates: {
    canonical: URL,
  },
  openGraph: { title, description, url: URL, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

const VENTAJAS = [
  {
    titulo: "Precio por volumen",
    texto:
      "Al comprar por mayor accedés a precios escalonados: cuanto más pedís, más baja el costo por unidad frente al precio minorista.",
  },
  {
    titulo: "Stock permanente",
    texto:
      "Con producción propia e importación directa, mantenemos stock disponible durante todo el año para que no te falten reposiciones.",
  },
  {
    titulo: "Curvas de talles completas",
    texto:
      "Cada prenda tiene su curva definida y te asesoramos sobre la más conveniente según tu público y punto de venta.",
  },
];

const PASOS = [
  {
    numero: "01",
    titulo: "Elegís del catálogo",
    texto: "Recorrés las categorías o pedís el catálogo completo por WhatsApp.",
  },
  {
    numero: "02",
    titulo: "Confirmás cantidades y talles",
    texto: "Te asesoramos sobre curvas de talles y mínimos según la modalidad y el artículo.",
  },
  {
    numero: "03",
    titulo: "Coordinás el pago",
    texto: "Transferencia, depósito, débito, crédito o efectivo, según lo que te resulte más práctico.",
  },
  {
    numero: "04",
    titulo: "Recibís tu pedido",
    texto: "Despachamos por correo y expresos a todo el país, con documentación técnica incluida.",
  },
];

const PREGUNTAS_MAYORISTA = PREGUNTAS.filter((p) =>
  [
    "¿Cuál es el mínimo de compra?",
    "¿Cómo hago un pedido?",
    "¿Le venden a consumidor final o solo a comercios?",
    "¿Qué medios de pago aceptan?",
    "¿Hacen envíos a todo el país?",
  ].includes(p.pregunta)
);

function CategoriaCard({ slug, nombre, foto }: { slug: string; nombre: string; foto?: Foto }) {
  return (
    <Link href={`/productos/${slug}`} className="group block">
      <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-[var(--color-gray-elegance)] transition-transform duration-300 group-hover:scale-[1.02]">
        {foto ? (
          <Image
            src={foto.src}
            alt={foto.alt}
            fill
            sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 45vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="font-display text-lg font-extrabold uppercase tracking-tight text-[var(--color-ink)]/25">
            MIRROW
          </span>
        )}
      </div>
      <h3 className="mt-3 flex items-center gap-1.5 text-sm font-bold text-[var(--color-ink)]">
        {nombre}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="mt-0.5 transition-transform duration-300 group-hover:translate-x-1"
        >
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </h3>
    </Link>
  );
}

export default async function MayoristaRopaPage() {
  const catalogo = await getCatalogo();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Mayorista de ropa", item: URL },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Mayorista de ropa en Argentina: qué es, ventajas y cómo comprar",
    description,
    url: URL,
    author: { "@type": "Organization", name: "Mirrow" },
    publisher: { "@type": "Organization", name: "Mirrow", url: BASE_URL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <section className="bg-[var(--color-ink)] pb-16 pt-32 text-white sm:pb-24 sm:pt-40">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-white/50">
                <Link href="/" className="transition-colors hover:text-white">
                  Inicio
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-white/70">Mayorista de ropa</span>
              </nav>
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-red)]">
                Guía mayorista
              </p>
              <h1 className="font-display mt-3 text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Mayorista de ropa en Argentina: qué es y cómo comprar
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
                Ser mayorista de ropa significa comprar indumentaria en volumen y a
                precios escalonados para vender en tu local o multimarca. Mirrow
                importa, produce y distribuye ropa de hombre al por mayor desde 1970,
                con stock permanente y envíos a comercios de toda Argentina.
              </p>
              <a
                href={whatsappUrl("Hola! Quiero información para comprar ropa al por mayor en Mirrow.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block rounded-full bg-[var(--color-red)] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-red-dark)]"
              >
                Pedir catálogo mayorista
              </a>
            </Reveal>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-red)]">
                Ventajas
              </p>
              <h2 className="font-display mt-3 text-2xl font-extrabold uppercase tracking-tight text-[var(--color-ink)] sm:text-3xl">
                Por qué comprar ropa al por mayor en Mirrow
              </h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {VENTAJAS.map((item, index) => (
                <Reveal key={item.titulo} delay={index * 80}>
                  <h3 className="font-display text-lg font-bold tracking-tight text-[var(--color-ink)]">
                    {item.titulo}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/60 sm:text-base">
                    {item.texto}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-gray-elegance)] py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-red)]">
                Modalidad
              </p>
              <h2 className="font-display mt-3 text-2xl font-extrabold uppercase tracking-tight text-[var(--color-ink)] sm:text-3xl">
                Cómo hacer tu pedido mayorista
              </h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {PASOS.map((paso, index) => (
                <Reveal key={paso.numero} delay={index * 80}>
                  <span className="font-display text-3xl font-extrabold text-[var(--color-red)]">
                    {paso.numero}
                  </span>
                  <h3 className="mt-3 font-display text-base font-bold tracking-tight text-[var(--color-ink)]">
                    {paso.titulo}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/60">{paso.texto}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-red)]">
                Catálogo mayorista
              </p>
              <h2 className="font-display mt-3 text-2xl font-extrabold uppercase tracking-tight text-[var(--color-ink)] sm:text-3xl">
                Categorías disponibles al por mayor
              </h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
              {catalogo.map((categoria, index) => (
                <Reveal key={categoria.slug} delay={index * 80}>
                  <CategoriaCard
                    slug={categoria.slug}
                    nombre={categoria.nombre}
                    foto={getPortada(categoria)}
                  />
                </Reveal>
              ))}
            </div>
            <Reveal delay={300} className="mt-10 text-center">
              <Link
                href="/productos"
                className="inline-block rounded-full border border-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-white"
              >
                Ver catálogo completo
              </Link>
            </Reveal>
          </div>
        </section>

        <Faq
          preguntas={PREGUNTAS_MAYORISTA}
          heading="Preguntas sobre la compra mayorista"
          bajada="Lo que más nos preguntan los comercios antes de hacer su pedido."
        />

        <section className="bg-[var(--color-red)] py-14 text-center sm:py-16">
          <Reveal className="mx-auto max-w-2xl px-6 lg:px-8">
            <p className="text-xl font-medium leading-relaxed text-white sm:text-2xl">
              ¿Querés sumar Mirrow a tu local?
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={whatsappUrl("Hola! Quiero información para comprar ropa al por mayor en Mirrow.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-red)] transition-colors hover:bg-white/90"
              >
                Escribinos por WhatsApp
              </a>
              <a
                href={mailtoUrl("Consulta mayorista")}
                className="inline-block rounded-full border border-white/60 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Escribinos por mail
              </a>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
