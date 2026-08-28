import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { getPosts, formatearFecha } from "@/lib/blog";

export async function BlogPreview() {
  const posts = (await getPosts()).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section
      id="blog"
      className="scroll-mt-24 bg-[var(--color-gray-elegance)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-red)]">
              Blog mayorista
            </p>
            <h2 className="font-display mt-3 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-ink)] sm:text-4xl">
              Notas para comercios y revendedores
            </h2>
          </div>

          <Link
            href="/blog"
            className="shrink-0 rounded-full border border-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-white"
          >
            Ver todas las notas
          </Link>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 80} className="min-w-0">
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-gray-elegance)]">
                  {post.portada ? (
                    <Image
                      src={post.portada.src}
                      alt={post.portada.alt}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="font-display text-lg font-extrabold uppercase tracking-tight text-[var(--color-ink)]/20">
                        MIRROW
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-black/35">
                    {formatearFecha(post.publicado)}
                  </p>
                  <h3 className="font-display mt-2 text-lg font-extrabold uppercase tracking-tight text-[var(--color-ink)]">
                    {post.titulo}
                  </h3>
                  {post.resumen && (
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-black/55">
                      {post.resumen}
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-red)]">
                    Leer nota
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
