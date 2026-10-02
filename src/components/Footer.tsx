import Link from "next/link";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import { PROVINCIAS } from "@/lib/provincias";
import { getCatalogo } from "@/lib/catalogo";

const EMPRESA = [
  { href: "/#historia", label: "Nuestra historia" },
  { href: "/#por-que-nosotros", label: "Venta mayorista" },
  { href: "/#opiniones", label: "Opiniones" },
  { href: "/#contacto", label: "Contacto" },
];

const RECURSOS = [
  { href: "/mayorista-ropa", label: "Mayorista de ropa" },
  { href: "/blog", label: "Blog mayorista" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
];

const TIENDA_MINORISTA_URL = "https://tiendamirrow.com";

const linkClass =
  "inline-block transition-all duration-300 ease-out hover:translate-x-1 hover:text-white";

export async function Footer() {
  const catalogo = await getCatalogo();

  return (
    <footer className="bg-[var(--color-ink)] py-16 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <section
          aria-labelledby="newsletter-footer-titulo"
          className="relative mb-16 overflow-hidden rounded-3xl bg-white px-6 py-10 text-[var(--color-ink)] sm:px-10 lg:px-14 lg:py-14"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[var(--color-blue)]/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1.5 bg-[var(--color-red)]"
          />
          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-red)]">
                Newsletter mayorista
              </p>
              <h3
                id="newsletter-footer-titulo"
                className="mt-3 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl"
              >
                Enterate primero de cada ingreso
              </h3>
              <p className="mt-4 max-w-md text-sm text-black/60">
                Ingresos de temporada, reposiciones y novedades para tu comercio, directo en tu
                mail.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-black/70">
                {["Ingresos de temporada", "Reposiciones", "Sin spam"].map((item) => (
                  <li
                    key={item}
                    className="rounded-full bg-[var(--color-gray-elegance)] px-3 py-1.5"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <NewsletterForm origen="footer" variant="light" layout="grid" />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <Logo variant="light" />
            <p className="mt-4 max-w-xs text-sm text-white/60">
              Indumentaria masculina al por mayor desde 1970. Importación, producción y
              distribución para comercios de todo el país.
            </p>
            <a
              href="mailto:ventas@grupomirrow.com"
              className={`mt-4 inline-block text-sm text-white/70 ${linkClass}`}
            >
              ventas@grupomirrow.com
            </a>
            <div className="mt-3 flex flex-col gap-1.5 text-sm text-white/70">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Mirrow+Castelli+334+Buenos+Aires"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Mirrow Castelli — Castelli 334, Once
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Mirrow+Showroom+Sarmiento+2790+Buenos+Aires"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Showroom Sarmiento — Sarmiento 2790, Once
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
              <Link href="/productos" className={linkClass}>
                Catálogo
              </Link>
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>
                <Link href="/productos" className={`${linkClass} font-semibold text-white`}>
                  Ver catálogo completo
                </Link>
              </li>
              {catalogo.map((categoria) => (
                <li key={categoria.slug}>
                  <Link href={`/productos/${categoria.slug}`} className={linkClass}>
                    {categoria.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Empresa
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {EMPRESA.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Recursos
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {RECURSOS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={TIENDA_MINORISTA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Tienda minorista
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Envíos por provincia
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/70">
              {PROVINCIAS.map((provincia) => (
                <li key={provincia.slug}>
                  <Link href={`/envios/${provincia.slug}`} className={linkClass}>
                    {provincia.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Mirrow. Todos los derechos reservados.</p>
          <p>Buenos Aires, Argentina</p>
        </div>
      </div>
    </footer>
  );
}
