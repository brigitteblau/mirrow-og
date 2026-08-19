import { Reveal } from "./Reveal";
import { whatsappUrl } from "@/lib/whatsapp";

export function Contact() {
  return (
    <section id="contacto" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-red)]">
            Sumate como mayorista
          </p>
          <h2 className="font-display mt-3 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-ink)] sm:text-4xl">
            Hablemos de tu pedido
          </h2>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-black/60">
            Contanos qué categorías y volúmenes necesitás. Te respondemos por WhatsApp
            con catálogo y precios mayoristas.
          </p>

          <a
            href={whatsappUrl("Hola! Quiero hacer un pedido mayorista a Mirrow.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[var(--color-red)] px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-red-dark)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.29-1.39c1.44.79 3.06 1.2 4.7 1.2 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2z" opacity=".15"/>
              <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/>
            </svg>
            Escribinos por WhatsApp
          </a>

          <p className="mt-6 text-sm text-black/50">
            Mirrow · Buenos Aires, Argentina · Envíos a todo el país
          </p>
        </Reveal>
      </div>
    </section>
  );
}
