import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import {
  getRewrittenUrl,
  isRewrite,
  unstable_doesMiddlewareMatch,
} from "next/experimental/testing/server";
import { config, proxy } from "@/proxy";
import nextConfig from "../../next.config";

const md = { accept: "text/markdown" };
const browser = { accept: "text/html,application/xhtml+xml,*/*;q=0.8" };

function request(path: string, headers: Record<string, string>) {
  return new NextRequest(`https://www.grupomirrow.com.ar${path}`, { headers });
}

describe("proxy", () => {
  it("reescribe la home a la versión Markdown", () => {
    const res = proxy(request("/", md));
    expect(isRewrite(res)).toBe(true);
    expect(getRewrittenUrl(res)).toBe("https://www.grupomirrow.com.ar/markdown");
  });

  it("reescribe subpáginas conservando la ruta", () => {
    const res = proxy(request("/productos/buzos", md));
    expect(getRewrittenUrl(res)).toBe("https://www.grupomirrow.com.ar/markdown/productos/buzos");
  });

  it("no toca requests de navegador", () => {
    expect(isRewrite(proxy(request("/", browser)))).toBe(false);
    expect(isRewrite(proxy(request("/", { accept: "text/html, text/markdown;q=0.1" })))).toBe(false);
  });

  it("solo se ejecuta para páginas que piden Markdown", () => {
    const match = (url: string, headers?: Record<string, string>) =>
      unstable_doesMiddlewareMatch({ config, nextConfig, url, headers });
    expect(match("/", md)).toBe(true);
    expect(match("/blog/algo", md)).toBe(true);
    expect(match("/", browser)).toBe(false);
    expect(match("/llms.txt", md)).toBe(false);
    expect(match("/images/logo.svg", md)).toBe(false);
    expect(match("/_next/static/chunk.js", md)).toBe(false);
    expect(match("/api/revalidate", md)).toBe(false);
    expect(match("/markdown", md)).toBe(false);
  });
});

describe("next.config headers", () => {
  it("agrega Vary: Accept a todas las rutas", async () => {
    const rules = await nextConfig.headers!();
    expect(rules).toContainEqual({ source: "/:path*", headers: [{ key: "Vary", value: "Accept" }] });
  });
});
