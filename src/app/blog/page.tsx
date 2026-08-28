import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { getPosts, formatearFecha } from "@/lib/blog";

const BASE_URL = "https://www.grupomirrow.com.ar";

export const revalidate = 300;

const title = "Blog Mayorista | Mirrow Indumentaria por Mayor";
const description =
  "Notas y guías para comercios y revendedores de indumentaria: cómo comprar ropa por mayor, talles y curvas, envíos, temporadas y producción con marca propia.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
  openGraph: {
    title,
    description,
    url: `${BASE_URL}/blog`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function BlogIndexPage() {
  const posts = await getPosts();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
    ],
  };

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog mayorista de Mirrow",
    description,
    url: `${BASE_URL}/blog`,
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.titulo,
      url: `${BASE_URL}/blog/${post.slug}`,
      datePublished: post.publicado,
      image: post.portada?.src,
      author: { "@type": "Organization", name: post.autor },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <section className="bg-[var(--color-ink)] pb-10 pt-28 text-white sm:pt-36">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/50">
              <Link href="/" className="transition-colors hover:text-white">
                Inicio
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-white/70">Blog</span>
            </nav>
            <h1 className="font-display mt-4 text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
              Blog mayorista
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              {description}
            </p>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {posts.length === 0 ? (
              <div className="mx-auto max-w-lg rounded-2xl border border-black/10 bg-[var(--color-gray-elegance)] p-10 text-center">
                <p className="font-display text-lg font-extrabold uppercase tracking-tight text-[var(--color-ink)]/60">
                  Notas próximamente
                </p>
                <p className="mt-3 text-sm text-black/50">
                  Estamos preparando contenido para comercios y revendedores. Mientras tanto,
                  escribinos por WhatsApp y te asesoramos con tu primer pedido.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, index) => (
                  <Reveal key={post.slug} delay={index * 60} className="min-w-0">
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
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
                        <h2 className="font-display mt-2 text-xl font-extrabold uppercase tracking-tight text-[var(--color-ink)]">
                          {post.titulo}
                        </h2>
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
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
