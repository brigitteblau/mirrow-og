"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { whatsappUrl } from "@/lib/whatsapp";

const NAV_LINKS = [
  { href: "#historia", label: "Empresa" },
  { href: "#productos", label: "Catálogo" },
  { href: "#por-que-nosotros", label: "Mayoristas" },
  { href: "#marcas", label: "Confían en nosotros" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full transition-colors duration-300 ${
        scrolled
          ? "bg-[var(--color-ink)]/75 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="#top" className="shrink-0">
          <Logo variant="light" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/70 transition-colors hover:text-[var(--color-red)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm font-medium text-white/50 sm:block">
            Buenos Aires, Argentina
          </span>
          <a
            href={whatsappUrl("Hola! Quiero información para ser cliente mayorista de Mirrow.")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[var(--color-red)] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-red-dark)] sm:px-5 sm:text-sm"
          >
            Contacto mayorista
          </a>
        </div>
      </div>
    </header>
  );
}
