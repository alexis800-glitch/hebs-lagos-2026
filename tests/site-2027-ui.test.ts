/**
 * The shared 2027 design-system parts (components/2027/site/ui.tsx): they take
 * the homepage's look without changing any words, and a button with nowhere to
 * go is never a link.
 */
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AccentTitle, Button, MetaLine, StagingStrip } from "@/components/2027/site/ui";

const html = (el: React.ReactElement) => renderToStaticMarkup(el);
const text = (s: string) => s.replace(/<[^>]+>/g, "");

describe("shared 2027 UI", () => {
  it("accents the last words of a headline without changing them", () => {
    const out = html(createElement(AccentTitle, { text: "Where beauty, education & opportunity meet.", accent: 2 }));
    expect(text(out).replace(/&amp;/g, "&")).toBe("Where beauty, education & opportunity meet.");
    expect(out).toContain('<span class="s27-accent">opportunity meet.</span>');
    expect(html(createElement(AccentTitle, { text: "Contact us", accent: 5 }))).toBe("Contact us");
  });

  it("renders a button without a destination as a non-link", () => {
    expect(html(createElement(Button, { href: null, children: "Opens soon" }))).toMatch(/^<span class="s27-btn s27-btn--pri" aria-disabled="true">/);
    expect(html(createElement(Button, { href: "/2027/tickets", variant: "ghost", children: "Tickets" }))).toBe('<a class="s27-btn s27-btn--gh" href="/2027/tickets">Tickets</a>');
  });

  it("states the dates and venue as the homepage does", () => {
    expect(text(html(createElement(MetaLine)))).toBe("July 23–25, 2027NJS Beach Resort, Lagos, Nigeria");
  });

  it("carries one staging notice with the approval-status link", () => {
    const out = html(createElement(StagingStrip));
    expect(out).toContain("Internal preview, not for publication.");
    expect(out).toContain("No registration or inquiry is collected.");
    expect(out).toContain('href="/2027/status"');
  });
});
