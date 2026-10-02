"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Logo } from "./Logo";
import { NewsletterForm, NEWSLETTER_SUSCRIPTO_KEY } from "./NewsletterForm";

const BIENVENIDA_KEY = "mirrow-bienvenida-vista";
const NEWSLETTER_CERRADO_KEY = "mirrow-newsletter-cerrado";

const BIENVENIDA_DELAY_MS = 700;
/** Tiempo navegando antes de ofrecer el newsletter. */
const NEWSLETTER_DELAY_MS = 25_000;
/** Si lo cierra sin anotarse, no se lo volvemos a mostrar por estos días. */
const NEWSLETTER_PAUSA_DIAS = 7;

const TIENDA_MINORISTA_URL = "https://tiendamirrow.com";

type Popup = "bienvenida" | "newsletter" | null;

function leer(storage: "local" | "session", key: string): string | null {
  try {
    return (storage === "local" ? localStorage : sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

function guardar(storage: "local" | "session", key: string, value: string) {
  try {
    (storage === "local" ? localStorage : sessionStorage).setItem(key, value);
  } catch {}
}

function newsletterPendiente(): boolean {
  if (leer("local", NEWSLETTER_SUSCRIPTO_KEY)) return false;
  if (leer("session", NEWSLETTER_CERRADO_KEY)) return false;
  const cerrado = Number(leer("local", NEWSLETTER_CERRADO_KEY));
  if (cerrado && Date.now() - cerrado < NEWSLETTER_PAUSA_DIAS * 86_400_000) return false;
  return true;
}

/**
 * Pop ups globales: primero avisa que la venta es sólo mayorista (una vez por
 * navegador) y, un rato después, ofrece el newsletter. Nunca se superponen.
 */
export function SitePopups() {
  const [abierto, setAbierto] = useState<Popup>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // El contador del newsletter arranca recién cuando no hay bienvenida en pantalla.
  const programarNewsletter = useCallback(() => {
    if (!newsletterPendiente()) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (newsletterPendiente()) setAbierto((actual) => actual ?? "newsletter");
    }, NEWSLETTER_DELAY_MS);
  }, []);

  useEffect(() => {
    if (leer("local", BIENVENIDA_KEY)) {
      programarNewsletter();
    } else {
      timer.current = setTimeout(() => setAbierto("bienvenida"), BIENVENIDA_DELAY_MS);
    }
    return () => clearTimeout(timer.current);
  }, [programarNewsletter]);

  const cerrarBienvenida = useCallback(() => {
    guardar("local", BIENVENIDA_KEY, "1");
    setAbierto(null);
    programarNewsletter();
  }, [programarNewsletter]);

  const cerrarNewsletter = useCallback(() => {
    if (!leer("local", NEWSLETTER_SUSCRIPTO_KEY)) {
      guardar("local", NEWSLETTER_CERRADO_KEY, String(Date.now()));
    }
    guardar("session", NEWSLETTER_CERRADO_KEY, "1");
    setAbierto(null);
  }, []);

  return (
    <>
      <Modal
        abierto={abierto === "bienvenida"}
        onCerrar={cerrarBienvenida}
        titulo="popup-bienvenida-titulo"
        imagen={{ src: "/images/fabrica-fachada.jpg", alt: "Fachada de Mirrow en Once" }}
      >
        <div className="text-center">
          {/* <Logo className="mx-auto h-5" /> */}
          <h2
            id="popup-bienvenida-titulo"
            className="font-display mt-5 text-2xl font-extrabold leading-tight tracking-tight text-[var(--color-ink)]"
          >
            ¡Hola! 
          </h2>
          <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-black/60">
            Hace 56 años dedicandonos a la ropa.
            Minimo: 50 unidades
          </p>

          <p className="mt-6 text-sm font-semibold text-[var(--color-ink)]">
            ¿Sos dueño o encargado de compras?
          </p>
          <button
            type="button"
            onClick={cerrarBienvenida}
            className="mt-3 w-full rounded-full bg-[var(--color-ink)] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-black"
          >
            Sí, seguir
          </button>
          <a
            href={TIENDA_MINORISTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block w-full rounded-full border border-black/10 px-6 py-3.5 text-sm font-medium text-black/70 transition-colors hover:border-black/25 hover:text-[var(--color-ink)]"
          >
            Compro para mí → tiendamirrow.com
          </a>
        </div>
      </Modal>

      <Modal abierto={abierto === "newsletter"} onCerrar={cerrarNewsletter} titulo="popup-newsletter-titulo">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-red)]">
          Newsletter mayorista
        </p>
        <h2
          id="popup-newsletter-titulo"
          className="font-display mt-3 text-2xl font-extrabold uppercase leading-tight tracking-tight text-[var(--color-ink)] sm:text-3xl"
        >
          Enterate primero de cada ingreso
        </h2>
        <p className="mb-6 mt-4 text-base leading-relaxed text-black/60">
          Nuevas temporadas, reposiciones y novedades para tu comercio, directo en tu mail.
        </p>
        <NewsletterForm origen="popup" />
      </Modal>
    </>
  );
}

function Modal({
  abierto,
  onCerrar,
  titulo,
  imagen,
  children,
}: {
  abierto: boolean;
  onCerrar: () => void;
  titulo: string;
  imagen?: { src: string; alt: string };
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (abierto && !dialog.open) {
      dialog.showModal();
      // Foco en la tarjeta y no en la X, para que no aparezca el anillo de foco al abrir.
      dialog.focus();
    }
    if (!abierto && dialog.open) dialog.close();
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titulo}
      tabIndex={-1}
      onClose={() => abierto && onCerrar()}
      onClick={(e) => {
        // Click en el fondo oscuro (fuera de la tarjeta) cierra.
        if (e.target === e.currentTarget) onCerrar();
      }}
      className={`m-auto w-[calc(100%-2rem)] ${
        imagen ? "max-w-sm" : "max-w-md"
      } overflow-hidden rounded-3xl bg-white p-0 shadow-2xl outline-none backdrop:bg-black/60 backdrop:backdrop-blur-sm open:animate-fade-up`}
    >
      <button
        type="button"
        onClick={onCerrar}
        aria-label="Cerrar"
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black/50 shadow-sm transition-colors hover:bg-white hover:text-black"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>
      {imagen && (
        <div className="relative h-36 w-full">
          <Image src={imagen.src} alt={imagen.alt} fill sizes="384px" className="object-cover" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white"
          />
        </div>
      )}
      <div className={`px-7 pb-7 sm:px-9 sm:pb-9 ${imagen ? "pt-2" : "pt-7 sm:pt-9"}`}>{children}</div>
    </dialog>
  );
}
