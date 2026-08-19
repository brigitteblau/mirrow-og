import { Reveal } from "./Reveal";

export function ValueProps() {
  return (
    <div>
      <div className="bg-[var(--color-red)] px-6 py-10 text-center sm:py-14 lg:px-8">
        <Reveal className="mx-auto max-w-3xl">
          <p className="text-xl font-medium leading-relaxed text-white sm:text-2xl">
            Indumentaria masculina de calidad, con el respaldo de 56 años en la industria.
          </p>
        </Reveal>
      </div>
      <Reveal delay={150} className="border border-t-0 border-[var(--color-red)] px-6 py-6 text-center lg:px-8">
        <p className="font-display text-lg font-extrabold uppercase tracking-tight text-[var(--color-red)] sm:text-xl">
          Autenticidad. Versatilidad. Calidad.
        </p>
      </Reveal>
    </div>
  );
}
