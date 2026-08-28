import Link from "next/link";
import { Reveal } from "./Reveal";
import { PREGUNTAS, type Pregunta } from "@/lib/preguntas";

type FaqProps = {
  preguntas?: Pregunta[];
  /** Título de la sección. */
  heading?: string;
  bajada?: string;
  /** Muestra el link a la página completa de preguntas frecuentes. */
  showViewAll?: boolean;
  /** Emite el JSON-LD de FAQPage. Desactivar si ya se emite en otra parte de la página. */
  withJsonLd?: boolean;
  /** id del <section>, para anclas de navegación. */
  id?: string;
};

export function Faq({
  preguntas = PREGUNTAS,
  heading = "Preguntas frecuentes",
  bajada = "Todo lo que necesitás saber antes de tu primer pedido mayorista.",
  showViewAll = false,
  withJsonLd = true,
  id = "preguntas-frecuentes",
}: FaqProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preguntas.map((item) => ({
      "@type": "Question",
      name: item.pregunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.respuesta,
      },
    })),
  };

  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-black/10 bg-white py-20 sm:py-28"
    >
      {withJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-red)] sm:text-sm">
            Preguntas frecuentes
          </p>
          <h2 className="font-display mx-auto mt-3 max-w-2xl text-3xl font-extrabold uppercase tracking-tight text-[var(--color-ink)] sm:text-4xl">
            {heading}
          </h2>
          {bajada && (
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-black/50 sm:text-base">
              {bajada}
            </p>
          )}
        </Reveal>

        <Reveal className="mt-12 divide-y divide-black/10 border-y border-black/10">
          {preguntas.map((item) => (
            <details key={item.pregunta} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-display text-base font-bold tracking-tight text-[var(--color-ink)] sm:text-lg [&::-webkit-details-marker]:hidden">
                {item.pregunta}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                  className="shrink-0 text-[var(--color-red)] transition-transform duration-300 group-open:rotate-45"
                >
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-black/60 sm:text-base">
                {item.respuesta}
              </p>
            </details>
          ))}
        </Reveal>

        {showViewAll && (
          <Reveal className="mt-10 text-center">
            <Link
              href="/preguntas-frecuentes"
              className="inline-block rounded-full border border-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-white"
            >
              Ver todas las preguntas
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
