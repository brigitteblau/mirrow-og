"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { REVIEWS } from "@/lib/reviews";

function Stars() {
  return (
    <div
      className="flex items-center justify-center gap-0.5 text-[var(--color-red)]"
      aria-hidden="true"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="17"
          height="17"
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
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  const next = useCallback(() => {
    setDirection(1);
    setActive((current) => (current + 1) % REVIEWS.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setActive(
      (current) => (current - 1 + REVIEWS.length) % REVIEWS.length
    );
  }, []);

  const goTo = (index: number) => {
    if (index === active) return;

    setDirection(index > active ? 1 : -1);
    setActive(index);
  };

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
    touchEnd.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStart.current === null || touchEnd.current === null) return;

    const distance = touchStart.current - touchEnd.current;

    if (distance > 50) {
      next();
    }

    if (distance < -50) {
      prev();
    }
  };

  return (
    <section
      id="opiniones"
      className="scroll-mt-24 overflow-hidden border-t border-black/10 bg-[var(--color-gray-elegance)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
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

        <div
          className="relative mt-12 sm:mt-16"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative min-h-[360px] sm:min-h-[390px]">
            {REVIEWS.map((review, index) => {
              const isActive = index === active;

              return (
                <div
                  key={review.name}
                  aria-hidden={!isActive}
                  className={`
                    absolute inset-0
                    flex items-center justify-center
                    transition-all duration-700
                    [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]
                    ${
                      isActive
                        ? "pointer-events-auto translate-x-0 scale-100 opacity-100"
                        : direction === 1
                          ? "pointer-events-none -translate-x-16 scale-[0.97] opacity-0"
                          : "pointer-events-none translate-x-16 scale-[0.97] opacity-0"
                    }
                  `}
                >
                  <article className="relative w-full overflow-hidden rounded-[28px] border border-black/[0.08] bg-white px-7 py-9 shadow-[0_20px_70px_rgba(0,0,0,0.06)] sm:px-12 sm:py-12 lg:px-16">
                    {/* Decoración */}
                    <div
                      className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[var(--color-red)]/[0.045]"
                      aria-hidden="true"
                    />

                    <div
                      className="pointer-events-none absolute -bottom-20 -left-14 h-48 w-48 rounded-full border border-black/[0.04]"
                      aria-hidden="true"
                    />

                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <Stars />

                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/30">
                          Cliente Mirrow
                        </span>
                      </div>

                      <blockquote className="mt-8">
                        <p className="font-display text-xl font-medium leading-[1.45] tracking-[-0.02em] text-[var(--color-ink)] sm:text-2xl lg:text-[28px]">
                          “{review.quote}”
                        </p>
                      </blockquote>

                      <div className="mt-9 flex items-center gap-4 border-t border-black/[0.07] pt-6">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-sm font-bold uppercase text-white">
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
                    </div>
                  </article>
                </div>
              );
            })}
          </div>

          {/* Controles */}
          <div className="mt-8 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold tabular-nums text-[var(--color-ink)]">
                {String(active + 1).padStart(2, "0")}
              </span>

              <div className="h-px w-20 bg-black/10 sm:w-28">
                <div
                  className="h-full bg-[var(--color-red)] transition-all duration-500"
                  style={{
                    width: `${((active + 1) / REVIEWS.length) * 100}%`,
                  }}
                />
              </div>

              <span className="text-xs tabular-nums text-black/30">
                {String(REVIEWS.length).padStart(2, "0")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {REVIEWS.map((review, index) => (
                <button
                  key={review.name}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Ir a la opinión ${index + 1}`}
                  aria-current={index === active ? "true" : undefined}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === active
                      ? "w-8 bg-[var(--color-red)]"
                      : "w-1.5 bg-black/15 hover:bg-black/30"
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="mt-4 text-right text-[10px] uppercase tracking-[0.18em] text-black/25 sm:hidden">
            Deslizá para ver más
          </p>
        </div>
      </div>
    </section>
  );
}