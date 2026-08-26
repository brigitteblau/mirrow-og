import type { MetadataRoute } from "next";
import { PROVINCIAS } from "@/lib/provincias";
import { getCatalogo } from "@/lib/catalogo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.grupomirrow.com.ar";
  const catalogo = await getCatalogo();

  return [
    {
      url: base,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...catalogo.map((categoria) => ({
      url: `${base}/productos/${categoria.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...PROVINCIAS.map((provincia) => ({
      url: `${base}/envios/${provincia.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
