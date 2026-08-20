"use client";

import { useCallback, useEffect, useState } from "react";
import { Reveal } from "./Reveal";
import { REVIEWS } from "@/lib/reviews";

function Stars() {
  return (
    <div className="flex justify-center gap-0.5 text-[var(--color-red)]" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.5l2.9 6.14 6.6.66-4.98 4.5 1.4 6.7L12 17.02l-5.92 3.48 1.4-6.7-4.98-4.5 6.6-.66L12 2.5z" />
        </svg>
      ))}
    </div>
  );
}

export function Reviews() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((current) => (current + 1) % REVIEWS.length);
  }, []);

  const prev = useCallback(() => {
    setActive((current) => (current - 1 + REVIEWS.length) % REVIEWS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next]);

  const review = REVIEWS[active];

  return (
    <section id="opiniones" className="scroll-mt-24 border-t border-black/10 bg-[var(--color-gray-elegance)] py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-red)]">
            Opiniones
          </p>
          <h2 className="font-display mt-3 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-ink)] sm:text-4xl">
            Lo que dicen los comercios que ya trabajan con nosotros
          </h2>
        </Reveal>

        <div className="relative mt-14">
          <div className="relative overflow-hidden">
            {REVIEWS.map((r, index) => (
              <div
                key={r.name}
                className={`transition-opacity duration-500 ease-out ${
                  index === active ? "relative opacity-100" : "absolute inset-0 opacity-0"
                }`}
                aria-hidden={index !== active}
              >
                <div className="flex flex-col items-center rounded-2xl border border-black/10 bg-white p-8 text-center sm:p-12">
                  <Stars />
                  <p className="mt-6 text-lg leading-relaxed text-black/70 sm:text-xl">
                    “{r.quote}”
                  </p>
                  <div className="mt-8 flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-sm font-bold text-white">
                      {r.name.charAt(0)}
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-bold text-[var(--color-ink)]">{r.name}</p>
                      <p className="text-xs text-black/50">{r.business}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={prev}
            aria-label="Opinión anterior"
            className="absolute left-0 top-1/2 hidden -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white p-2.5 text-[var(--color-ink)] shadow-sm transition-colors hover:bg-[var(--color-red)] hover:text-white sm:-left-4 sm:flex"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Siguiente opinión"
            className="absolute right-0 top-1/2 hidden translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white p-2.5 text-[var(--color-ink)] shadow-sm transition-colors hover:bg-[var(--color-red)] hover:text-white sm:-right-4 sm:flex"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {REVIEWS.map((r, index) => (
            <button
              key={r.name}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ir a la opinión ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                index === active ? "w-8 bg-[var(--color-red)]" : "w-1.5 bg-black/15"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
