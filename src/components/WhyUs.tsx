import Image from "next/image";
import { Reveal } from "./Reveal";
import { whatsappUrl } from "@/lib/whatsapp";

const SERVICES = [
  {
    title: "Venta mayorista",
    description: "Contenedores completos, no muestras.",
    image: "/images/taller-mesas.jpg",
    cta: "Pedir catálogo",
    href: whatsappUrl("Hola! Quiero pedir el catálogo mayorista de Mirrow."),
    external: true,
  },
  {
    title: "Producción propia",
    description: "Fabricación e importación con proveedores propios.",
    image: "/images/deposito-pasillo.jpg",
    cta: "Ver categorías",
    href: "#productos",
    external: false,
  },
  {
    title: "Trabajá con nosotros",
    description: "Sumate a la red de +100 comercios.",
    image: "/images/deposito-rollos.png",
    cta: "Ser distribuidor",
    href: whatsappUrl("Hola! Quiero sumarme como distribuidor de Mirrow."),
    external: true,
  },
];

export function WhyUs() {
  return (
    <section id="por-que-nosotros" className="scroll-mt-24 bg-[var(--color-red)] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {SERVICES.map((service, index) => (
            <Reveal
              key={service.title}
              delay={index * 120}
              className="flex flex-col overflow-hidden rounded-2xl bg-white"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col items-center px-6 py-8 text-center">
                <h3 className="font-display text-xl font-extrabold uppercase tracking-tight text-[var(--color-ink)]">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-black/60">
                  {service.description}
                </p>
                <a
                  href={service.href}
                  target={service.external ? "_blank" : undefined}
                  rel={service.external ? "noopener noreferrer" : undefined}
                  className="mt-6 rounded-full bg-[var(--color-red)] px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[var(--color-red-dark)]"
                >
                  {service.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
