import Link from "next/link";
import { Logo } from "./Logo";
import { PROVINCIAS } from "@/lib/provincias";
import { getCatalogo } from "@/lib/catalogo";

const EMPRESA = [
  { href: "/#historia", label: "Nuestra historia" },
  { href: "/#por-que-nosotros", label: "Venta mayorista" },
  { href: "/#opiniones", label: "Opiniones" },
  { href: "/#contacto", label: "Contacto" },
];

const linkClass =
  "inline-block transition-all duration-300 ease-out hover:translate-x-1 hover:text-white";

export function Footer() {
  const catalogo = getCatalogo();

  return (
    <footer className="bg-[var(--color-ink)] py-16 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo variant="light" />
            <p className="mt-4 max-w-xs text-sm text-white/60">
              Indumentaria masculina al por mayor desde 1970. Importación, producción y
              distribución para comercios de todo el país.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Catálogo
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
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
