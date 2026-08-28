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

const SWIPE_THRESHOLD = 45;
const TRACKPAD_THRESHOLD = 40;
const TRACKPAD_COOLDOWN = 650;

export function Hero() {
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);

  /*
   * MOBILE / TOUCH
   */
  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);

  /*
   * TRACKPAD
   */
  const wheelAmount = useRef(0);
  const wheelTimeout = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const wheelLocked = useRef(false);

  /*
   * MOUSE DRAG
   * Hace que también puedas agarrar el Hero
   * y arrastrarlo horizontalmente.
   */
  const pointerStartX = useRef<number | null>(null);
  const pointerCurrentX = useRef<number | null>(null);
  const pointerDragging = useRef(false);

  const next = useCallback(() => {
    setActive((current) => (current + 1) % SLIDES.length);
    setCycle((current) => current + 1);
  }, []);

  const previous = useCallback(() => {
    setActive(
      (current) =>
        (current - 1 + SLIDES.length) % SLIDES.length
    );

    setCycle((current) => current + 1);
  }, []);

  /*
   * AUTOPLAY
   */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      next();
    }, 6000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [active, next]);

  /*
   * TECLADO
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        next();
      }

      if (event.key === "ArrowLeft") {
        previous();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [next, previous]);

  /*
   * SWIPE CELULAR
   */
  const handleTouchStart = (
    event: React.TouchEvent<HTMLElement>
  ) => {
    touchStartX.current = event.touches[0].clientX;
    touchCurrentX.current = event.touches[0].clientX;
  };

  const handleTouchMove = (
    event: React.TouchEvent<HTMLElement>
  ) => {
    touchCurrentX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchCurrentX.current === null
    ) {
      return;
    }

    const distance =
      touchStartX.current - touchCurrentX.current;

    if (distance > SWIPE_THRESHOLD) {
      next();
    } else if (distance < -SWIPE_THRESHOLD) {
      previous();
    }

    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  /*
   * TRACKPAD
   *
   * Swipe horizontal con dos dedos.
   * El scroll vertical de la web sigue funcionando.
   */
  const handleWheel = (
    event: React.WheelEvent<HTMLElement>
  ) => {
    const horizontal = Math.abs(event.deltaX);
    const vertical = Math.abs(event.deltaY);

    if (horizontal <= vertical) {
      return;
    }

    if (wheelLocked.current) {
      return;
    }

    wheelAmount.current += event.deltaX;

    if (wheelTimeout.current) {
      clearTimeout(wheelTimeout.current);
    }

    wheelTimeout.current = setTimeout(() => {
      wheelAmount.current = 0;
    }, 160);

    if (
      Math.abs(wheelAmount.current) <
      TRACKPAD_THRESHOLD
    ) {
      return;
    }

    wheelLocked.current = true;

    if (wheelAmount.current > 0) {
      next();
    } else {
      previous();
    }

    wheelAmount.current = 0;

    setTimeout(() => {
      wheelLocked.current = false;
    }, TRACKPAD_COOLDOWN);
  };

  /*
   * ARRASTRAR CON MOUSE
   *
   * Esto hace que se sienta todavía más parecido
   * al carrusel de Reviews.
   */
  const handlePointerDown = (
    event: React.PointerEvent<HTMLElement>
  ) => {
    if (event.pointerType === "touch") {
      return;
    }

    pointerDragging.current = true;

    pointerStartX.current = event.clientX;
    pointerCurrentX.current = event.clientX;

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLElement>
  ) => {
    if (!pointerDragging.current) {
      return;
    }

    pointerCurrentX.current = event.clientX;
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLElement>
  ) => {
    if (
      !pointerDragging.current ||
      pointerStartX.current === null ||
      pointerCurrentX.current === null
    ) {
      return;
    }

    const distance =
      pointerStartX.current -
      pointerCurrentX.current;

    if (distance > SWIPE_THRESHOLD) {
      next();
    } else if (distance < -SWIPE_THRESHOLD) {
      previous();
    }

    pointerDragging.current = false;
    pointerStartX.current = null;
    pointerCurrentX.current = null;

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }
  };

  return (
    <section
      id="top"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="
        relative
        isolate
        flex
        h-dvh
        min-h-[640px]
        cursor-grab
        touch-pan-y
        select-none
        items-end
        overflow-hidden
        bg-[var(--color-ink)]
        text-white
        active:cursor-grabbing
      "
    >
      {/* IMÁGENES */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.image}
          aria-hidden={index !== active}
          className={`
            absolute
            inset-0
            transition-opacity
            duration-[1000ms]
            ease-out
            ${
              index === active
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }
          `}
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

      {/* OVERLAY */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-t
          from-black/90
          via-black/20
          to-black/25
        "
      />

      {/* CONTENIDO */}
      <div
        className="
          pointer-events-none
          relative
          z-10
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
            mt-3
            max-w-2xl
            font-display
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

      {/* FLECHA IZQUIERDA */}
      <button
        type="button"
        onPointerDown={(event) =>
          event.stopPropagation()
        }
        onClick={previous}
        aria-label="Imagen anterior"
        className="
          group
          absolute
          left-3
          top-1/2
          z-30
          flex
          h-10
          w-10
          -translate-y-1/2
          cursor-pointer
          items-center
          justify-center
          rounded-full
          bg-transparent
          text-white/70
          transition-all
          duration-300
          hover:bg-black/25
          hover:text-white
          hover:backdrop-blur-sm
          active:scale-90
          sm:left-5
          lg:left-7
        "
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="
            h-[18px]
            w-[18px]
            transition-transform
            duration-300
            group-hover:-translate-x-[1px]
          "
        >
          <path
            d="M14.25 6.25C12.8 8 10.8 10.1 8.75 12C10.8 13.9 12.8 16 14.25 17.75"
            stroke="currentColor"
            strokeWidth="1.55"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* FLECHA DERECHA */}
      <button
        type="button"
        onPointerDown={(event) =>
          event.stopPropagation()
        }
        onClick={next}
        aria-label="Siguiente imagen"
        className="
          group
          absolute
          right-3
          top-1/2
          z-30
          flex
          h-10
          w-10
          -translate-y-1/2
          cursor-pointer
          items-center
          justify-center
          rounded-full
          bg-transparent
          text-white/70
          transition-all
          duration-300
          hover:bg-black/25
          hover:text-white
          hover:backdrop-blur-sm
          active:scale-90
          sm:right-5
          lg:right-7
        "
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="
            h-[18px]
            w-[18px]
            transition-transform
            duration-300
            group-hover:translate-x-[1px]
          "
        >
          <path
            d="M9.75 6.25C11.2 8 13.2 10.1 15.25 12C13.2 13.9 11.2 16 9.75 17.75"
            stroke="currentColor"
            strokeWidth="1.55"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </section>
  );
}