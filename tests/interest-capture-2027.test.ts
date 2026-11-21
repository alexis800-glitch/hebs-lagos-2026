/**
 * Sponsorship and exhibitor interest capture (20 Nov 2026): the two calls to
 * action lead to the existing forms, the forms go only to the portal's
 * evSubmitPublicForm (an EvSponsor or EvExhibitor record), never to a booking or
 * a payment, and each carries the privacy acknowledgement and the optional
 * marketing consent. Synthetic data only; nothing is sent.
 */
import { afterEach, describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ExhibitorsPage, SponsorshipPage } from "@/components/2027/editorial/inner";
import { FORM_FIELDS, FORMS_OPEN } from "@/lib/integrations/registration-2027";
import { FIELD_MAP, toPortalBody } from "@/lib/forms-2027/contract";
import { MOCK_NOTICES, formEnabled, submitConfig } from "@/lib/forms-2027/config";
import { BOOKING_PATHS } from "@/lib/integrations/booking-2027";

const render = (Page: typeof SponsorshipPage) => renderToStaticMarkup(createElement(Page, { environment: "development" }));
const saved = process.env.HEBS_FORMS_MODE;
afterEach(() => { if (saved === undefined) delete process.env.HEBS_FORMS_MODE; else process.env.HEBS_FORMS_MODE = saved; });

describe("calls to action", () => {
  it("Sponsorship leads with Become a sponsor (to its inquiry form), then Become an exhibitor (to the application)", () => {
    delete process.env.HEBS_FORMS_MODE;
    const html = render(SponsorshipPage);
    const sponsor = html.indexOf('href="/2027/sponsorship#inquiry">Become a sponsor');
    const exhibit = html.indexOf('href="/2027/exhibitors#apply">Become an exhibitor');
    expect(sponsor).toBeGreaterThan(-1);
    expect(exhibit).toBeGreaterThan(sponsor);
    expect(html).toContain('id="inquiry"');
  });

  it("Exhibitors leads with Become an exhibitor (to its application), then Become a sponsor", () => {
    delete process.env.HEBS_FORMS_MODE;
    const html = render(ExhibitorsPage);
    const exhibit = html.indexOf('href="/2027/exhibitors#apply">Become an exhibitor');
    const sponsor = html.indexOf('href="/2027/sponsorship#inquiry">Become a sponsor');
    expect(exhibit).toBeGreaterThan(-1);
    expect(sponsor).toBeGreaterThan(exhibit);
    expect(html).toContain('id="apply"');
  });

  it("says plainly that nothing can be sent while the forms are closed, and stops saying it under test", () => {
    delete process.env.HEBS_FORMS_MODE;
    expect(FORMS_OPEN.sponsor).toBe(false);
    expect(FORMS_OPEN.exhibitor).toBe(false);
    expect(render(SponsorshipPage)).toContain("Sponsorship inquiries are not open yet. Nothing can be sent.");
    expect(render(ExhibitorsPage)).toContain("Exhibitor applications are not open yet. Nothing can be sent.");
    process.env.HEBS_FORMS_MODE = "mock"; // local development only: the forms under test are shown
    expect(formEnabled("sponsor", submitConfig())).toBe(true);
    expect(render(SponsorshipPage)).not.toContain("Sponsorship inquiries are not open yet.");
    expect(render(ExhibitorsPage)).not.toContain("Exhibitor applications are not open yet.");
  });
});

describe("capture without a paid booking", () => {
  const sponsor = { company_name: "Synthetic Brand", contact_name: "Synthetic Contact", email: "brand@synthetic.test", country: "Testland", partnership_interest: "Sponsorship", privacy_acknowledged: true };
  const exhibitor = { company_name: "Synthetic Tools", contact_name: "Synthetic Contact", email: "tools@synthetic.test", country: "Testland", products: "Synthetic combs", privacy_acknowledged: true };

  it("sends a sponsor or exhibitor submission, with no ticket, price, payment or booking field", () => {
    for (const [form, values] of [["sponsor", sponsor], ["exhibitor", exhibitor]] as const) {
      const body = toPortalBody(form, values, "6f1c2a9e-4b7d-4c3e-9a1f-2d8e5b7c0a14", MOCK_NOTICES);
      expect(body.form).toBe(form);
      const keys = [...Object.keys(body), ...Object.keys(body.data), ...Object.values(FIELD_MAP[form])].join(" ");
      expect(keys, form).not.toMatch(/ticket|price|amount|payment|pay\b|booking|order|checkout|stripe|currency/i);
      expect(JSON.stringify(body)).not.toMatch(new RegExp(Object.values(BOOKING_PATHS).join("|")));
    }
  });

  it("carries the required privacy acknowledgement and an optional, separate marketing consent on both forms", () => {
    for (const form of ["sponsor", "exhibitor"] as const) {
      const ack = FORM_FIELDS[form].filter((f) => f.consent === "acknowledgement");
      const marketing = FORM_FIELDS[form].filter((f) => f.consent === "marketing");
      expect(ack.map((f) => [f.name, f.required]), form).toEqual([["privacy_acknowledged", true]]);
      expect(marketing.map((f) => [f.name, f.required]), form).toEqual([["marketing_opt_in", false]]);
      const without = toPortalBody(form, form === "sponsor" ? sponsor : exhibitor, "6f1c2a9e-4b7d-4c3e-9a1f-2d8e5b7c0a14", MOCK_NOTICES);
      expect(without.data).toMatchObject({ privacy_acknowledged: true, privacy_notice_version: MOCK_NOTICES.privacy });
      expect(without.data).not.toHaveProperty("consent_marketing");
      const withConsent = toPortalBody(form, { ...(form === "sponsor" ? sponsor : exhibitor), marketing_opt_in: true }, "6f1c2a9e-4b7d-4c3e-9a1f-2d8e5b7c0a14", MOCK_NOTICES);
      expect(withConsent.data).toMatchObject({ consent_marketing: true, consent_version: MOCK_NOTICES.consent });
    }
  });
});
