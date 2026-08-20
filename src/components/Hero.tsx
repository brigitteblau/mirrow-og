"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

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
  const [cycle, setCycle] = useState(0);

  const next = useCallback(() => {
    setActive((current) => (current + 1) % SLIDES.length);
    setCycle((current) => current + 1);
  }, []);

  const goToSlide = (index: number) => {
    setActive(index);
    setCycle((current) => current + 1);
  };

  useEffect(() => {
    const timer = setInterval(next, 6000);

    return () => clearInterval(timer);
  }, [next]);

  return (
    <section
      id="top"
      className="relative isolate flex h-dvh min-h-[640px] items-end overflow-hidden bg-[var(--color-ink)] text-white"
    >
      {/* Slides */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
            index === active ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={index !== active}
        >
          <Image
            key={index === active ? `${slide.image}-${cycle}` : slide.image}
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover ${
              index === active ? "animate-kenburns" : ""
            }`}
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 sm:pb-24 lg:px-8">
        <p
          key={`eyebrow-${active}`}
          className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em] text-white/70 sm:text-sm"
        >
          {SLIDES[active].eyebrow}
        </p>

        <h1
          key={`title-${active}`}
          className="animate-fade-up font-display mt-3 max-w-2xl text-3xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl [animation-delay:80ms]"
        >
          {SLIDES[active].title}
        </h1>
      </div>

      {/* Slider indicators */}
      <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-9">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Ir a la diapositiva ${index + 1}`}
            aria-current={index === active ? "true" : undefined}
            className="group relative h-6 w-12 sm:w-16"
          >
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/25 transition-colors duration-300 group-hover:bg-white/45" />

            <span
              className={`absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-white transition-all duration-500 ${
                index === active ? "w-full" : "w-0"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}