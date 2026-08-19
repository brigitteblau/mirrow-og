import type { MetadataRoute } from "next";
import { PROVINCIAS } from "@/lib/provincias";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://mayorista.mirrow.com.ar";

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...PROVINCIAS.map((provincia) => ({
      url: `${base}/envios/${provincia.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
