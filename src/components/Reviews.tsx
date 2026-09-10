import { Reveal } from "./Reveal";
import { ReviewsCarousel } from "./ReviewsCarousel";
import { getReviews } from "@/lib/reviews";

const SITE_URL = "https://www.grupomirrow.com.ar";

export async function Reviews() {
  const data = await getReviews();
  const isGoogle = data.source === "google";

  const bajada =
    isGoogle && data.rating
      ? `${data.rating.toFixed(1)} ★ en Google${
          data.total ? ` · ${data.total} reseñas` : ""
        }`
      : "Relaciones que se construyen pedido a pedido.";

  const jsonLd =
    isGoogle && data.rating
      ? {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "Mirrow",
          url: SITE_URL,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: data.rating,
            reviewCount: data.total ?? data.reviews.length,
            bestRating: 5,
            worstRating: 1,
          },
          review: data.reviews.map((r) => ({
            "@type": "Review",
            reviewBody: r.quote,
            author: { "@type": "Person", name: r.name },
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating ?? 5,
              bestRating: 5,
              worstRating: 1,
            },
          })),
        }
      : null;

  return (
    <section
      id="opiniones"
      className="scroll-mt-24 overflow-hidden border-t border-black/10 bg-[var(--color-gray-elegance)] py-20 sm:py-28"
    >
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-red)] sm:text-sm">
            Opiniones
          </p>

          <h2 className="font-display mx-auto mt-3 max-w-3xl text-3xl font-extrabold uppercase tracking-tight text-[var(--color-ink)] sm:text-4xl lg:text-5xl">
            Comercios que eligen trabajar con Mirrow
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-black/50 sm:text-base">
            {bajada}
          </p>
        </Reveal>
      </div>

      <ReviewsCarousel
        reviews={data.reviews}
        badge={isGoogle ? "Reseña de Google" : "Cliente Mirrow"}
      />

      {(data.writeReviewUrl || (isGoogle && data.profileUrl)) && (
        <Reveal className="mx-auto mt-10 flex max-w-7xl flex-col items-center gap-3 px-6 lg:px-8">
          {data.writeReviewUrl && (
            <a
              href={data.writeReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-black"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.5l2.9 6.14 6.6.66-4.98 4.5 1.4 6.7L12 17.02l-5.92 3.48 1.4-6.7-4.98-4.5 6.6-.66L12 2.5z" />
              </svg>
              Dejá tu reseña en Google
            </a>
          )}
          {isGoogle && data.profileUrl && (
            <a
              href={data.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40 transition-colors hover:text-[var(--color-red)]"
            >
              Ver todas las reseñas en Google
            </a>
          )}
        </Reveal>
      )}
    </section>
  );
}
