"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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

const SWIPE_THRESHOLD = 50;

export function Hero() {
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);

  const next = useCallback(() => {
    setActive((current) => (current + 1) % SLIDES.length);
    setCycle((current) => current + 1);
  }, []);

  const previous = useCallback(() => {
    setActive(
      (current) => (current - 1 + SLIDES.length) % SLIDES.length
    );
    setCycle((current) => current + 1);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setActive(index);
    setCycle((current) => current + 1);
  }, []);

  // Cambio automático
  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 6000);

    return () => clearInterval(timer);
  }, [next, active]);

  // Cuando empieza a tocar
  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchStartX.current = event.touches[0].clientX;
    touchCurrentX.current = event.touches[0].clientX;
  };

  // Mientras mueve el dedo
  const handleTouchMove = (event: React.TouchEvent<HTMLElement>) => {
    touchCurrentX.current = event.touches[0].clientX;
  };

  // Cuando suelta el dedo
  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchCurrentX.current === null
    ) {
      return;
    }

    const distance =
      touchStartX.current - touchCurrentX.current;

    // Swipe hacia la izquierda → siguiente
    if (distance > SWIPE_THRESHOLD) {
      next();
    }

    // Swipe hacia la derecha → anterior
    if (distance < -SWIPE_THRESHOLD) {
      previous();
    }

    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  return (
    <section
      id="top"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="
        relative isolate flex h-dvh min-h-[640px]
        touch-pan-y select-none
        items-end overflow-hidden
        bg-[var(--color-ink)] text-white
      "
    >
      {/* Slides */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.image}
          className={`
            absolute inset-0
            transition-opacity
            duration-[1200ms]
            ease-out
            ${
              index === active
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }
          `}
          aria-hidden={index !== active}
        >
          <Image
            key={
              index === active
                ? `${slide.image}-${cycle}`
                : slide.image
            }
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            sizes="100vw"
            draggable={false}
            className={`
              pointer-events-none
              object-cover
              ${
                index === active
                  ? "animate-kenburns"
                  : ""
              }
            `}
          />
        </div>
      ))}

      {/* Overlay */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-gradient-to-t
          from-black/90
          via-black/20
          to-black/30
        "
      />

      {/* Content */}
      <div
        className="
          pointer-events-none
          relative
          mx-auto
          w-full
          max-w-7xl
          px-6
          pb-20
          sm:pb-24
          lg:px-8
        "
      >
        <p
          key={`eyebrow-${active}`}
          className="
            animate-fade-up
            text-xs
            font-semibold
            uppercase
            tracking-[0.2em]
            text-white/70
            sm:text-sm
          "
        >
          {SLIDES[active].eyebrow}
        </p>

        <h1
          key={`title-${active}`}
          className="
            animate-fade-up
            font-display
            mt-3
            max-w-2xl
            text-3xl
            font-extrabold
            uppercase
            leading-[1.05]
            tracking-tight
            sm:text-5xl
            lg:text-6xl
            [animation-delay:80ms]
          "
        >
          {SLIDES[active].title}
        </h1>
      </div>

      {/* Slider indicators */}
      <div
        className="
          absolute
          bottom-7
          left-1/2
          z-20
          flex
          -translate-x-1/2
          items-center
          gap-2
          sm:bottom-9
        "
      >
        {SLIDES.map((slide, index) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Ir a la diapositiva ${index + 1}`}
            aria-current={
              index === active ? "true" : undefined
            }
            className="
              group
              relative
              h-8
              w-12
              cursor-pointer
              touch-manipulation
              sm:w-16
            "
          >
            {/* Línea base */}
            <span
              className="
                absolute
                left-0
                top-1/2
                h-px
                w-full
                -translate-y-1/2
                bg-white/25
                transition-colors
                duration-300
                group-hover:bg-white/45
              "
            />

            {/* Línea activa */}
            <span
              className={`
                absolute
                left-0
                top-1/2
                h-[2px]
                -translate-y-1/2
                bg-white
                transition-all
                duration-500
                ${
                  index === active
                    ? "w-full"
                    : "w-0"
                }
              `}
            />
          </button>
        ))}
      </div>

      {/* Indicador visual mobile para swipe */}
      <div
        className="
          pointer-events-none
          absolute
          right-5
          top-1/2
          z-20
          -translate-y-1/2
          text-xl
          text-white/50
          sm:hidden
        "
        aria-hidden="true"
      >
        ‹ ›
      </div>
    </section>
  );
}