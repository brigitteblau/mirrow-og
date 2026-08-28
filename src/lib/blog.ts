import { unstable_cache } from "next/cache";
import type { Foto } from "./catalogo";

const POCKETBASE_URL = process.env.POCKETBASE_URL;

export type Post = {
  slug: string;
  titulo: string;
  resumen: string;
  contenidoHtml: string;
  portada?: Foto;
  autor: string;
  publicado: string;
};

type PocketBaseFileField = string[];

type PostRecord = {
  id: string;
  slug: string;
  titulo: string;
  resumen?: string;
  contenido?: string;
  portada?: PocketBaseFileField | string;
  autor?: string;
  publicado?: string;
};

type PocketBaseListResponse<T> = {
  items: T[];
};

function primeraImagen(field: PostRecord["portada"]): string | undefined {
  if (Array.isArray(field)) return field[0];
  return field || undefined;
}

async function fetchPostsFromPocketBase(): Promise<Post[]> {
  if (!POCKETBASE_URL) return [];

  const url = `${POCKETBASE_URL}/api/collections/posts/records?perPage=200&sort=-publicado`;

  let items: PostRecord[];
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`PocketBase respondió ${res.status} al leer "posts"`);
    }
    const data = (await res.json()) as PocketBaseListResponse<PostRecord>;
    items = data.items;
  } catch (error) {
    console.error("No se pudo leer el blog de PocketBase:", error);
    return [];
  }

  const ahora = Date.now();

  return items
    .filter((record) => {
      if (!record.slug || !record.publicado) return false;
      const fecha = new Date(record.publicado).getTime();
      return Number.isFinite(fecha) && fecha <= ahora;
    })
    .map((record) => {
      const filename = primeraImagen(record.portada);
      const portada: Foto | undefined = filename
        ? {
            src: `${POCKETBASE_URL}/api/files/posts/${record.id}/${encodeURIComponent(filename)}`,
            alt: `${record.titulo} | Blog mayorista de Mirrow`,
          }
        : undefined;

      return {
        slug: record.slug,
        titulo: record.titulo,
        resumen: record.resumen?.trim() || "",
        contenidoHtml: record.contenido || "",
        portada,
        autor: record.autor?.trim() || "Equipo Mirrow",
        publicado: record.publicado!,
      };
    });
}

const getCachedPosts = unstable_cache(fetchPostsFromPocketBase, ["blog"], {
  revalidate: 300,
  tags: ["blog"],
});

export async function getPosts(): Promise<Post[]> {
  return getCachedPosts();
}

export async function getPost(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug);
}

export function formatearFecha(iso: string): string {
  const fecha = new Date(iso);
  if (!Number.isFinite(fecha.getTime())) return "";
  return fecha.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
