"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { WHATSAPP_NUMBER, whatsappUrl } from "@/lib/whatsapp";
import { Logo } from "./Logo";

const WhatsappGlyph = ({ size = 27 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
    <path d="M16.01 3C9.38 3 4 8.38 4 15.01c0 2.35.68 4.53 1.86 6.38L4 29l7.8-1.82a11.9 11.9 0 0 0 4.21.77c6.63 0 12.01-5.38 12.01-12.01C28.02 8.38 22.64 3 16.01 3zm7.02 16.98c-.3.83-1.7 1.58-2.35 1.66-.6.08-1.35.11-2.18-.14-.5-.15-1.15-.37-1.98-.72-3.48-1.5-5.75-4.98-5.93-5.21-.17-.24-1.42-1.89-1.42-3.6s.9-2.56 1.22-2.91c.32-.35.7-.44.93-.44.24 0 .47 0 .68.01.22.01.51-.08.8.61.3.72 1.02 2.49 1.11 2.67.09.18.15.39.03.63-.12.24-.18.39-.36.6-.18.21-.38.47-.54.63-.18.18-.37.37-.16.73.21.35.93 1.53 2 2.48 1.37 1.22 2.53 1.6 2.88 1.78.35.18.56.15.77-.09.21-.24.9-1.05 1.14-1.41.24-.35.47-.29.79-.18.32.12 2.05.97 2.4 1.14.35.18.59.26.68.41.09.15.09.85-.21 1.68z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Guion del "bot" — replica el primer contacto de Hernán por WhatsApp */
/* ------------------------------------------------------------------ */

type Step = {
  /** Clave donde se guarda la respuesta. Si falta, es el cierre. */
  key?: string;
  /** Etiqueta corta para el resumen que se manda a WhatsApp. */
  label?: string;
  /** Mensajes que "escribe" el bot en este paso. */
  bot: string[];
  /** Respuestas rápidas opcionales. */
  chips?: string[];
  placeholder?: string;
  final?: boolean;
};

const STEPS: Step[] = [
  {
    key: "yaVende",
    label: "¿Ya vende ropa?",
    bot: [
      "Hola, un gusto 👋 Soy Hernán, de Grupo Mirrow.",
      "Fabricamos e importamos indumentaria masculina, con stock continuo y por pedido.",
      "Para empezar: ¿ya vendés ropa?",
    ],
    chips: ["Sí, ya vendo", "Estoy arrancando", "Todavía no"],
    placeholder: "Contame…",
  },
  {
    key: "busqueda",
    label: "Qué busca",
    bot: ["¿Qué estás buscando?"],
    chips: [
      "Comprar por mayor",
      "Producir con mi marca",
      "Importación",
      "Solo información",
    ],
    placeholder: "Escribí lo que estás buscando…",
  },
  {
    key: "nombre",
    label: "Nombre / empresa",
    bot: ["¿Tu nombre y el de tu empresa? Así te agendo."],
    placeholder: "Nombre personal y/o de la empresa",
  },
  {
    key: "razonSocial",
    label: "Razón social y CUIT",
    bot: [
      "Ahora te pido unos datos para avanzar 📋",
      "1) Razón social y CUIT",
    ],
    chips: ["Todavía no tengo CUIT", "Lo paso por WhatsApp"],
    placeholder: "Razón social y CUIT",
  },
  {
    key: "ubicacion",
    label: "Ciudad / provincia",
    bot: ["2) ¿Ciudad y provincia?"],
    placeholder: "Ciudad y provincia",
  },
  {
    key: "rubro",
    label: "Negocio y forma de venta",
    bot: ["3) ¿A qué se dedica tu negocio y cómo vendés?"],
    chips: [
      "Local a la calle",
      "Online / redes",
      "Mayorista",
      "Revendedor",
      "Varios canales",
    ],
    placeholder: "Local, online, mayorista…",
  },
  {
    key: "antiguedad",
    label: "Antigüedad",
    bot: ["4) ¿Qué antigüedad tenés en el rubro?"],
    chips: ["Estoy arrancando", "Menos de 1 año", "1 a 3 años", "Más de 3 años"],
    placeholder: "Años en el rubro",
  },
  {
    key: "productos",
    label: "Productos de interés",
    bot: ["5) ¿Qué productos te interesan?"],
    chips: [
      "Buzos",
      "Remeras",
      "Chombas",
      "Camperas",
      "Jeans",
      "Sweaters",
      "Varios",
    ],
    placeholder: "Productos que te interesan",
  },
  {
    key: "cantidad",
    label: "Cantidad primera compra",
    bot: ["6) ¿Qué cantidad estimás para una primera compra?"],
    chips: ["Menos de 50", "50 a 150", "150 a 500", "Más de 500", "No sé todavía"],
    placeholder: "Cantidad estimada",
  },
  {
    key: "yaCompraste",
    label: "¿Ya compró antes?",
    bot: ["7) ¿Ya nos compraste anteriormente?"],
    chips: ["Sí", "No"],
    placeholder: "Sí / No",
  },
  {
    final: true,
    bot: [
      "¡Listo! Ya tengo todo 🙌",
      "Seguimos por WhatsApp y te respondo a la brevedad con precios y disponibilidad.",
    ],
  },
];

const STORAGE_KEY = "mirrow_contact_chat_v2";
const LAST_STEP = STEPS.length - 1;

type Sender = "bot" | "user";
type Message = { id: string; from: Sender; text: string };
type Answers = Record<string, string>;

type Persisted = {
  messages: Message[];
  stepIndex: number;
  answers: Answers;
};

function loadPersisted(): Persisted | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Persisted;
    if (!Array.isArray(data.messages)) return null;
    return data;
  } catch {
    return null;
  }
}

