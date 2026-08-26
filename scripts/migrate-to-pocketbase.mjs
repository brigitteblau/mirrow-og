// Script de migración única: sube el catálogo actual de public/productos a PocketBase.
// No se deploya, se corre una sola vez en local.
//
// Uso:
//   PB_URL=https://mirrow.pockethost.io \
//   PB_ADMIN_EMAIL=... \
//   PB_ADMIN_PASSWORD=... \
//   node scripts/migrate-to-pocketbase.mjs

import fs from "node:fs";
import path from "node:path";

const PB_URL = process.env.PB_URL;
const PB_ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL;
const PB_ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD;

if (!PB_URL || !PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
  console.error("Faltan PB_URL, PB_ADMIN_EMAIL o PB_ADMIN_PASSWORD.");
  process.exit(1);
}

const PRODUCTOS_DIR = path.join(process.cwd(), "public", "productos");
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

function slugify(input) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function humanize(folderName) {
  return folderName
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function isImageFile(name) {
  return IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase());
}

function listImageFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && isImageFile(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

async function authenticate() {
  const res = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: PB_ADMIN_EMAIL, password: PB_ADMIN_PASSWORD }),
  });

  if (!res.ok) {
    throw new Error(`No se pudo autenticar contra PocketBase (${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  return data.token;
}

async function createRecord(collection, fields, imageDir, imageFiles, token) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) form.append(key, value);
  }

  for (const filename of imageFiles) {
    const filePath = path.join(imageDir, filename);
    const bytes = fs.readFileSync(filePath);
    form.append("fotos", new Blob([bytes]), filename);
  }

  const res = await fetch(`${PB_URL}/api/collections/${collection}/records`, {
    method: "POST",
    headers: { Authorization: token },
    body: form,
  });

  if (!res.ok) {
    throw new Error(
      `No se pudo crear el record en "${collection}" (${JSON.stringify(fields)}): ${res.status} ${await res.text()}`
    );
  }

  return res.json();
}

async function main() {
  const token = await authenticate();

  const categoriaFolders = fs
    .readdirSync(PRODUCTOS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort();

  let categoriasCreadas = 0;
  let modelosCreados = 0;
  let fotosSubidas = 0;

  for (const catFolder of categoriaFolders) {
    const catDir = path.join(PRODUCTOS_DIR, catFolder);
    const catSlug = slugify(catFolder);
    const catNombre = humanize(catFolder);
    const catFotos = listImageFiles(catDir);

    console.log(`Categoría: ${catNombre} (${catFotos.length} fotos directas)`);

    const catRecord = await createRecord(
      "categorias",
      { slug: catSlug, nombre: catNombre },
      catDir,
      catFotos,
      token
    );
    categoriasCreadas++;
    fotosSubidas += catFotos.length;

    const modeloFolders = fs
      .readdirSync(catDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
      .map((entry) => entry.name)
      .sort();

    for (const modFolder of modeloFolders) {
      const modDir = path.join(catDir, modFolder);
      const modSlug = slugify(modFolder);
      const modNombre = humanize(modFolder);
      const modFotos = listImageFiles(modDir);

      console.log(`  Modelo: ${modNombre} (${modFotos.length} fotos)`);

      await createRecord(
        "modelos",
        { categoria: catRecord.id, slug: modSlug, nombre: modNombre },
        modDir,
        modFotos,
        token
      );
      modelosCreados++;
      fotosSubidas += modFotos.length;
    }
  }

  console.log("\nMigración completa:");
  console.log(`  Categorías: ${categoriasCreadas}`);
  console.log(`  Modelos: ${modelosCreados}`);
  console.log(`  Fotos subidas: ${fotosSubidas}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
