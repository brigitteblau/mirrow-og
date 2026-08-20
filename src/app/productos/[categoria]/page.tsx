import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ModeloGallery } from "@/components/ModeloGallery";
import { getCatalogo, getCategoria, contarFotos } from "@/lib/catalogo";
import { whatsappUrl } from "@/lib/whatsapp";

export function generateStaticParams() {
  return getCatalogo().map((categoria) => ({ categoria: categoria.slug }));
}

type Props = {
  params: Promise<{ categoria: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria: slug } = await params;
  const categoria = getCategoria(slug);
  if (!categoria) return {};

  const title = `${categoria.nombre} al por mayor | Mirrow`;
  const description = `Catálogo mayorista de ${categoria.nombre.toLowerCase()} de Mirrow. Producción propia e importación, con envíos a comercios de todo el país.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://mayorista.mirrow.com.ar/productos/${categoria.slug}`,
    },
    openGraph: { title, description },
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
  const categoria = getCategoria(slug);
  if (!categoria) notFound();

  const catalogo = getCatalogo();
  const otras = catalogo.filter((c) => c.slug !== categoria.slug);
  const totalFotos = contarFotos(categoria);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-[var(--color-ink)] pb-16 pt-32 text-white sm:pb-20 sm:pt-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-white/50">
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
            <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
              Catálogo mayorista
            </p>
            <h1 className="font-display mt-3 text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
              {categoria.nombre} al por mayor
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              Producción propia e importación de {categoria.nombre.toLowerCase()}, con
              contenedores completos y curvas de talles para comercios de todo el país.
            </p>
            <a
              href={whatsappUrl(`Hola! Quiero pedir catálogo mayorista de ${categoria.nombre} de Mirrow.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full bg-[var(--color-red)] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-red-dark)]"
            >
              Pedir catálogo de {categoria.nombre}
            </a>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {totalFotos === 0 && (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <EmptyState key={index} />
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3">
              {categoria.fotos.map((foto) => (
                <ModeloGallery key={foto.src} categoriaNombre={categoria.nombre} fotos={[foto]} />
              ))}
              {categoria.modelos.map((modelo) => (
                <ModeloGallery
                  key={modelo.slug}
                  nombre={modelo.nombre}
                  categoriaNombre={categoria.nombre}
                  fotos={modelo.fotos}
                />
              ))}
            </div>
          </div>
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
