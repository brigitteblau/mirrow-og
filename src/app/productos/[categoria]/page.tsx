import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ModeloGallery } from "@/components/ModeloGallery";
import { getCatalogo, getCategoria, getPortada, contarFotos } from "@/lib/catalogo";
import { whatsappUrl } from "@/lib/whatsapp";

const BASE_URL = "https://mayorista.mirrow.com.ar";

export async function generateStaticParams() {
  const catalogo = await getCatalogo();
  return catalogo.map((categoria) => ({ categoria: categoria.slug }));
}

type Props = {
  params: Promise<{ categoria: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria: slug } = await params;
  const categoria = await getCategoria(slug);
  if (!categoria) return {};

  const nombreLower = categoria.nombre.toLowerCase();
  const title = `${categoria.nombre} por Mayor | Mirrow Indumentaria Mayorista`;
  const description = categoria.descripcion
    ? `${categoria.descripcion} Comprá ${nombreLower} por mayor en Mirrow, con envíos a comercios y revendedores de todo el país.`
    : `Comprá ${nombreLower} por mayor en Mirrow: producción propia e importación, variedad de talles y colores, con envíos a comercios y revendedores de todo el país.`;
  const url = `${BASE_URL}/productos/${categoria.slug}`;
  const portada = getPortada(categoria);
  const ogImage = portada?.src;

  return {
    title,
    description,
    keywords: [
      `${nombreLower} por mayor`,
      `${nombreLower} mayorista`,
      `${nombreLower} para revender`,
      `proveedor de ${nombreLower}`,
      `${nombreLower} para locales de ropa`,
      "ropa por mayor",
      "indumentaria mayorista Argentina",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: ogImage ? [{ url: ogImage, alt: portada?.alt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

function EmptyState() {
  return (
    <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-[var(--color-gray-elegance)]">
      <span className="font-display text-lg font-extrabold uppercase tracking-tight text-[var(--color-ink)]/25">
        MIRROW
      </span>
      <span className="absolute bottom-3 right-3 rounded-full border border-black/10 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-black/40">
        Fotos próximamente
      </span>
    </div>
  );
}

export default async function CategoriaPage({ params }: Props) {
  const { categoria: slug } = await params;
  const categoria = await getCategoria(slug);
  if (!categoria) notFound();

  const catalogo = await getCatalogo();
  const otras = catalogo.filter((c) => c.slug !== categoria.slug);
  const totalFotos = contarFotos(categoria);
  const items = [
    ...categoria.fotos.map((foto) => ({
      key: foto.src,
      nombre: undefined as string | undefined,
      descripcion: categoria.descripcion,
      fotos: [foto],
    })),
    ...categoria.modelos.map((modelo) => ({
      key: modelo.slug,
      nombre: modelo.nombre,
      descripcion: modelo.descripcion,
      fotos: modelo.fotos,
    })),
  ];

  const categoriaUrl = `${BASE_URL}/productos/${categoria.slug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Catálogo", item: `${BASE_URL}/#productos` },
      { "@type": "ListItem", position: 3, name: categoria.nombre, item: categoriaUrl },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoria.nombre} por mayor`,
    description: `Catálogo mayorista de ${categoria.nombre.toLowerCase()} de Mirrow.`,
    url: categoriaUrl,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: item.nombre ? `${categoria.nombre} ${item.nombre}` : categoria.nombre,
          image: item.fotos.map((foto) => foto.src),
          brand: { "@type": "Brand", name: "Mirrow" },
        },
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
        <section className="bg-[var(--color-ink)] pb-6 pt-28 text-white sm:pt-36">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h1 className="sr-only">{categoria.nombre} al por mayor</h1>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/50">
              <Link href="/" className="transition-colors hover:text-white">
                Inicio
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/#productos" className="transition-colors hover:text-white">
                Catálogo
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-white/70">{categoria.nombre}</span>
            </nav>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            {totalFotos === 0 && (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <EmptyState key={index} />
                ))}
              </div>
            )}

            <div className="space-y-20 sm:space-y-28">
              {items.map((item, index) => (
                <Reveal
                  key={item.key}
                  className={`grid grid-cols-1 items-center gap-8 sm:grid-cols-2 sm:gap-14 ${
                    index % 2 === 1 ? "sm:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <ModeloGallery nombre={item.nombre} fotos={item.fotos} />
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-red)]">
                      {categoria.nombre}
                    </p>
                    {item.nombre && (
                      <h2 className="font-display mt-2 text-2xl font-extrabold uppercase tracking-tight text-[var(--color-ink)] sm:text-3xl">
                        {item.nombre}
                      </h2>
                    )}
                    {item.descripcion && (
                      <p className="mt-3 text-sm leading-relaxed text-black/60">{item.descripcion}</p>
                    )}
                    {item.fotos.length > 1 && (
                      <p className="mt-4 text-sm text-black/50">Disponible en {item.fotos.length} colores.</p>
                    )}
                    <p className="mt-4 text-sm text-black/60">
                      También lo producimos con tu marca.{" "}
                      <a
                        href={whatsappUrl(
                          `Hola! Quiero pedir ${item.nombre ? `el modelo ${item.nombre} de ` : ""}${categoria.nombre} de Mirrow con mi marca.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[var(--color-red)] underline underline-offset-2 transition-colors hover:text-[var(--color-red-dark)]"
                      >
                        Consultanos por WhatsApp
                      </a>
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-red)] py-14 text-center sm:py-16">
          <Reveal className="mx-auto max-w-2xl px-6 lg:px-8">
            <p className="text-xl font-medium leading-relaxed text-white sm:text-2xl">
              ¿Te interesa nuestra línea de {categoria.nombre.toLowerCase()}? Escribinos y te
              contamos telas, talles y precios mayoristas.
            </p>
            <a
              href={whatsappUrl(`Hola! Me interesa la línea de ${categoria.nombre} de Mirrow, ¿me pasás más información?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-red)] transition-colors hover:bg-white/90"
            >
              Escribinos por WhatsApp
            </a>
          </Reveal>
        </section>

        {otras.length > 0 && (
          <section className="bg-[var(--color-gray-elegance)] py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-[var(--color-ink)]">
                Otras categorías
              </h2>
              <ul className="mt-6 flex flex-wrap gap-3">
                {otras.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/productos/${c.slug}`}
                      className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm text-[var(--color-ink)]/70 transition-colors hover:border-[var(--color-red)] hover:text-[var(--color-red)]"
                    >
                      {c.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
