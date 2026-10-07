import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Simula unstable_cache con la misma semántica relevante: guarda solo los
// resultados exitosos (un error no queda cacheado).
vi.mock("next/cache", () => ({
  unstable_cache: <T>(fn: () => Promise<T>) => {
    let cached: Promise<T> | undefined;
    return () => {
      if (!cached) {
        cached = fn().catch((error) => {
          cached = undefined;
          throw error;
        });
      }
      return cached;
    };
  },
}));

const record = {
  id: "abc",
  slug: "post-1",
  titulo: "Post 1",
  publicado: "2026-01-01 10:00:00.000Z",
  contenido: "<p>Hola</p>",
};

describe("getPosts", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("POCKETBASE_URL", "https://pb.test");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("devuelve [] si PocketBase falla y no cachea el fallo", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("error", { status: 503 }))
      .mockResolvedValueOnce(Response.json({ items: [record] }));
    vi.stubGlobal("fetch", fetchMock);
    const { getPosts } = await import("@/lib/blog");

    expect(await getPosts()).toEqual([]);
    const posts = await getPosts();
    expect(posts.map((p) => p.slug)).toEqual(["post-1"]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
