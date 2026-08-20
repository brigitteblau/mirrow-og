"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { REVIEWS } from "@/lib/reviews";

function Stars() {
  return (
    <div
      className="flex gap-0.5 text-[var(--color-red)]"
      aria-hidden="true"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2.5l2.9 6.14 6.6.66-4.98 4.5 1.4 6.7L12 17.02l-5.92 3.48 1.4-6.7-4.98-4.5 6.6-.66L12 2.5z" />
        </svg>
      ))}
    </div>
  );
}

export function Reviews() {
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

  const repeatedReviews = [...REVIEWS, ...REVIEWS];

  return (
    <section
      id="opiniones"
      className="scroll-mt-24 overflow-hidden border-t border-black/10 bg-[var(--color-gray-elegance)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-red)] sm:text-sm">
            Opiniones
          </p>

          <h2 className="font-display mx-auto mt-3 max-w-3xl text-3xl font-extrabold uppercase tracking-tight text-[var(--color-ink)] sm:text-4xl lg:text-5xl">
            Comercios que eligen trabajar con Mirrow
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-black/50 sm:text-base">
            Relaciones que se construyen pedido a pedido.
          </p>
        </Reveal>
      </div>

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

            const paddingClass =
              variant === 0
                ? "p-7 sm:p-9"
                : "p-6 sm:p-7";

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
                    <Stars />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/30">
                      Cliente Mirrow
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
                    <p className="text-sm font-bold text-[var(--color-ink)]">
                      {review.name}
                    </p>

                    <p className="mt-0.5 text-xs text-black/45">
                      {review.business}
                    </p>
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
    </section>
  );
}