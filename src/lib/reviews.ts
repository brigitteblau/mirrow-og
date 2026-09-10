import { unstable_cache } from "next/cache";

export type Review = {
  quote: string;
  name: string;
  /** Comercio (reseñas propias) o descripción temporal ("hace 2 meses") en las de Google. */
  business: string;
  /** 1-5. Si no está definido se muestran 5 estrellas. */
  rating?: number;
  /** Link a la reseña / perfil del autor en Google. */
  sourceUrl?: string;
};

export type ReviewsData = {
  reviews: Review[];
  /** Promedio general (solo cuando la fuente es Google). */
  rating: number | null;
  /** Cantidad total de reseñas en Google. */
  total: number | null;
  source: "google" | "curated";
  /** URL para dejar una reseña nueva en Google. */
  writeReviewUrl: string | null;
  /** URL del perfil / ficha en Google Maps. */
  profileUrl: string | null;
};

/** Reseñas propias. Se usan como respaldo si Google no está configurado o falla. */
export const FALLBACK_REVIEWS: Review[] = [
  {
    quote:
      "Trabajo con Mirrow hace más de 8 años. Son muy comprometidos con la atención y siempre llego a la temporada con stock a tiempo.",
    name: "Ricardo D.",
    business: "Indumentaria Ricardo, La Matanza",
  },
  {
    quote:
      "La calidad de la ropa es excelente y el trato con el vendedor es directo, sin vueltas. Pedís por WhatsApp y ya sabés cuándo te llega.",
    name: "Marina F.",
    business: "Boutique Marina, Rosario",
  },
  {
    quote:
      "Empecé pidiendo media caja para probar y hoy les compro contenedores completos. El respaldo de 56 años se nota en cada envío.",
    name: "Gustavo P.",
    business: "GP Indumentaria, Córdoba",
  },
  {
    quote:
      "Lo que más valoro es que cumplen los plazos. En temporada alta eso es todo, y con Mirrow nunca tuve una demora.",
    name: "Claudia N.",
    business: "Claudia Moda, Mendoza",
  },
  {
    quote:
      "Somos un comercio chico y siempre nos atendieron igual que a los grandes. Eso genera confianza a largo plazo.",
    name: "Pablo S.",
    business: "Pablo Sport, Mar del Plata",
  },
  {
    quote:
      "El catálogo mayorista por WhatsApp me ahorra horas. Armo el pedido, confirmo con el vendedor y listo.",
    name: "Verónica L.",
    business: "Verónica Textil, Tucumán",
  },
  {
    quote:
      "La ropa térmica de Mirrow es la que más rota en mi local en invierno. Buena calidad a un precio mayorista real.",
    name: "Diego M.",
    business: "Diego Indumentaria, Neuquén",
  },
  {
    quote:
      "Empezamos como distribuidores hace dos años y hoy son uno de nuestros proveedores más confiables.",
    name: "Sofía R.",
    business: "Sofía Distribuciones, Salta",
  },
];

/** Compatibilidad hacia atrás. */
export const REVIEWS = FALLBACK_REVIEWS;

/** Solo mostramos reseñas de Google con esta calificación o más. */
const MIN_RATING = 4;
/** Google devuelve como máximo 5 reseñas por la API. */
const MAX_REVIEWS = 6;

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;

function writeReviewUrl(): string | null {
  return PLACE_ID
    ? `https://search.google.com/local/writereview?placeid=${PLACE_ID}`
    : null;
}

type PlacesReview = {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: { displayName?: string; uri?: string };
};

type PlacesResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesReview[];
};

async function fetchGoogleReviews(): Promise<ReviewsData | null> {
  if (!API_KEY || !PLACE_ID) return null;

  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(PLACE_ID)}?languageCode=es`;

  let data: PlacesResponse;
  try {
    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
      },
    });
    if (!res.ok) {
      throw new Error(`Places API respondió ${res.status}`);
    }
    data = (await res.json()) as PlacesResponse;
  } catch (error) {
    console.error("No se pudieron leer las reseñas de Google:", error);
    return null;
  }

  const reviews: Review[] = (data.reviews ?? [])
    .map((r): Review | null => {
      const quote = (r.text?.text ?? r.originalText?.text ?? "").trim();
      if (!quote) return null;
      return {
        quote,
        name: r.authorAttribution?.displayName?.trim() || "Cliente de Google",
        business: r.relativePublishTimeDescription?.trim() || "Reseña de Google",
        rating: typeof r.rating === "number" ? r.rating : undefined,
        sourceUrl: r.authorAttribution?.uri,
      };
    })
    .filter((r): r is Review => r !== null)
    .filter((r) => (r.rating ?? 5) >= MIN_RATING)
    .slice(0, MAX_REVIEWS);

  if (reviews.length === 0) return null;

  return {
    reviews,
    rating: typeof data.rating === "number" ? data.rating : null,
    total: typeof data.userRatingCount === "number" ? data.userRatingCount : null,
    source: "google",
    writeReviewUrl: writeReviewUrl(),
    profileUrl: data.googleMapsUri ?? null,
  };
}

const getCachedGoogleReviews = unstable_cache(
  fetchGoogleReviews,
  // El Place ID forma parte de la clave: si cambia (o se agrega), el caché se invalida solo.
  ["google-reviews", PLACE_ID ?? "unset"],
  {
    revalidate: 86_400,
    tags: ["reviews"],
  }
);

export async function getReviews(): Promise<ReviewsData> {
  const google = await getCachedGoogleReviews();
  if (google) return google;

  return {
    reviews: FALLBACK_REVIEWS,
    rating: null,
    total: null,
    source: "curated",
    writeReviewUrl: writeReviewUrl(),
    profileUrl: PLACE_ID ? `https://search.google.com/local/reviews?placeid=${PLACE_ID}` : null,
  };
}
