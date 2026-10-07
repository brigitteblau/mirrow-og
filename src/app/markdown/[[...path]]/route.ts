import { getCatalogo } from "@/lib/catalogo";
import { getPosts } from "@/lib/blog";
import {
  MARKDOWN_CONTENT_TYPE,
  SITE_URL,
  normalizePath,
  renderMarkdown,
} from "@/lib/agent-markdown";

/**
 * Destino interno de `src/proxy.ts` para requests con `Accept: text/markdown`.
 * Responde la versión Markdown de la página pedida (o un 404 en Markdown).
 */
export async function GET(_request: Request, ctx: RouteContext<"/markdown/[[...path]]">) {
  const { path = [] } = await ctx.params;
  const pathname = normalizePath(`/${path.join("/")}`);

  const [catalogo, posts] = await Promise.all([
    getCatalogo().catch(() => []),
    getPosts(),
  ]);
  const { status, body } = renderMarkdown(pathname, { catalogo, posts });

  const headers = new Headers({
    "Content-Type": MARKDOWN_CONTENT_TYPE,
    Vary: "Accept",
    "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
  });
  if (status === 200) {
    headers.set("Link", `<${SITE_URL}${pathname === "/" ? "" : pathname}>; rel="canonical"`);
  } else {
    headers.set("X-Robots-Tag", "noindex");
  }

  return new Response(body, { status, headers });
}
