// Avisa al sitio en Vercel que el catálogo cambió, para que invalide el
// cache al instante en vez de esperar el revalidate por tiempo (5 min).
//
// Configurar en el entorno de PocketBase:
//   REVALIDATE_URL    -> ej. https://mayorista.mirrow.com.ar/api/revalidate
//   REVALIDATE_SECRET -> mismo valor que la env var REVALIDATE_SECRET en Vercel

/// <reference path="../pb_data/types.d.ts" />

function notifyRevalidate() {
  const url = $os.getenv("REVALIDATE_URL");
  const secret = $os.getenv("REVALIDATE_SECRET");
  if (!url || !secret) return;

  try {
    $http.send({
      url,
      method: "POST",
      headers: { "x-revalidate-secret": secret },
    });
  } catch (err) {
    console.log("No se pudo avisar al sitio para revalidar:", err);
  }
}

onRecordAfterCreateSuccess((e) => {
  notifyRevalidate();
  e.next();
}, "categorias", "modelos");

onRecordAfterUpdateSuccess((e) => {
  notifyRevalidate();
  e.next();
}, "categorias", "modelos");

onRecordAfterDeleteSuccess((e) => {
  notifyRevalidate();
  e.next();
}, "categorias", "modelos");
