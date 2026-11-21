/**
 * Headlines quoted word for word in the owner directive (HEBS LAGOS 2027.pdf,
 * sections 4 and 11). They are approved as written, wherever they appear and
 * however they are set (the homepage splits some across two lines).
 *
 * Pure data, so the copy modules can share it without importing each other.
 */
export const DIRECTIVE_HEADLINES = {
  theme: "BIGGER. BOLDER. BEYOND BEAUTY.",
  welcome: "WHERE BEAUTY, EDUCATION & OPPORTUNITY MEET.",
  destination: "BEAUTY MEETS PARADISE.",
  competitions: "THE NEXT GENERATION OF BEAUTY CHAMPIONS.",
  education: "EDUCATION & MASTERCLASSES",
  partners: "POSITION YOUR BRAND AT THE CENTER OF BEAUTY INNOVATION.",
  finalCta: "YOUR NEXT BEAUTY EXPERIENCE STARTS HERE.",
  finalButton: "BE FIRST TO EXPERIENCE HEBS 2027",
  priorityList: "JOIN THE 2027 PRIORITY LIST",
} as const;

const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const QUOTED = new Set(Object.values(DIRECTIVE_HEADLINES).map(words));

/** Whether `text` is one of the directive's headlines, ignoring case and punctuation. */
export function isDirectiveHeadline(text: string): boolean {
  return QUOTED.has(words(text));
}
