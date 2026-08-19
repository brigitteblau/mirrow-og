import { Reveal } from "./Reveal";

const BRANDS = ["Rica Lewis", "Bravo", "Braku", "Dafaplast", "Turcotex", "Turgovia"];
const LOOP = [...BRANDS, ...BRANDS];

export function TrustedBrands() {
  return (
    <section id="marcas" className="scroll-mt-24 border-t border-black/10 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-red)]">
            Confían en nosotros
          </p>
          <h2 className="font-display mt-3 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-ink)] sm:text-4xl">
            Marcas y fabricantes que trabajan con Mirrow
          </h2>
        </Reveal>
      </div>

      <Reveal delay={150} className="mt-12 overflow-hidden border-y border-black/10">
        <div className="animate-marquee flex w-max">
          {LOOP.map((brand, index) => (
            <div
              key={`${brand}-${index}`}
              className="flex h-24 w-56 shrink-0 items-center justify-center border-r border-black/10"
            >
              <span className="font-display text-sm font-bold uppercase tracking-tight text-[var(--color-ink)]/70">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
