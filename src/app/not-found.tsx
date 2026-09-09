import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

const DESTINOS = [
  { href: "/productos", label: "Catálogo mayorista", desc: "Buzos, remeras, chombas, sweaters, jeans y más" },
  { href: "/blog", label: "Blog mayorista", desc: "Guías para comercios y revendedores" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes", desc: "Compra mínima, pagos, envíos y talles" },
  { href: "/envios/buenos-aires", label: "Envíos por provincia", desc: "Despachamos a comercios de todo el país" },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-[var(--color-ink)] pb-16 pt-32 text-white sm:pb-24 sm:pt-40">
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
            <p className="font-display text-6xl font-extrabold tracking-tight text-[var(--color-red)] sm:text-7xl">
              404
            </p>
            <h1 className="font-display mt-4 text-2xl font-extrabold uppercase tracking-tight sm:text-4xl">
              No encontramos esa página
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
              El enlace puede estar roto o la página se movió. Probá con alguna de estas
              secciones o escribinos y te ayudamos.
            </p>
            <a
              href={whatsappUrl("Hola! Estaba buscando algo en la web de Mirrow y no lo encontré.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full bg-[var(--color-red)] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-red-dark)]"
            >
              Escribinos por WhatsApp
            </a>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {DESTINOS.map((d) => (
                <Link
                  key={d.href}
                  href={d.href}
                  className="group rounded-2xl border border-black/10 bg-white p-6 transition-transform duration-300 hover:-translate-y-1"
                >
                  <h2 className="font-display flex items-center gap-1.5 text-lg font-extrabold uppercase tracking-tight text-[var(--color-ink)]">
                    {d.label}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1 text-[var(--color-red)]"
                    >
                      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-black/55">{d.desc}</p>
                </Link>
              ))}
            </div>

            <p className="mt-10 text-center text-sm text-black/50">
              O volvé al{" "}
              <Link
                href="/"
                className="font-semibold text-[var(--color-red)] underline underline-offset-2 hover:text-[var(--color-red-dark)]"
              >
                inicio
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
