"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Foto } from "@/lib/catalogo";
import { whatsappUrl } from "@/lib/whatsapp";

type ModeloGalleryProps = {
  nombre?: string;
  categoriaNombre?: string;
  fotos: Foto[];
};

function Swatches({
  fotos,
  active,
  onSelect,
  nombre,
  size = "h-12 w-12",
}: {
  fotos: Foto[];
  active: number;
  onSelect: (index: number) => void;
  nombre?: string;
  size?: string;
}) {
  if (fotos.length <= 1) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {fotos.map((f, index) => (
        <button
          key={f.src}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`Ver ${nombre ?? "foto"} ${index + 1}`}
          aria-pressed={index === active}
          className={`relative ${size} shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
            index === active ? "border-[var(--color-red)]" : "border-transparent hover:border-black/20"
          }`}
        >
          <Image src={f.src} alt="" fill sizes="56px" className="object-cover" />
        </button>
      ))}
    </div>
  );
}

export function ModeloGallery({ nombre, categoriaNombre, fotos }: ModeloGalleryProps) {
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

  const consultaLabel = [categoriaNombre, nombre].filter(Boolean).join(" – ");

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Ampliar foto de ${nombre ?? categoriaNombre ?? "producto"}`}
        className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl border border-black/10"
      >
        <Image
          key={foto.src}
          src={foto.src}
          alt={foto.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/10 group-hover:opacity-100">
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--color-ink)]">
            Ver foto
          </span>
        </span>
      </button>

      <Swatches fotos={fotos} active={active} onSelect={setActive} nombre={nombre} />

      {nombre && <h3 className="mt-3 text-sm font-bold text-[var(--color-ink)]">{nombre}</h3>}

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 sm:p-8"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--color-ink)] shadow transition-colors hover:bg-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>

            <div className="relative aspect-[4/5] w-full bg-[var(--color-gray-elegance)] sm:aspect-[4/3]">
              <Image
                key={foto.src}
                src={foto.src}
                alt={foto.alt}
                fill
                sizes="(min-width: 640px) 640px, 100vw"
                className="object-contain"
              />
            </div>

            <div className="p-6">
              <Swatches fotos={fotos} active={active} onSelect={setActive} nombre={nombre} size="h-11 w-11" />

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-5">
                {nombre && <p className="font-display text-base font-extrabold uppercase tracking-tight text-[var(--color-ink)]">{nombre}</p>}
                <a
                  href={whatsappUrl(`Hola! Me interesa el modelo ${consultaLabel || "de Mirrow"}, ¿me pasás precio mayorista?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[var(--color-red)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-red-dark)]"
                >
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
