import type { MetadataRoute } from "next";
import { PROVINCIAS } from "@/lib/provincias";
import { getCatalogo } from "@/lib/catalogo";
import { getPosts } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.grupomirrow.com.ar";
  const [catalogo, posts] = await Promise.all([getCatalogo(), getPosts()]);

  return [
    {
      url: base,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/blog`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${base}/preguntas-frecuentes`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...catalogo.map((categoria) => ({
      url: `${base}/productos/${categoria.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.publicado,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...PROVINCIAS.map((provincia) => ({
      url: `${base}/envios/${provincia.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
