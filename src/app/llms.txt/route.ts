import { getCatalogo } from "@/lib/catalogo";
import { getPosts } from "@/lib/blog";
import { llmsTxt } from "@/lib/agent-markdown";

export const revalidate = 300;

/** Índice para agentes de IA según https://llmstxt.org */
export async function GET() {
  const [catalogo, posts] = await Promise.all([
    getCatalogo().catch(() => []),
    getPosts(),
  ]);

  return new Response(llmsTxt({ catalogo, posts }), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
