import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PROVINCIAS } from "@/lib/provincias";
import { whatsappUrl } from "@/lib/whatsapp";

export function generateStaticParams() {
  return PROVINCIAS.map((provincia) => ({ provincia: provincia.slug }));
}

type Props = {
  params: Promise<{ provincia: string }>;
};

function getProvincia(slug: string) {
  return PROVINCIAS.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { provincia: slug } = await params;
  const provincia = getProvincia(slug);
  if (!provincia) return {};

  const title = `Indumentaria masculina al por mayor en ${provincia.nombre} | Mirrow`;
  const description = `Mirrow envía indumentaria masculina al por mayor a comercios de ${provincia.nombre}. Importación, producción propia y 56 años de trayectoria familiar.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://mayorista.mirrow.com.ar/envios/${provincia.slug}`,
    },
    openGraph: { title, description },
  };
}

export default async function ProvinciaPage({ params }: Props) {
  const { provincia: slug } = await params;
  const provincia = getProvincia(slug);
  if (!provincia) notFound();

  const otras = PROVINCIAS.filter((p) => p.slug !== provincia.slug).slice(0, 8);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-[var(--color-ink)] pb-20 pt-32 text-white sm:pb-28 sm:pt-40">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
              Región {provincia.region}
            </p>
            <h1 className="font-display mt-3 text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
              Indumentaria masculina al por mayor en {provincia.nombre}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              Mirrow, con 56 años de trayectoria familiar en la industria textil, envía
              pedidos mayoristas de sweaters, camperas, jeans, pantalones cargo y ropa
              térmica a comercios de {provincia.nombre} y de todo el país, con
              contenedores completos y documentación técnica en cada envío.
            </p>
            <a
              href={whatsappUrl(`Hola! Quiero pedir catálogo mayorista de Mirrow en ${provincia.nombre}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full bg-[var(--color-red)] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-red-dark)]"
            >
              Pedir catálogo mayorista en {provincia.nombre}
            </a>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-[var(--color-ink)]">
              También enviamos a
            </h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {otras.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/envios/${p.slug}`}
                    className="rounded-full border border-black/15 px-4 py-2 text-sm text-[var(--color-ink)]/70 transition-colors hover:border-[var(--color-red)] hover:text-[var(--color-red)]"
                  >
                    {p.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
