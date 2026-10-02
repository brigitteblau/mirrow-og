"use server";

const POCKETBASE_URL = process.env.POCKETBASE_URL;

export type NewsletterState = {
  status: "idle" | "ok" | "error";
  mensaje?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Guarda un suscriptor en la colección "newsletter" de PocketBase.
 * La colección necesita los campos `email` (email, único), `comercio` (text)
 * y `origen` (text), con createRule pública y list/view sólo para admins.
 */
export async function suscribirNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  // Honeypot: los bots completan todos los campos, las personas no ven este.
  if (formData.get("website")) return { status: "ok" };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const comercio = String(formData.get("comercio") ?? "").trim().slice(0, 120);
  const origen = String(formData.get("origen") ?? "").trim().slice(0, 40);

  if (!EMAIL_RE.test(email) || email.length > 200) {
    return { status: "error", mensaje: "Revisá el mail, parece que no es válido." };
  }

  if (!POCKETBASE_URL) {
    console.error("Newsletter: falta POCKETBASE_URL");
    return { status: "error", mensaje: "No pudimos anotarte. Probá de nuevo más tarde." };
  }

  try {
    const res = await fetch(`${POCKETBASE_URL}/api/collections/newsletter/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, comercio, origen }),
      cache: "no-store",
    });

    if (res.ok) return { status: "ok" };

    // Si el mail ya estaba anotado, PocketBase rechaza por índice único:
    // para la persona es lo mismo, ya está suscripta.
    const data = (await res.json().catch(() => null)) as
      | { data?: { email?: { code?: string } } }
      | null;
    if (data?.data?.email?.code === "validation_not_unique") return { status: "ok" };

    throw new Error(`PocketBase respondió ${res.status}`);
  } catch (error) {
    console.error("No se pudo guardar la suscripción al newsletter:", error);
    return { status: "error", mensaje: "No pudimos anotarte. Probá de nuevo más tarde." };
  }
}
