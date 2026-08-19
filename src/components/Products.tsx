import { Reveal } from "./Reveal";
import { whatsappUrl } from "@/lib/whatsapp";

const CATEGORIES = [
  "Sweaters",
  "Camperas",
  "Pantalones cargo",
  "Jeans",
  "Remeras y chombas",
  "Ropa térmica",
];

function PlaceholderArt() {
  return (
    <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-[var(--color-gray-elegance)]">
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
          {CATEGORIES.map((category, index) => (
            <Reveal key={category} delay={index * 80}>
              <PlaceholderArt />
              <h3 className="mt-3 text-base font-bold text-[var(--color-ink)]">{category}</h3>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
