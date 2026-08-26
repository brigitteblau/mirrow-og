// Genera automáticamente el "slug" a partir de "nombre" cuando el campo
// viene vacío, para que los dueños solo tengan que escribir el nombre del
// producto y nunca un slug a mano.

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

onRecordCreateRequest((e) => {
  if (!e.record.get("slug") && e.record.get("nombre")) {
    e.record.set("slug", slugify(e.record.get("nombre")));
  }
  e.next();
}, "categorias", "modelos");

onRecordUpdateRequest((e) => {
  if (!e.record.get("slug") && e.record.get("nombre")) {
    e.record.set("slug", slugify(e.record.get("nombre")));
  }
  e.next();
}, "categorias", "modelos");
