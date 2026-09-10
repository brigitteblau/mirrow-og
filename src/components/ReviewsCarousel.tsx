"use client";

import { useEffect, useRef, useState } from "react";
import type { Review } from "@/lib/reviews";

function Stars({ rating = 5 }: { rating?: number }) {
  const rounded = Math.round(rating);
  return (
    <div
      className="flex gap-0.5 text-[var(--color-red)]"
      aria-label={`${rounded} de 5 estrellas`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={i < rounded ? "" : "text-black/15"}
          aria-hidden="true"
        >
          <path d="M12 2.5l2.9 6.14 6.6.66-4.98 4.5 1.4 6.7L12 17.02l-5.92 3.48 1.4-6.7-4.98-4.5 6.6-.66L12 2.5z" />
        </svg>
      ))}
    </div>
  );
}

type Props = {
  reviews: Review[];
  /** Etiqueta de la esquina de cada tarjeta. */
  badge?: string;
};

export function ReviewsCarousel({ reviews, badge = "Cliente Mirrow" }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationFrame: number;
    const speed = 0.35;

    const animate = () => {
      if (!paused) {
        track.scrollLeft += speed;
        const halfway = track.scrollWidth / 2;
        if (track.scrollLeft >= halfway) {
          track.scrollLeft = 0;
        }
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [paused]);

  const repeatedReviews = [...reviews, ...reviews];

  return (
    <div className="relative mt-12 sm:mt-16">
      {/* Fade lateral */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[var(--color-gray-elegance)] to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[var(--color-gray-elegance)] to-transparent sm:w-24" />

      <div
        ref={trackRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="
          flex
          gap-4
          overflow-x-auto
          px-6
          pb-4
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
          sm:gap-5
          lg:px-8
        "
      >
        {repeatedReviews.map((review, index) => {
          const variant = index % 5;

          const sizeClass =
            variant === 0
              ? "min-w-[300px] sm:min-w-[420px]"
              : variant === 1 || variant === 4
                ? "min-w-[260px] sm:min-w-[320px]"
                : "min-w-[280px] sm:min-w-[350px]";

          const paddingClass = variant === 0 ? "p-7 sm:p-9" : "p-6 sm:p-7";

          return (
            <article
              key={`${review.name}-${index}`}
              className={`
                ${sizeClass}
                ${paddingClass}
                flex
                flex-col
                justify-between
                rounded-[22px]
                border
                border-black/[0.08]
                bg-white
                transition-transform
                duration-300
                hover:-translate-y-1
              `}
            >
              <div>
                <div className="flex items-center justify-between gap-4">
                  <Stars rating={review.rating} />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/30">
                    {badge}
                  </span>
                </div>

                <blockquote className="mt-5">
                  <p
                    className={`font-display tracking-[-0.02em] text-[var(--color-ink)] ${
                      variant === 0
                        ? "text-xl leading-[1.45] sm:text-2xl"
                        : "text-base leading-relaxed sm:text-lg"
                    }`}
                  >
                    “{review.quote}”
                  </p>
                </blockquote>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-xs font-bold uppercase text-white">
                  {review.name.charAt(0)}
                </div>

                <div>
                  {review.sourceUrl ? (
                    <a
                      href={review.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-sm font-bold text-[var(--color-ink)] underline-offset-2 hover:underline"
                    >
                      {review.name}
                    </a>
                  ) : (
                    <p className="text-sm font-bold text-[var(--color-ink)]">
                      {review.name}
                    </p>
                  )}
                  <p className="mt-0.5 text-xs text-black/45">{review.business}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-4 text-center text-[10px] uppercase tracking-[0.18em] text-black/25 sm:hidden">
        Deslizá para ver más
      </p>
    </div>
  );
}
