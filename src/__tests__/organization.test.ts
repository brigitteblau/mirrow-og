import { describe, expect, it } from "vitest";
import { organizationJsonLd, ORGANIZATION_ID } from "@/lib/organization";

describe("organizationJsonLd", () => {
  it("es una Organization completa para agentes y buscadores", () => {
    expect(organizationJsonLd["@type"]).toBe("Organization");
    expect(organizationJsonLd["@id"]).toBe(ORGANIZATION_ID);
    expect(organizationJsonLd.description.length).toBeGreaterThan(20);
    expect(organizationJsonLd.logo).toMatch(/^https:\/\/.+\.svg$/);
    expect(organizationJsonLd.address.addressCountry).toBe("AR");
    expect(organizationJsonLd.contactPoint.email).toBe("ventas@grupomirrow.com");
  });
});
