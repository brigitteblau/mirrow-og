import { unstable_cache } from "next/cache";

const POCKETBASE_URL = process.env.POCKETBASE_URL;

export type Foto = {
  src: string;
  alt: string;
};

export type Modelo = {
  slug: string;
  nombre: string;
  descripcion?: string;
  fotos: Foto[];
};

export type CategoriaCatalogo = {
  slug: string;
  nombre: string;
  descripcion?: string;
  /** Texto opcional del badge (ej. "Nuevo", "Destacado"), cargado desde PocketBase. */
  etiqueta?: string;
  /** Fotos ubicadas directamente en la categoría, sin modelo asociado. */
  fotos: Foto[];
  modelos: Modelo[];
};

type PocketBaseFileField = string[];

type CategoriaRecord = {
  id: string;
  slug: string;
  nombre: string;
  descripcion?: string;
  etiqueta?: string;
  fotos: PocketBaseFileField;
};

type ModeloRecord = {
  id: string;
  categoria: string;
  slug: string;
  nombre: string;
  descripcion?: string;
  fotos: PocketBaseFileField;
};

type PocketBaseListResponse<T> = {
  items: T[];
};

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Variaciones de alt pensadas para SEO.
 *
 * Evitamos:
 * - "foto 1"
 * - "foto 2"
 * - textos idénticos
 * - repetir "Mirrow mayorista" de forma artificial
 *
 * Priorizamos búsquedas como:
 * - ropa por mayor
 * - indumentaria mayorista
 * - ropa para revendedores
 * - proveedor de ropa
 * - ropa para locales
 */
const ALT_VARIATIONS = [
  (product: string) => `${product} por mayor | Mirrow`,
  (product: string) => `${product} mayorista para locales de ropa`,
  (product: string) => `${product} para revendedores | Mirrow mayorista`,
  (product: string) => `${product} venta por mayor`,
  (product: string) => `${product} para comercios de indumentaria`,
  (product: string) => `${product} proveedor mayorista | Mirrow`,
  (product: string) => `${product} ropa por mayor para revender`,
  (product: string) => `${product} indumentaria mayorista`,
  (product: string) => `${product} para locales y revendedores`,
  (product: string) => `${product} distribuidor mayorista de indumentaria`,
  (product: string) => `${product} colección mayorista Mirrow`,
  (product: string) => `${product} compra mayorista para tu local`,
  (product: string) => `${product} proveedor de ropa por mayor`,
  (product: string) => `${product} mayorista de ropa en Buenos Aires`,
  (product: string) => `${product} para negocios de indumentaria`,
  (product: string) => `${product} ropa mayorista para comercios`,
];

function buildFotos(
  record: { id: string; fotos: PocketBaseFileField },
  collection: "categorias" | "modelos",
  productName: string
): Foto[] {
  return record.fotos.map((filename, index) => {
    const variation = ALT_VARIATIONS[index % ALT_VARIATIONS.length];

    return {
      src: `${POCKETBASE_URL}/api/files/${collection}/${record.id}/${encodeURIComponent(filename)}`,
      alt: variation(productName),
    };
  });
}

async function fetchCollection<T>(
  collection: string
): Promise<T[]> {
  const url = `${POCKETBASE_URL}/api/collections/${collection}/records?perPage=200&sort=orden,nombre`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`No se pudo leer la colección "${collection}" de PocketBase (${res.status})`);
  }

  const data = (await res.json()) as PocketBaseListResponse<T>;
  return data.items;
}

async function fetchCatalogoFromPocketBase(): Promise<CategoriaCatalogo[]> {
  if (!POCKETBASE_URL) return [];

  const [categoriaRecords, modeloRecords] = await Promise.all([
    fetchCollection<CategoriaRecord>("categorias"),
    fetchCollection<ModeloRecord>("modelos"),
  ]);

  return categoriaRecords.map((catRecord) => {
    const modelosDeCategoria = modeloRecords.filter(
      (modRecord) => modRecord.categoria === catRecord.id
    );

    const modelos: Modelo[] = modelosDeCategoria.map((modRecord) => {
      const productName = `${catRecord.nombre} ${modRecord.nombre}`.trim();

      return {
        slug: modRecord.slug,
        nombre: modRecord.nombre,
        descripcion: modRecord.descripcion || undefined,
        fotos: buildFotos(modRecord, "modelos", productName),
      };
    });

    return {
      slug: catRecord.slug,
      nombre: catRecord.nombre,
      descripcion: catRecord.descripcion || undefined,
      etiqueta: catRecord.etiqueta?.trim() || undefined,
      fotos: buildFotos(catRecord, "categorias", catRecord.nombre),
      modelos,
    };
  });
}

const getCachedCatalogo = unstable_cache(
  fetchCatalogoFromPocketBase,
  ["catalogo"],
  { revalidate: 300, tags: ["catalogo"] }
);

export async function getCatalogo(): Promise<CategoriaCatalogo[]> {
  return getCachedCatalogo();
}

export async function getCategoria(
  slug: string
): Promise<CategoriaCatalogo | undefined> {
  const catalogo = await getCatalogo();
  return catalogo.find((categoria) => categoria.slug === slug);
}

export function getPortada(
  categoria: CategoriaCatalogo
): Foto | undefined {
  return (
    categoria.fotos[0] ??
    categoria.modelos.find(
      (modelo) => modelo.fotos.length > 0
    )?.fotos[0]
  );
}

export function contarFotos(
  categoria: CategoriaCatalogo
): number {
  return (
    categoria.fotos.length +
    categoria.modelos.reduce(
      (total, modelo) =>
        total + modelo.fotos.length,
      0
    )
  );
}
