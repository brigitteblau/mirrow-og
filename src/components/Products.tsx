import Link from "next/link";
import { Reveal } from "./Reveal";
import { ModeloGallery } from "./ModeloGallery";
import { whatsappUrl } from "@/lib/whatsapp";
import { getCatalogo, contarFotos } from "@/lib/catalogo";

export function Products() {
  const catalogo = getCatalogo();

  return (
    <section id="productos" className="scroll-mt-24 bg-white py-20 sm:py-28">
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
            href={whatsappUrl("Hola! Quiero la lista de precios mayoristas de Mirrow.")}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full border border-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-white"
          >
            Pedir lista de precios
          </a>
        </Reveal>

        <div className="mt-16 space-y-16">
          {catalogo.map((categoria) => {
            const items = [
              ...categoria.fotos.map((foto) => ({ key: foto.src, nombre: undefined, fotos: [foto] })),
              ...categoria.modelos.map((modelo) => ({ key: modelo.slug, nombre: modelo.nombre, fotos: modelo.fotos })),
            ];
            const totalFotos = contarFotos(categoria);

            return (
              <Reveal key={categoria.slug}>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <h3 className="font-display text-xl font-extrabold uppercase tracking-tight text-[var(--color-ink)]">
                    {categoria.nombre}
                  </h3>
                  <Link
                    href={`/productos/${categoria.slug}`}
                    className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-red)] transition-colors hover:text-[var(--color-red-dark)]"
                  >
                    Ver catálogo completo de {categoria.nombre}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>

                {totalFotos === 0 ? (
                  <p className="mt-6 text-sm text-black/50">Fotos próximamente.</p>
                ) : (
                  <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                    {items.map((item) => (
                      <ModeloGallery
                        key={item.key}
                        nombre={item.nombre}
                        categoriaNombre={categoria.nombre}
                        fotos={item.fotos}
                      />
                    ))}
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
