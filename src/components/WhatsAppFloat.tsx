import { whatsappUrl } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl("Hola! Quiero información para ser cliente mayorista de Mirrow.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-colors hover:bg-[#1EBE57] sm:bottom-7 sm:right-7"
    >
      <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366] animate-ping-slow" aria-hidden="true" />
      <svg width="30" height="30" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M16.01 3C9.38 3 4 8.38 4 15.01c0 2.35.68 4.53 1.86 6.38L4 29l7.8-1.82a11.9 11.9 0 0 0 4.21.77c6.63 0 12.01-5.38 12.01-12.01C28.02 8.38 22.64 3 16.01 3zm7.02 16.98c-.3.83-1.7 1.58-2.35 1.66-.6.08-1.35.11-2.18-.14-.5-.15-1.15-.37-1.98-.72-3.48-1.5-5.75-4.98-5.93-5.21-.17-.24-1.42-1.89-1.42-3.6s.9-2.56 1.22-2.91c.32-.35.7-.44.93-.44.24 0 .47.002.68.012.22.01.51-.083.8.61.3.72 1.02 2.49 1.11 2.67.09.18.15.39.03.63-.12.24-.18.39-.36.6-.18.21-.38.47-.54.63-.18.18-.37.37-.16.73.21.35.93 1.53 2 2.48 1.37 1.22 2.53 1.6 2.88 1.78.35.18.56.15.77-.09.21-.24.9-1.05 1.14-1.41.24-.35.47-.29.79-.18.32.12 2.05.97 2.4 1.14.35.18.59.26.68.41.09.15.09.85-.21 1.68z" />
      </svg>
    </a>
  );
}
