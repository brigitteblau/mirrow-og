"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { whatsappUrl } from "@/lib/whatsapp";

const SLIDES = [
  {
    image: "/images/fabrica-fachada.jpg",
    eyebrow: "Desde 1970 · Buenos Aires",
    title: "56 años haciendo historia textil",
  },
  {
    image: "/images/taller-mesas.jpg",
    eyebrow: "Producción propia",
    title: "Eficiencia en cada orden",
  },
  {
    image: "/images/deposito-rollos.png",
    eyebrow: "Alcance nacional",
    title: "Más de 100 comercios confían en nosotros",
  },
];

export function Hero() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((current) => (current + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setActive((current) => (current - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section
      id="top"
      className="relative isolate flex h-[85vh] min-h-[520px] items-end overflow-hidden bg-[var(--color-ink)] text-white sm:h-[90vh]"
    >
      {SLIDES.map((slide, index) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
            index === active ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={index !== active}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />

      <button
        type="button"
        onClick={prev}
        aria-label="Anterior"
        className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/20 p-3 text-white backdrop-blur transition-colors hover:bg-[var(--color-red)] sm:flex"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Siguiente"
        className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/20 p-3 text-white backdrop-blur transition-colors hover:bg-[var(--color-red)] sm:flex"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-14 sm:pb-16 lg:px-8">
        <p key={`eyebrow-${active}`} className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em] text-white/70 sm:text-sm">
          {SLIDES[active].eyebrow}
        </p>
        <h1
          key={`title-${active}`}
          className="animate-fade-up font-display mt-3 max-w-2xl text-3xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl [animation-delay:80ms]"
        >
          {SLIDES[active].title}
        </h1>

        <div className="mt-7 flex flex-wrap items-center gap-4 sm:mt-8">
          <a
            href={whatsappUrl("Hola! Quiero información para ser cliente mayorista de Mirrow.")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[var(--color-red)] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[var(--color-red-dark)] sm:px-7 sm:py-3.5 sm:text-sm"
          >
            Solicitar catálogo por WhatsApp
          </a>

          <div className="flex gap-2">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.image}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Ir a la diapositiva ${index + 1}`}
                className={`h-1.5 w-8 rounded-full transition-colors sm:w-10 ${
                  index === active ? "bg-[var(--color-red)]" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
