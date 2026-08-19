import { Reveal } from "./Reveal";

const STATS = [
  { value: "56", label: "años de trayectoria" },
  { value: "+100", label: "comercios mayoristas" },
  { value: "3", label: "generaciones en el rubro" },
];

export function Stats() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-lg leading-relaxed text-black/60 sm:text-xl">
            Mirrow importa, produce y distribuye indumentaria masculina al por mayor a
            comercios de todo el país, con cumplimiento y respaldo en cada operación.
          </p>
        </Reveal>

        <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-black/10 pt-8 sm:gap-10">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 100}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-display text-3xl font-extrabold text-[var(--color-red)] sm:text-4xl">
                {stat.value}
              </dd>
              <p className="mt-1 text-xs uppercase tracking-wider text-black/50 sm:text-sm">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
