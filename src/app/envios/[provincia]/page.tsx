import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { PROVINCIAS } from "@/lib/provincias";
import { getCatalogo, getPortada, type Foto } from "@/lib/catalogo";
import { whatsappUrl } from "@/lib/whatsapp";

const STATS = [
  { value: "56", label: "Años de trayectoria" },
  { value: "+100", label: "Comercios mayoristas" },
  { value: "24-48h", label: "Coordinación de envío" },
];

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

export default async function ProvinciaPage({ params }: Props) {
  const { provincia: slug } = await params;
  const provincia = getProvincia(slug);
  if (!provincia) notFound();

  const otras = PROVINCIAS.filter((p) => p.slug !== provincia.slug).slice(0, 8);
  const catalogo = await getCatalogo();

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-[var(--color-ink)] pb-16 pt-32 text-white sm:pb-24 sm:pt-40">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-white/50">
                <Link href="/" className="transition-colors hover:text-white">
                  Inicio
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-white/70">{provincia.nombre}</span>
              </nav>
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-red)]">
                Región {provincia.region}
              </p>
              <h1 className="font-display mt-3 text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Indumentaria masculina al por mayor en {provincia.nombre}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
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
            </Reveal>

            <Reveal delay={150} className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
              <Image
                src="/images/fabrica-fachada.jpg"
                alt={`Depósito de Mirrow que envía a ${provincia.nombre}`}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </Reveal>
          </div>

          <Reveal delay={250} className="mx-auto mt-14 max-w-7xl px-6 lg:px-8">
            <dl className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="px-4 text-center first:pl-0 last:pr-0 sm:px-8">
                  <dd className="font-display text-2xl font-extrabold text-[var(--color-red)] sm:text-3xl">
                    {stat.value}
                  </dd>
                  <dt className="mt-1 text-[11px] uppercase tracking-wider text-white/50 sm:text-xs">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-red)]">
                Catálogo mayorista
              </p>
              <h2 className="font-display mt-3 text-2xl font-extrabold uppercase tracking-tight text-[var(--color-ink)] sm:text-3xl">
                Qué enviamos a {provincia.nombre}
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
          </div>
        </section>

        <section className="bg-[var(--color-gray-elegance)] py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Reveal>
              <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-[var(--color-ink)]">
                También enviamos a
              </h2>
              <ul className="mt-6 flex flex-wrap gap-3">
                {otras.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/envios/${p.slug}`}
                      className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm text-[var(--color-ink)]/70 transition-colors hover:border-[var(--color-red)] hover:text-[var(--color-red)]"
                    >
                      {p.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="bg-[var(--color-red)] py-14 text-center sm:py-16">
          <Reveal className="mx-auto max-w-2xl px-6 lg:px-8">
            <p className="text-xl font-medium leading-relaxed text-white sm:text-2xl">
              ¿Tenés un comercio en {provincia.nombre}? Pedí tu catálogo mayorista hoy mismo.
            </p>
            <a
              href={whatsappUrl(`Hola! Quiero pedir catálogo mayorista de Mirrow en ${provincia.nombre}.`)}
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
