import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { whatsappUrl } from "@/lib/whatsapp";
import { getCatalogo, getPortada } from "@/lib/catalogo";

export async function Products() {
  const catalogo = (await getCatalogo()).filter((categoria) => getPortada(categoria));

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

        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {catalogo.map((categoria, index) => {
            const foto = getPortada(categoria)!;
            const destacada = index === 0;

            return (
              <Reveal
                key={categoria.slug}
                delay={index * 80}
                className={destacada ? "col-span-2 row-span-2" : ""}
              >
                <Link
                  href={`/productos/${categoria.slug}`}
                  className={`group relative block h-full w-full overflow-hidden rounded-2xl border border-black/10 ${
                    destacada ? "aspect-square sm:aspect-auto sm:h-full" : "aspect-[4/5]"
                  }`}
                >
                  <Image
                    src={foto.src}
                    alt={foto.alt}
                    fill
                    sizes={
                      destacada
                        ? "(min-width: 640px) 50vw, 100vw"
                        : "(min-width: 640px) 25vw, 50vw"
                    }
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
                  <h3
                    className={`font-display absolute bottom-0 left-0 p-4 font-extrabold uppercase tracking-tight text-white drop-shadow ${
                      destacada ? "text-2xl sm:text-3xl" : "text-sm"
                    }`}
                  >
                    {categoria.nombre}
                  </h3>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
