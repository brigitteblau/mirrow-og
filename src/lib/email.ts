export const CONTACT_EMAIL = "ventas@grupomirrow.com";

export function mailtoUrl(subject: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
