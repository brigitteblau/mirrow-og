import fs from "node:fs";
import path from "node:path";

const PRODUCTOS_DIR = path.join(process.cwd(), "public", "productos");

const IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
]);

export type Foto = {
  src: string;
  alt: string;
};

export type Modelo = {
  slug: string;
  nombre: string;
  fotos: Foto[];
};

export type CategoriaCatalogo = {
  slug: string;
  nombre: string;
  /** Fotos ubicadas directamente en la carpeta de la categoría, sin subcarpeta de modelo. */
  fotos: Foto[];
  modelos: Modelo[];
};

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function humanize(folderName: string): string {
  return folderName
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function isImageFile(name: string): boolean {
  return IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase());
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

function listImages(
  dir: string,
  publicPrefix: string,
  productName: string
): Foto[] {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && isImageFile(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) =>
      a.localeCompare(b, undefined, {
        numeric: true,
      })
    )
    .map((name, index) => {
      const variation =
        ALT_VARIATIONS[index % ALT_VARIATIONS.length];

      return {
        src: `${publicPrefix}/${encodeURIComponent(name)}`,
        alt: variation(productName),
      };
    });
}

function readCatalogo(): CategoriaCatalogo[] {
  if (!fs.existsSync(PRODUCTOS_DIR)) return [];

  const categoriaFolders = fs
    .readdirSync(PRODUCTOS_DIR, {
      withFileTypes: true,
    })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith(".")
    )
    .map((entry) => entry.name)
    .sort();

  return categoriaFolders.map((catFolder) => {
    const catSlug = slugify(catFolder);
    const catNombre = humanize(catFolder);
    const catDir = path.join(
      PRODUCTOS_DIR,
      catFolder
    );

    const entries = fs.readdirSync(catDir, {
      withFileTypes: true,
    });

    const modeloFolders = entries
      .filter(
        (entry) =>
          entry.isDirectory() &&
          !entry.name.startsWith(".")
      )
      .map((entry) => entry.name)
      .sort();

    /*
     * Imágenes directamente dentro de la categoría.
     *
     * Ej:
     * "Remeras por mayor | Mirrow"
     * "Remeras mayorista para locales de ropa"
     */
    const fotos = listImages(
      catDir,
      `/productos/${encodeURIComponent(catFolder)}`,
      catNombre
    );

    const modelos: Modelo[] = modeloFolders.map(
      (modFolder) => {
        const modSlug = slugify(modFolder);
        const modNombre = humanize(modFolder);
        const modDir = path.join(
          catDir,
          modFolder
        );

        /*
         * Incluimos categoría + modelo.
         *
         * Ej:
         * "Sweater SW1004 negro por mayor | Mirrow"
         */
        const productName =
          `${catNombre} ${modNombre}`.trim();

        return {
          slug: modSlug,
          nombre: modNombre,
          fotos: listImages(
            modDir,
            `/productos/${encodeURIComponent(
              catFolder
            )}/${encodeURIComponent(modFolder)}`,
            productName
          ),
        };
      }
    );

    return {
      slug: catSlug,
      nombre: catNombre,
      fotos,
      modelos,
    };
  });
}

let cache: CategoriaCatalogo[] | null = null;

export function getCatalogo(): CategoriaCatalogo[] {
  if (process.env.NODE_ENV === "production") {
    if (!cache) {
      cache = readCatalogo();
    }

    return cache;
  }

  return readCatalogo();
}

export function getCategoria(
  slug: string
): CategoriaCatalogo | undefined {
  return getCatalogo().find(
    (categoria) => categoria.slug === slug
  );
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