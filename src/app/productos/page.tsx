import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { getCatalogo, getPortada, contarFotos } from "@/lib/catalogo";
import { whatsappUrl } from "@/lib/whatsapp";

const BASE_URL = "https://www.grupomirrow.com.ar";

export const revalidate = 300;

const title =
  "Catálogo de Ropa de Hombre por Mayor | Buzos, Remeras, Jeans y más | Mirrow";
const description =
  "Catálogo mayorista de ropa de hombre de Mirrow: buzos, remeras, chombas, sweaters, camperas, jeans y pantalones para comercios y revendedores. Producción propia e importación, con envíos a todo el país.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "catálogo ropa de hombre por mayor",
    "ropa de hombre mayorista argentina",
    "comprar ropa al por mayor",
    "buzos por mayor",
    "remeras por mayor",
    "jeans por mayor",
    "indumentaria masculina mayorista",
  ],
  alternates: {
    canonical: `${BASE_URL}/productos`,
  },
  openGraph: {
    title,
    description,
    url: `${BASE_URL}/productos`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function ProductosIndexPage() {
  const catalogo = (await getCatalogo()).filter((categoria) => getPortada(categoria));

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Catálogo", item: `${BASE_URL}/productos` },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Catálogo de ropa de hombre por mayor",
    description,
    url: `${BASE_URL}/productos`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: catalogo.map((categoria, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${categoria.nombre} por mayor`,
        url: `${BASE_URL}/productos/${categoria.slug}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <section className="bg-[var(--color-ink)] pb-10 pt-28 text-white sm:pt-36">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs text-white/50"
            >
              <Link href="/" className="transition-colors hover:text-white">
                Inicio
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-white/70">Catálogo</span>
            </nav>
            <h1 className="font-display mt-4 text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
              Catálogo de ropa de hombre por mayor
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              {description}
            </p>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <div className="prose-mirrow">
              <p>
                En Mirrow somos <strong>mayoristas de indumentaria masculina</strong> desde
                1970. Producimos e importamos <strong>ropa de hombre por mayor</strong> para
                comercios, marcas y revendedores de toda la Argentina, con curva de talles
                completa, reposición por temporada y la opción de fabricar cada prenda con tu
                propia marca.
              </p>
              <p>
                Recorré las categorías del catálogo y escribinos por WhatsApp para recibir la
                lista de precios mayoristas y la compra mínima vigente de cada artículo.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white pb-16 sm:pb-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {catalogo.length === 0 ? (
              <div className="mx-auto max-w-lg rounded-2xl border border-black/10 bg-[var(--color-gray-elegance)] p-10 text-center">
                <p className="font-display text-lg font-extrabold uppercase tracking-tight text-[var(--color-ink)]/60">
                  Catálogo en actualización
                </p>
                <p className="mt-3 text-sm text-black/50">
                  Estamos cargando las categorías. Escribinos por WhatsApp y te pasamos el
                  catálogo mayorista completo.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
                {catalogo.map((categoria, index) => {
                  const foto = getPortada(categoria)!;
                  const totalFotos = contarFotos(categoria);

                  return (
                    <Reveal key={categoria.slug} delay={index * 60} className="min-w-0">
                      <Link
                        href={`/productos/${categoria.slug}`}
                        className="group block"
                      >
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-black/10 bg-neutral-100">
                          <Image
                            src={foto.src}
                            alt={foto.alt}
                            fill
                            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                          {categoria.etiqueta && (
                            <span className="absolute right-3 top-3 rounded-full bg-[var(--color-red)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow">
                              {categoria.etiqueta}
                            </span>
                          )}
                          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                            <h2 className="font-display text-base font-extrabold uppercase tracking-tight text-white drop-shadow sm:text-lg">
                              {categoria.nombre}
                            </h2>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              aria-hidden="true"
                              className="shrink-0 text-white transition-transform duration-300 group-hover:translate-x-1"
                            >
                              <path
                                d="M9 6l6 6-6 6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                        {categoria.descripcion ? (
                          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-black/55">
                            {categoria.descripcion}
                          </p>
                        ) : (
                          <p className="mt-3 text-sm text-black/45">
                            {categoria.nombre} por mayor
                            {totalFotos > 0 ? ` · ${totalFotos} fotos` : ""}
                          </p>
                        )}
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="bg-[var(--color-red)] py-14 text-center sm:py-16">
          <Reveal className="mx-auto max-w-2xl px-6 lg:px-8">
            <p className="text-xl font-medium leading-relaxed text-white sm:text-2xl">
              Pedí la lista de precios mayoristas y armá tu primer pedido con nosotros.
            </p>
            <a
              href={whatsappUrl(
                "Hola! Quiero la lista de precios mayoristas y el catálogo completo de Mirrow."
              )}
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
