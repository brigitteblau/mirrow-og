import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { whatsappUrl } from "@/lib/whatsapp";
import { getCatalogo, getPortada } from "@/lib/catalogo";

export async function Products() {
  const catalogo = (await getCatalogo()).filter((categoria) =>
    getPortada(categoria)
  );

  return (
    <section
      id="productos"
      className="scroll-mt-24 bg-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-red)]">
              Catálogo mayorista
            </p>

            <h2 className="font-display mt-3 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-ink)] sm:text-4xl">
              Categorías de producto
            </h2>
          </div>

          <a
            href={whatsappUrl(
              "Hola! Quiero la lista de precios mayoristas de Mirrow."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full border border-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-white"
          >
            Pedir lista de precios
          </a>
        </Reveal>

        {/* 
          MOBILE: 2 columnas
          TABLET: 3 columnas
          DESKTOP: 4 columnas

          La última fila siempre comienza desde la izquierda.
          No depende de cuántas categorías haya.
        */}
        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
          {catalogo.map((categoria, index) => {
            const foto = getPortada(categoria)!;

            return (
              <Reveal
                key={categoria.slug}
                delay={index * 80}
                className="min-w-0"
              >
                <Link
                  href={`/productos/${categoria.slug}`}
                  className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl border border-black/10 bg-neutral-100"
                >
                  <Image
                    src={foto.src}
                    alt={foto.alt}
                    fill
                    sizes="
                      (min-width: 1280px) 25vw,
                      (min-width: 640px) 33vw,
                      50vw
                    "
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  {/* NUEVO / DESTACADO / lo que venga de PocketBase */}
                  {categoria.etiqueta && (
                    <span className="absolute right-3 top-3 rounded-full bg-[var(--color-red)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow">
                      {categoria.etiqueta}
                    </span>
                  )}

                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                    <h3 className="font-display text-base font-extrabold uppercase tracking-tight text-white drop-shadow sm:text-lg">
                      {categoria.nombre}
                    </h3>

                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="shrink-0 text-white transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path
                        d="M9 6l6 6-6 6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}