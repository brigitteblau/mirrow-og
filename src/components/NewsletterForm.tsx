"use client";

import { useActionState, useEffect } from "react";
import { suscribirNewsletter, type NewsletterState } from "@/lib/newsletter";

export const NEWSLETTER_SUSCRIPTO_KEY = "mirrow-newsletter-suscripto";

const initialState: NewsletterState = { status: "idle" };

type Props = {
  origen: "popup" | "footer";
  variant?: "light" | "dark";
  onSuscripto?: () => void;
};

export function NewsletterForm({ origen, variant = "light", onSuscripto }: Props) {
  const [state, formAction, pending] = useActionState(suscribirNewsletter, initialState);

  useEffect(() => {
    if (state.status !== "ok") return;
    try {
      localStorage.setItem(NEWSLETTER_SUSCRIPTO_KEY, "1");
    } catch {}
    onSuscripto?.();
  }, [state.status, onSuscripto]);

  const dark = variant === "dark";

  if (state.status === "ok") {
    return (
      <p
        role="status"
        className={`rounded-2xl px-5 py-4 text-sm font-medium ${
          dark ? "bg-white/10 text-white" : "bg-[var(--color-gray-elegance)] text-[var(--color-ink)]"
        }`}
      >
        ¡Listo! Ya estás anotado. Te vamos a escribir con ingresos y novedades.
      </p>
    );
  }

  const inputClass = `w-full rounded-full border px-5 py-3 text-sm outline-none transition-colors ${
    dark
      ? "border-white/15 bg-white/5 text-white placeholder:text-white/40 focus:border-white/50"
      : "border-black/10 bg-white text-[var(--color-ink)] placeholder:text-black/40 focus:border-[var(--color-ink)]"
  }`;

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="origen" value={origen} />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <label className="sr-only" htmlFor={`newsletter-comercio-${origen}`}>
        Nombre de tu comercio
      </label>
      <input
        id={`newsletter-comercio-${origen}`}
        type="text"
        name="comercio"
        placeholder="Nombre de tu comercio (opcional)"
        autoComplete="organization"
        maxLength={120}
        className={inputClass}
      />

      <label className="sr-only" htmlFor={`newsletter-email-${origen}`}>
        Tu mail
      </label>
      <input
        id={`newsletter-email-${origen}`}
        type="email"
        name="email"
        required
        placeholder="Tu mail"
        autoComplete="email"
        maxLength={200}
        className={inputClass}
      />

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[var(--color-red)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-red-dark)] disabled:opacity-60"
      >
        {pending ? "Anotando..." : "Quiero recibir novedades"}
      </button>

      {state.status === "error" && (
        <p role="alert" className={`text-sm ${dark ? "text-red-300" : "text-[var(--color-red-dark)]"}`}>
          {state.mensaje}
        </p>
      )}
    </form>
  );
}
