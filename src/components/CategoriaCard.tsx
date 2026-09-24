import Image from "next/image";
import Link from "next/link";
import type { Foto } from "@/lib/catalogo";

export function CategoriaCard({ slug, nombre, foto }: { slug: string; nombre: string; foto?: Foto }) {
  return (
    <Link href={`/productos/${slug}`} className="group block">
      <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-[var(--color-gray-elegance)] transition-transform duration-300 group-hover:scale-[1.02]">
        {foto ? (
          <Image
            src={foto.src}
            alt={foto.alt}
            fill
            sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 45vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="font-display text-lg font-extrabold uppercase tracking-tight text-[var(--color-ink)]/25">
            MIRROW
          </span>
        )}
      </div>
      <h3 className="mt-3 flex items-center gap-1.5 text-sm font-bold text-[var(--color-ink)]">
        {nombre}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="mt-0.5 transition-transform duration-300 group-hover:translate-x-1"
        >
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </h3>
    </Link>
  );
}
