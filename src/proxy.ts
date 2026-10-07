import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MARKDOWN_ROUTE_PREFIX, prefersMarkdown } from "@/lib/agent-markdown";

/**
 * Negociación de contenido para agentes: si la request prefiere
 * `text/markdown`, se reescribe al route handler que arma la versión Markdown
 * de la misma página. Los navegadores siguen recibiendo HTML.
 */
export function proxy(request: NextRequest) {
  if (!prefersMarkdown(request.headers.get("accept"))) {
    return NextResponse.next();
  }
  const url = request.nextUrl.clone();
  url.pathname = `${MARKDOWN_ROUTE_PREFIX}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    {
      // Solo páginas: se excluyen assets, archivos con extensión y rutas internas.
      source: "/((?!api|markdown|_next|.*\\..*).*)",
      has: [{ type: "header", key: "accept", value: ".*text/markdown.*" }],
    },
  ],
};
