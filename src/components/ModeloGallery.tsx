"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Foto } from "@/lib/catalogo";

type ModeloGalleryProps = {
  nombre?: string;
  fotos: Foto[];
};

export function ModeloGallery({ nombre, fotos }: ModeloGalleryProps) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const foto = fotos[active] ?? fotos[0];

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Ver de cerca ${nombre ?? "la foto"}`}
        className="relative block aspect-[4/5] w-full overflow-hidden rounded-2xl border border-black/10"
      >
        <Image
          key={foto.src}
          src={foto.src}
          alt={foto.alt}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
        />
      </button>

      {fotos.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {fotos.map((f, index) => (
            <button
              key={f.src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver color ${index + 1} de ${nombre ?? "este modelo"}`}
              aria-pressed={index === active}
              className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                index === active ? "border-[var(--color-red)]" : "border-transparent hover:border-black/15"
              }`}
            >
              <Image src={f.src} alt="" fill sizes="44px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 sm:p-8"
          onClick={() => setOpen(false)}
        >
          <div className="relative w-full max-w-2xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--color-ink)] shadow transition-colors hover:bg-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[var(--color-gray-elegance)] sm:aspect-[4/3]">
              <Image
                key={foto.src}
                src={foto.src}
                alt={foto.alt}
                fill
                sizes="(min-width: 640px) 640px, 100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
