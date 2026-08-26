import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { whatsappUrl } from "@/lib/whatsapp";
import { getCatalogo, getPortada } from "@/lib/catalogo";

function CategoriaArt({ foto }: { foto: { src: string; alt: string } }) {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-black/10 transition-transform duration-300 group-hover:scale-[1.02]">
      <Image
        src={foto.src}
        alt={foto.alt}
        fill
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
        className="object-cover"
      />
    </div>
  );
}

export async function Products() {
  const catalogo = (await getCatalogo()).filter((categoria) => getPortada(categoria));

  return (
    <section id="productos" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-red)]">
              Catálogo mayorista
            </p>
            <h2 className="font-display mt-3 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-ink)] sm:text-4xl">
              Categorías de producto
            </h2>
          </div>
          <a
            href={whatsappUrl("Hola! Quiero la lista de precios mayoristas de Mirrow.")}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full border border-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-white"
          >
            Pedir lista de precios
          </a>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {catalogo.map((categoria, index) => (
            <Reveal key={categoria.slug} delay={index * 80}>
              <Link href={`/productos/${categoria.slug}`} className="group block">
                <CategoriaArt foto={getPortada(categoria)!} />
                <h3 className="mt-4 flex items-center gap-2 text-lg font-bold text-[var(--color-ink)]">
                  {categoria.nombre}
                  <svg
                    width="16"
                    height="16"
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
