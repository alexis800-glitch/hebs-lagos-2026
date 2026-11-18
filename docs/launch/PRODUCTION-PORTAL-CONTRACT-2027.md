# HEBS Lagos 2027: production booking portal link contract (proposed)

Status: **proposed, not active.** This change prepares the website side only. Every production booking link stays closed (`PRODUCTION_PORTAL` is `awaiting-confirmation`, `PRODUCTION_PORTAL_HOSTS` is empty) until the three conditions in section 4 are met.

The portal is owned by Claude Desktop (Base44). The website never takes a booking, a payment or a lookup: each journey is a plain link.

## 1. Links

The same three journeys as the staging contract (booking contract v1.0, portal handoff of 17 Nov 2026), without the test dataset.

| Journey | Website button | Production link |
|---|---|---|
| Tickets | Buy tickets (Tickets page) | `<origin>/2027/tickets` |
| Competition registration | Register (Competitions page, one per competition) | `<origin>/2027/compete?category=<CODE>` |
| Find my booking | Find my booking (Tickets page) | `<origin>/2027/booking` |

- `<origin>` is the approved production portal origin: https, origin only, host listed in `PRODUCTION_PORTAL_HOSTS`.
- `<CODE>` is one of the 13 v1.0 codes, unchanged: BOF FDB FFR FFB FBA TBC FLF MKP LSH NAL FRW TOC LRS.
- The only parameters are `category` (competitions only) and `site` (below). Tests enforce this.

## 2. Return to the website (`site`)

- Added in the visitor's browser from `window.location.origin`: on production, `https://www.hebslagos.com`.
- Origin only. It never carries a path, a query (so never a Vercel share token) or credentials.
- The portal accepts `https://(www.)hebslagos.com` and a deployment's own `https://hebs-lagos-2026-<hash>-veridion-systems-projects.vercel.app`. It does not accept a branch alias. This pattern is pinned as `PORTAL_RETURN_ORIGIN` and tested.
- If `site` is missing or invalid, the portal shows no Back to website link.

## 3. Never on a production link

These are refused in code and tests (`productionOriginRefusal`, `tests/booking-production-2027.test.ts`):

- `base44_data_env` or any other test-data parameter;
- the sandbox checkout (`/2027/pay`);
- a Base44 `preview--` host;
- the private test copy's app;
- the 2026 live portal app;
- a Vercel share token;
- credentials, a path, a query or a fragment in the origin.

The production portal's Base44 app id is **not** written into this repository (it is public).

## 4. Conditions for activation

1. **Claude Desktop confirms the contract.** It answers each item in section 5.
2. **The full customer journey passes acceptance** on the launch PR's protected Preview, for one ticket, one competition (by code) and Find my booking: website → portal → sign-in → payment by the agreed method → QR pass → Back to website, landing on that Preview. The private test branch keeps the staging copy.
3. **Commercial settings are approved:**
   - ticket categories, prices and payment gateway (`TICKET_SALES`; the Buy tickets link opens only when both are true);
   - 2027 competition rules and fees;
   - Terms & Conditions;
   - the owner's written approval of the production origin.

## 5. To be confirmed by Claude Desktop

| # | Item | Website assumption |
|---|---|---|
| 1 | Production portal origin (https, origin only) | Unknown. Not guessed |
| 2 | Paths | `/2027/tickets`, `/2027/compete`, `/2027/booking` |
| 3 | Competition parameter and codes | `category`, the 13 v1.0 codes |
| 4 | Dataset | Production serves live data with no parameter |
| 5 | Return origins accepted | `(www.)hebslagos.com` and deployment hosts, for joint acceptance |
| 6 | Payment mode, gateway and purchase/refund terms page | Live mode; terms page to be linked from the website |
| 7 | Acceptance method for a real-mode payment | To be agreed |

## 6. Activation (a later, separately approved commit)

Only after section 4, one reviewed commit in `lib/integrations/booking-2027.ts`:

```ts
export const PRODUCTION_PORTAL: Gated<string> = {
  status: "approved",
  value: "<confirmed production origin>",
  source: "<owner approval and Desktop acceptance reference, date>",
};
export const PRODUCTION_PORTAL_HOSTS: readonly string[] = ["<confirmed host>"];
```

`TICKET_SALES` changes only with the approved prices and gateway. No environment variable can open these links.

Rollback: revert that commit. Every link returns to "Opens soon" and the rest of the site is unaffected.
