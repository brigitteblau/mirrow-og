import { CONTACT_EMAIL } from "./email";

export const SITE_URL = "https://www.grupomirrow.com.ar";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export const ORGANIZATION_DESCRIPTION =
  "Importador, productor y distribuidor mayorista de indumentaria masculina en Argentina, con más de 56 años de trayectoria familiar.";

/**
 * Datos de Mirrow como `Organization` de schema.org. Todas las páginas que
 * mencionan a Mirrow en JSON-LD usan el mismo `@id`, así los buscadores y
 * agentes lo reconocen como una única entidad completa.
 */
export const organizationJsonLd = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "Mirrow",
  alternateName: "Grupo Mirrow",
  url: SITE_URL,
  description: ORGANIZATION_DESCRIPTION,
  logo: `${SITE_URL}/images/mirrow-icon.svg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ciudad Autónoma de Buenos Aires",
    addressRegion: "CABA",
    addressCountry: "AR",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: "+5491137743741",
    email: CONTACT_EMAIL,
    availableLanguage: "Spanish",
    areaServed: "AR",
  },
} as const;