function savePersisted(data: Persisted) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* modo incógnito / storage bloqueado: seguimos sin persistir */
  }
}

function buildWhatsappMessage(answers: Answers): string {
  const lines = STEPS.filter((s) => s.key && answers[s.key]).map(
    (s) => `• ${s.label}: ${answers[s.key as string]}`
  );
  return [
    "Hola Hernán! Te dejo mis datos para avanzar con la compra mayorista:",
    "",
    ...lines,
  ].join("\n");
}

const uid = () => Math.random().toString(36).slice(2, 9);
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ */

export function ContactChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [botTyping, setBotTyping] = useState(false);
  const [input, setInput] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const runningRef = useRef(false);

  const currentStep = STEPS[stepIndex];
  const finished = stepIndex >= LAST_STEP;
  const awaitingUser = hydrated && !botTyping && !finished;

  /* Restaurar conversación previa de la sesión (solo cliente, tras el montado). */
  useEffect(() => {
    const saved = loadPersisted();
    if (saved) {
      /* eslint-disable react-hooks/set-state-in-effect -- hidratación desde sessionStorage tras el montado */
      setMessages(saved.messages);
      setStepIndex(saved.stepIndex);
      setAnswers(saved.answers);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
    setHydrated(true);
  }, []);

  /* Persistir en cada cambio relevante. */
  useEffect(() => {
    if (!hydrated) return;
    savePersisted({ messages, stepIndex, answers });
  }, [hydrated, messages, stepIndex, answers]);

  /* Autoscroll al último mensaje. */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, botTyping, open]);

  /* El bot "escribe" los mensajes del paso actual. */
  const playStep = useCallback(async (index: number) => {
    if (runningRef.current) return;
    const step = STEPS[index];
    if (!step) return;

    runningRef.current = true;
    for (const line of step.bot) {
      setBotTyping(true);
      await delay(420 + Math.min(line.length * 14, 900));
      setBotTyping(false);
      setMessages((prev) => [...prev, { id: uid(), from: "bot", text: line }]);
      await delay(260);
    }
    runningRef.current = false;
  }, []);

  /* Al abrir por primera vez, arranca el guion. */
  useEffect(() => {
    if (!open || !hydrated) return;
    if (messages.length === 0 && !runningRef.current) {
      void playStep(0);
    }
    const t = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, [open, hydrated, messages.length, playStep]);

  /* Cerrar con Escape. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const submitAnswer = useCallback(
    (raw: string) => {
      const value = raw.trim();
      if (!value || botTyping || finished) return;

      const step = STEPS[stepIndex];
      setMessages((prev) => [...prev, { id: uid(), from: "user", text: value }]);
      if (step.key) {
        setAnswers((prev) => ({ ...prev, [step.key as string]: value }));
      }
      setInput("");

      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);
      void playStep(nextIndex);
    },
    [botTyping, finished, stepIndex, playStep]
  );

  const restart = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    setMessages([]);
    setAnswers({});
    setStepIndex(0);
    setInput("");
    runningRef.current = false;
    void playStep(0);
  }, [playStep]);

  const waHref = useMemo(() => {
    if (Object.keys(answers).length === 0) {
      return whatsappUrl(
        "Hola! Quiero información para comprar indumentaria masculina por mayor en Mirrow."
      );
    }
    return whatsappUrl(buildWhatsappMessage(answers));
  }, [answers]);

  const handleWhatsapp = () => {
    try {
      (
        window as unknown as { gtag?: (...a: unknown[]) => void }
      ).gtag?.("event", "contact_chat_to_whatsapp");
    } catch {
      /* noop */
    }
  };

  return (
    <>
      {/* Panel */}
      <div
        role="dialog"
        aria-label="Chat con Grupo Mirrow"
        aria-modal="false"
        hidden={!open}
        className="
          fixed inset-x-3 bottom-3 z-50 flex flex-col
          overflow-hidden rounded-3xl border border-black/10 bg-white
          shadow-[0_24px_70px_rgba(0,0,0,0.28)]
          sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-[380px]
        "
        style={{ maxHeight: "min(76vh, 620px)", height: open ? undefined : 0 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 bg-[var(--color-ink)] px-4 py-3.5 text-white">
          <div className="min-w-0 flex-1">
            <Logo variant="light" className="h-5" />
            <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-white/60">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-green)]" />
              Respondemos al instante
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar chat"
            className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Mensajes */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-2.5 overflow-y-auto bg-[var(--color-gray-elegance)] px-4 py-4"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={m.from === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <p
                className={`max-w-[82%] whitespace-pre-line rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                  m.from === "user"
                    ? "rounded-br-md bg-[var(--color-ink)] text-white"
                    : "rounded-bl-md border border-black/10 bg-white text-[var(--color-ink)]"
                }`}
              >
                {m.text}
              </p>
            </div>
          ))}

          {botTyping && (
            <div className="flex justify-start">
              <p className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-black/10 bg-white px-3.5 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-black/30"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </p>
            </div>
          )}

          {finished && (
            <div className="pt-1">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsapp}
                className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(37,211,102,0.35)] transition-colors hover:bg-[#20c75a]"
              >
                <WhatsappGlyph size={18} />
                Continuar por WhatsApp
              </a>
              <button
                type="button"
                onClick={restart}
                className="mt-2 w-full text-center text-xs font-medium text-black/40 underline-offset-2 hover:underline"
              >
                Empezar de nuevo
              </button>
            </div>
          )}
        </div>

        {/* Entrada */}
        {!finished && (
          <div className="border-t border-black/10 bg-white px-3 py-3">
            {currentStep?.chips && awaitingUser && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {currentStep.chips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => submitAnswer(chip)}
                    className="rounded-full border border-black/15 px-3 py-1.5 text-xs font-medium text-[var(--color-ink)]/75 transition-colors hover:border-[var(--color-red)] hover:text-[var(--color-red)]"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitAnswer(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!awaitingUser}
                placeholder={
                  awaitingUser
                    ? currentStep?.placeholder ?? "Escribí tu mensaje…"
                    : "Hernán está escribiendo…"
                }
                className="min-w-0 flex-1 rounded-full border border-black/15 bg-[var(--color-gray-elegance)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-ink)] disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!awaitingUser || !input.trim()}
                aria-label="Enviar"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-white transition-opacity disabled:opacity-40"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-center text-[11px] font-medium text-black/35 hover:text-[var(--color-red)]"
            >
              Prefiero escribir por WhatsApp directamente
            </a>
          </div>
        )}
      </div>

      {/* Botón flotante */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar chat" : "Abrir chat con Grupo Mirrow"}
        aria-expanded={open}
        className="group fixed bottom-5 right-5 z-50 flex items-center justify-center sm:bottom-7 sm:right-7"
      >
        <span
          className="
            pointer-events-none absolute right-[68px] hidden whitespace-nowrap
            rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white
            opacity-0 shadow-xl transition-all duration-300
            group-hover:translate-x-0 group-hover:opacity-100 sm:block
          "
          hidden={open}
        >
          ¿Querés comprar por mayor?
        </span>

        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[#25D366]/30 transition-transform duration-300 group-hover:scale-125"
          hidden={open}
        />

        <span
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-[#20c75a] group-active:scale-95"
        >
          <WhatsappGlyph size={29} />
        </span>
      </button>
    </>
  );
}
