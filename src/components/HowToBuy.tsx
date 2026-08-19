import Image from "next/image";
import { Reveal } from "./Reveal";
import { whatsappUrl } from "@/lib/whatsapp";

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4 3.5V16H5.5A1.5 1.5 0 0 1 4 14.5v-9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 9h8M8 12h5" strokeLinecap="round" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3.5" y="4.5" width="17" height="12" rx="1.5" />
      <path d="M8.5 20h7M12 16.5V20" strokeLinecap="round" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" strokeLinecap="round" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M19 19v.5A3.5 3.5 0 0 1 15.5 23H13" strokeLinecap="round" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M2.5 6.5h11v10h-11z" strokeLinejoin="round" />
      <path d="M13.5 10h4.2l3.3 3.3v3.2h-7.5z" strokeLinejoin="round" />
      <circle cx="6.5" cy="18" r="1.8" />
      <circle cx="16.5" cy="18" r="1.8" />
    </svg>
  );
}

const STEPS = [
  {
    icon: ChatIcon,
    title: "Pedir el catálogo por WhatsApp",
  },
  {
    icon: MonitorIcon,
    title: "Entrar al link mayorista y armar el pedido (caja, media caja o curva)",
  },
  {
    icon: HeadsetIcon,
    title: "Arreglar con el vendedor forma de pago y envío",
  },
  {
    icon: TruckIcon,
    title: "Pagás y despachamos (o retirás por depósito)",
  },
];

export function HowToBuy() {
  return (
    <section id="paso-a-paso" className="scroll-mt-24 bg-[var(--color-ink)] text-white">
      <div className="relative flex min-h-[420px] items-center overflow-hidden py-24 sm:py-32">
        <Image
          src="/images/deposito-pasillo.jpg"
          alt="Depósito de indumentaria Mirrow"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[var(--color-ink)]/80" />
        <Reveal className="relative mx-auto w-full max-w-4xl px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
            Comprá mayorista sin salir de tu comercio
          </p>
          <h2 className="font-display mt-3 max-w-xl text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-5xl">
            El paso a paso para comprar online
          </h2>
          <div className="mt-6 h-0.5 w-16 bg-[var(--color-red)]" />
        </Reveal>
      </div>

      <div className="relative overflow-hidden">
        <Image
          src="/images/fabrica-fachada.jpg"
          alt="Despacho de pedidos mayoristas Mirrow"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[var(--color-ink)]/85" />

        <div className="relative mx-auto max-w-3xl px-6 py-20 sm:py-24 lg:px-8">
          <ol className="space-y-10">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === STEPS.length - 1;
              return (
                <Reveal key={step.title} delay={index * 120}>
                  <li className="relative flex items-start gap-5 pl-1">
                    {!isLast && (
                      <span
                        aria-hidden="true"
                        className="absolute left-[27px] top-14 h-10 w-px bg-white/25"
                      />
                    )}
                    <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur">
                      <Icon />
                      <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-red)] text-xs font-bold">
                        {index + 1}
                      </span>
                    </span>
                    <p className="mt-3 text-lg leading-snug text-white/90">{step.title}</p>
                  </li>
                </Reveal>
              );
            })}
          </ol>

          <a
            href={whatsappUrl("Hola! Quiero empezar a comprar mayorista en Mirrow.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-14 inline-block rounded-full bg-[var(--color-red)] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-red-dark)]"
          >
            Empezar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
