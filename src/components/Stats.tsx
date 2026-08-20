import { CountUp } from "./CountUp";
import { Reveal } from "./Reveal";

const STATS = [
  { value: "56", label: "Años de trayectoria" },
  { value: "+100", label: "Comercios mayoristas" },
  { value: "3", label: "Generaciones en el rubro" },
];

export function Stats() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <Reveal className="max-w-lg">
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-red)]">
              Mirrow mayorista
            </p>
            <p className="mt-3 text-xl leading-relaxed text-[var(--color-ink)] sm:text-2xl">
              Importamos, producimos y distribuimos indumentaria masculina al por mayor,
              con cumplimiento y respaldo en cada operación.
            </p>
          </Reveal>

          <Reveal
            delay={150}
            className="flex divide-x divide-black/10 border-t border-black/10 pt-8 lg:border-t-0 lg:pt-0"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="flex-1 px-6 first:pl-0 last:pr-0 sm:flex-none sm:px-10">
                <dl>
                  <dd className="font-display text-4xl font-extrabold tracking-tight text-[var(--color-red)] sm:text-5xl">
                    <CountUp value={stat.value} />
                  </dd>
                  <dt className="mt-2 text-xs uppercase tracking-wider text-black/50 sm:text-sm">
                    {stat.label}
                  </dt>
                </dl>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
