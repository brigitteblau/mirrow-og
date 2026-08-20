import fs from "node:fs";
import path from "node:path";

const PRODUCTOS_DIR = path.join(process.cwd(), "public", "productos");
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

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
    .replace(/[̀-ͯ]/g, "")
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

function listImages(dir: string, publicPrefix: string, altPrefix: string): Foto[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && isImageFile(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name, index) => ({
      src: `${publicPrefix}/${encodeURIComponent(name)}`,
      alt: `${altPrefix} – foto ${index + 1} | Mirrow mayorista`,
    }));
}

function readCatalogo(): CategoriaCatalogo[] {
  if (!fs.existsSync(PRODUCTOS_DIR)) return [];

  const categoriaFolders = fs
    .readdirSync(PRODUCTOS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort();

  return categoriaFolders.map((catFolder) => {
    const catSlug = slugify(catFolder);
    const catNombre = humanize(catFolder);
    const catDir = path.join(PRODUCTOS_DIR, catFolder);

    const entries = fs.readdirSync(catDir, { withFileTypes: true });
    const modeloFolders = entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
      .map((entry) => entry.name)
      .sort();

    const fotos = listImages(catDir, `/productos/${encodeURIComponent(catFolder)}`, `${catNombre} al por mayor Mirrow`);

    const modelos: Modelo[] = modeloFolders.map((modFolder) => {
      const modSlug = slugify(modFolder);
      const modNombre = humanize(modFolder);
      const modDir = path.join(catDir, modFolder);
      return {
        slug: modSlug,
        nombre: modNombre,
        fotos: listImages(
          modDir,
          `/productos/${encodeURIComponent(catFolder)}/${encodeURIComponent(modFolder)}`,
          `${catNombre} ${modNombre} al por mayor Mirrow`
        ),
      };
    });

    return { slug: catSlug, nombre: catNombre, fotos, modelos };
  });
}

let cache: CategoriaCatalogo[] | null = null;

export function getCatalogo(): CategoriaCatalogo[] {
  if (process.env.NODE_ENV === "production") {
    if (!cache) cache = readCatalogo();
    return cache;
  }
  return readCatalogo();
}

export function getCategoria(slug: string): CategoriaCatalogo | undefined {
  return getCatalogo().find((c) => c.slug === slug);
}

export function getPortada(categoria: CategoriaCatalogo): Foto | undefined {
  return categoria.fotos[0] ?? categoria.modelos.find((m) => m.fotos.length > 0)?.fotos[0];
}

export function contarFotos(categoria: CategoriaCatalogo): number {
  return (
    categoria.fotos.length + categoria.modelos.reduce((total, m) => total + m.fotos.length, 0)
  );
}
