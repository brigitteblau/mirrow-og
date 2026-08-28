import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { getPosts, getPost, formatearFecha } from "@/lib/blog";
import { whatsappUrl } from "@/lib/whatsapp";

const BASE_URL = "https://www.grupomirrow.com.ar";

export const revalidate = 300;
export const dynamicParams = true;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const title = `${post.titulo} | Mirrow`;
  const description =
    post.resumen ||
    `${post.titulo}. Nota del blog mayorista de Mirrow para comercios y revendedores de indumentaria.`;
  const url = `${BASE_URL}/blog/${post.slug}`;
  const ogImage = post.portada?.src;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.publicado,
      authors: [post.autor],
      images: ogImage ? [{ url: ogImage, alt: post.portada?.alt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const otras = (await getPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);
  const url = `${BASE_URL}/blog/${post.slug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.titulo, item: url },
    ],
  };

  const postJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.titulo,
    description: post.resumen || undefined,
    image: post.portada?.src ? [post.portada.src] : undefined,
    datePublished: post.publicado,
    dateModified: post.publicado,
    author: { "@type": "Organization", name: post.autor },
    publisher: {
      "@type": "Organization",
      name: "Mirrow",
      url: BASE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <article>
          <header className="bg-[var(--color-ink)] pb-10 pt-28 text-white sm:pt-36">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-white/50">
                <Link href="/" className="transition-colors hover:text-white">
                  Inicio
                </Link>
                <span aria-hidden="true">/</span>
                <Link href="/blog" className="transition-colors hover:text-white">
                  Blog
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-white/70">{post.titulo}</span>
              </nav>
              <h1 className="font-display mt-4 text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
                {post.titulo}
              </h1>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-white/40">
                {formatearFecha(post.publicado)} · {post.autor}
              </p>
            </div>
          </header>

          <div className="bg-white py-14 sm:py-20">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
              {post.portada && (
                <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-black/10">
                  <Image
                    src={post.portada.src}
                    alt={post.portada.alt}
                    fill
                    sizes="(min-width: 768px) 768px, 100vw"
                    priority
                    className="object-cover"
                  />
                </div>
              )}

              {post.resumen && (
                <p className="mb-8 text-lg font-medium leading-relaxed text-[var(--color-ink)]/80">
                  {post.resumen}
                </p>
              )}

              <div
                className="prose-mirrow"
                dangerouslySetInnerHTML={{ __html: post.contenidoHtml }}
              />
            </div>
          </div>

          <section className="bg-[var(--color-red)] py-14 text-center sm:py-16">
            <Reveal className="mx-auto max-w-2xl px-6 lg:px-8">
              <p className="text-xl font-medium leading-relaxed text-white sm:text-2xl">
                ¿Tenés un comercio de indumentaria? Escribinos y te pasamos el catálogo y la
                lista de precios mayoristas.
              </p>
              <a
                href={whatsappUrl(
                  `Hola! Leí la nota "${post.titulo}" en el blog de Mirrow y quiero información mayorista.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--color-red)] transition-colors hover:bg-white/90"
              >
                Escribinos por WhatsApp
              </a>
            </Reveal>
          </section>

          {otras.length > 0 && (
            <section className="bg-[var(--color-gray-elegance)] py-16">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-[var(--color-ink)]">
                  Más notas
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {otras.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      className="group rounded-2xl border border-black/10 bg-white p-6 transition-transform duration-300 hover:-translate-y-1"
                    >
                      <p className="text-xs font-semibold uppercase tracking-widest text-black/35">
                        {formatearFecha(p.publicado)}
                      </p>
                      <h3 className="font-display mt-2 text-base font-extrabold uppercase tracking-tight text-[var(--color-ink)]">
                        {p.titulo}
                      </h3>
                      {p.resumen && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-black/55">
                          {p.resumen}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
