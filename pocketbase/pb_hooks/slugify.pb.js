// Genera automáticamente el "slug" a partir de "nombre" (categorías y modelos)
// o de "titulo" (posts del blog) cuando el campo viene vacío, para que los
// dueños solo tengan que escribir el nombre/título y nunca un slug a mano.

/// <reference path="../pb_data/types.d.ts" />

const ACCENTS = {
  á: "a", é: "e", í: "i", ó: "o", ú: "u", ñ: "n", ü: "u",
  Á: "a", É: "e", Í: "i", Ó: "o", Ú: "u", Ñ: "n", Ü: "u",
};

function slugify(input) {
  let out = "";
  for (const char of String(input)) {
    out += ACCENTS[char] ?? char;
  }

  return out
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureSlug(e) {
  if (!e.record.get("slug")) {
    const fuente = e.record.get("nombre") || e.record.get("titulo");
    if (fuente) {
      e.record.set("slug", slugify(fuente));
    }
  }
  e.next();
}

onRecordCreateRequest(ensureSlug, "categorias", "modelos", "posts");

onRecordUpdateRequest(ensureSlug, "categorias", "modelos", "posts");
