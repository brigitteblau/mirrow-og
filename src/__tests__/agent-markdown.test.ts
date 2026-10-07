import { describe, expect, it } from "vitest";
import {
  htmlToMarkdown,
  llmsTxt,
  normalizePath,
  prefersMarkdown,
  renderMarkdown,
  SITE_URL,
  type MarkdownData,
} from "@/lib/agent-markdown";

const data: MarkdownData = {
  catalogo: [
    {
      slug: "buzos",
      nombre: "Buzos",
      descripcion: "Buzos de algodón frisado",
      fotos: [{ src: "https://pb.test/buzo.jpg", alt: "Buzos por mayor" }],
      modelos: [{ slug: "canguro", nombre: "Canguro", descripcion: "Con capucha", fotos: [] }],
    },
  ],
  posts: [
    {
      slug: "como-comprar",
      titulo: "Cómo comprar por mayor",
      resumen: "Guía paso a paso",
      contenidoHtml: "<h2>Paso 1</h2><p>Elegí <strong>productos</strong> &amp; talles.</p>",
      autor: "Equipo Mirrow",
      publicado: "2026-01-15 10:00:00.000Z",
    },
  ],
};

describe("prefersMarkdown", () => {
  it.each([
    ["text/markdown", true],
    ["text/markdown, text/html;q=0.9", true],
    ["text/markdown, */*", true],
    ["text/html, text/markdown", true],
    ["TEXT/MARKDOWN; charset=utf-8", true],
    ["text/html, text/markdown;q=0.5", false],
    ["text/markdown;q=0", false],
    ["text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", false],
    ["*/*", false],
    ["", false],
    [null, false],
  ])("%s → %s", (accept, expected) => {
    expect(prefersMarkdown(accept)).toBe(expected);
  });
});

describe("normalizePath", () => {
  it("normaliza barras finales y la raíz", () => {
    expect(normalizePath("")).toBe("/");
    expect(normalizePath("/")).toBe("/");
    expect(normalizePath("/productos/")).toBe("/productos");
    expect(normalizePath("blog")).toBe("/blog");
  });
});

describe("renderMarkdown", () => {
  it("devuelve la home en Markdown con catálogo y contacto", () => {
    const { status, body } = renderMarkdown("/", data);
    expect(status).toBe(200);
    expect(body.startsWith("# Mirrow")).toBe(true);
    expect(body).toContain(`[Buzos](${SITE_URL}/productos/buzos)`);
    expect(body).toContain("ventas@grupomirrow.com");
    expect(body).not.toMatch(/<[a-z]+[\s>]/i);
  });

  it.each([
    "/productos",
    "/productos/buzos",
    "/blog",
    "/blog/como-comprar",
    "/preguntas-frecuentes",
    "/mayorista-ropa",
    "/envios/cordoba",
  ])("responde 200 para %s", (path) => {
    const { status, body } = renderMarkdown(path, data);
    expect(status).toBe(200);
    expect(body).toMatch(/^# /);
  });

  it("convierte el contenido de un post", () => {
    const { body } = renderMarkdown("/blog/como-comprar", data);
    expect(body).toContain("## Paso 1");
    expect(body).toContain("Elegí **productos** & talles.");
  });

  it.each([
    "/no-existe",
    "/productos/no-existe",
    "/blog/no-existe",
    "/envios/marte",
    "/productos/buzos/extra",
    "/%E0%A4%A",
  ])("devuelve 404 en Markdown para %s", (path) => {
    const { status, body } = renderMarkdown(path, data);
    expect(status).toBe(404);
    expect(body).toContain("# 404");
    expect(body.length).toBeGreaterThan(20);
    expect(body).toContain(`${SITE_URL}/llms.txt`);
    expect(body).toContain(`${SITE_URL}/sitemap.xml`);
  });

  it("funciona sin datos de PocketBase", () => {
    const { status, body } = renderMarkdown("/", { catalogo: [], posts: [] });
    expect(status).toBe(200);
    expect(body).toContain("pedir catálogo");
  });
});

describe("htmlToMarkdown", () => {
  it("convierte encabezados, links, imágenes, listas y entidades", () => {
    const html = `
      <h3>Título</h3>
      <p>Hola <em>mundo</em> <a href="https://x.test/a?b=1&amp;c=2">link</a><br>otra línea</p>
      <ul><li>uno</li><li>dos</li></ul>
      <ol><li>primero</li><li>segundo</li></ol>
      <img src="https://x.test/i.jpg" alt="foto">
      <script>alert(1)</script>
      <p>&iquest;Qu&eacute; tal? &#8212; &#x41;</p>`;
    const md = htmlToMarkdown(html);
    expect(md).toContain("### Título");
    expect(md).toContain("Hola _mundo_ [link](https://x.test/a?b=1&c=2)\notra línea");
    expect(md).toContain("- uno\n- dos");
    expect(md).toContain("1. primero\n2. segundo");
    expect(md).toContain("![foto](https://x.test/i.jpg)");
    expect(md).toContain("¿Qué tal? — A");
    expect(md).not.toContain("alert");
    expect(md).not.toMatch(/\n{3,}/);
  });
});

describe("llmsTxt", () => {
  const txt = llmsTxt(data);

  it("sigue el formato de llmstxt.org", () => {
    const lines = txt.split("\n");
    expect(lines[0]).toBe("# Mirrow");
    expect(lines.filter((l) => l.startsWith("# "))).toHaveLength(1);
    expect(lines[2].startsWith("> ")).toBe(true);
    // Las secciones H2 contienen solo listas de links "- [nombre](url)".
    const sections = txt.split(/^## /m).slice(1);
    expect(sections.map((s) => s.split("\n")[0])).toEqual(["Docs", "Catálogo", "Blog", "Optional"]);
    for (const section of sections) {
      const items = section.split("\n").slice(1).filter(Boolean);
      expect(items.length).toBeGreaterThan(0);
      for (const item of items) expect(item).toMatch(/^- \[[^\]]+\]\(https:\/\/[^)]+\)(: .+)?$/);
    }
  });

  it("incluye guía de cuándo usar Mirrow y cómo contactarlo", () => {
    expect(txt).toContain("When to use Mirrow");
    expect(txt).toContain("When not to use");
    expect(txt).toContain("How an agent should engage");
    expect(txt).toContain("https://wa.me/5491137743741");
    expect(txt).toContain(`[Buzos](${SITE_URL}/productos/buzos): Buzos de algodón frisado`);
  });
});
