import Link from "next/link";
import { Reveal } from "./Reveal";
import { whatsappUrl } from "@/lib/whatsapp";
import { CATEGORIAS } from "@/lib/categorias";

function PlaceholderArt() {
  return (
    <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-[var(--color-gray-elegance)] transition-transform duration-300 group-hover:scale-[1.02]">
      <span className="font-display text-lg font-extrabold uppercase tracking-tight text-[var(--color-ink)]/25">
        MIRROW
      </span>
      <span className="absolute bottom-3 right-3 rounded-full border border-black/10 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-black/40">
        Foto próximamente
      </span>
    </div>
  );
}

export function Products() {
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

        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3">
          {CATEGORIAS.map((categoria, index) => (
            <Reveal key={categoria.slug} delay={index * 80}>
              <Link href={`/productos/${categoria.slug}`} className="group block">
                <PlaceholderArt />
                <h3 className="mt-3 flex items-center gap-1.5 text-base font-bold text-[var(--color-ink)]">
                  {categoria.nombre}
                  <svg
                    width="14"
                    height="14"
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
