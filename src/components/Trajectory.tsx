import Image from "next/image";
import { Reveal } from "./Reveal";

const TIMELINE = [
  { period: "1970", title: "Blau", description: "Primeros comercios propios en Buenos Aires." },
  { period: "1998", title: "Mirrow", description: "Nace nuestra marca propia." },
  { period: "2006", title: "Turgovia", description: "Ampliamos importación y distribución." },
  { period: "Hoy", title: "+100 comercios", description: "Producción propia en toda la Argentina." },
];

export function Trajectory() {
  return (
    <section id="historia" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <Image
            src="/images/deposito-rollos.png"
            alt="Depósito de telas y rollos de Mirrow"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </Reveal>

        <div>
          <Reveal delay={100}>
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-red)]">
              Nuestra historia
            </p>
            <h2 className="font-display mt-3 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-ink)] sm:text-4xl">
              Tres generaciones en el rubro textil
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-black/60">
              De una camisería de barrio a un mayorista que hoy provee a más de 100
              comercios en todo el país.
            </p>
          </Reveal>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8">
            {TIMELINE.map((item, index) => (
              <Reveal
                key={item.title}
                delay={200 + index * 100}
                className="border-l-2 border-[var(--color-red)] pl-4"
              >
                <dt className="text-xs font-semibold uppercase tracking-widest text-black/40">
                  {item.period}
                </dt>
                <dd className="font-display mt-1 text-lg font-bold text-[var(--color-ink)]">
                  {item.title}
                </dd>
                <p className="mt-1 text-sm leading-relaxed text-black/55">{item.description}</p>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
