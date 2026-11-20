# HEBS Lagos 2027: production booking portal link contract (proposed)

Status: **contract confirmed by Claude Desktop (18 Nov 2026); not active.** Desktop confirmed this against the 2027 production candidate app. Paths, codes and live-data isolation are agreed. The public domain and payment are not ready yet (section 5).

This change prepares the website side only. Every production booking link stays closed until the three conditions in section 4 are met:

- `PRODUCTION_PORTAL` is `awaiting-confirmation` and has no origin.
- `PRODUCTION_PORTAL_HOSTS` is empty.

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
  - They are pinned as `CONTRACT_COMPETITION_CODES`.
  - The website never generates any other code, on production or staging. A link whose code is not in that list is not created, and the button stays "Opens soon".
- The only parameters are `category` (competitions only) and `site` (below). Tests enforce this.
- Production serves live records. No dataset parameter is sent: `base44_data_env` never appears on a production link.
- The portal also serves `/privacy` and `/terms`. The website does not link to them yet; they will be linked once the domain is approved and the terms are published.

## 2. Return to the website (`site`)

- Added in the visitor's browser from `window.location.origin`: on production, `https://www.hebslagos.com`.
- Origin only. It never carries a path, a query (so never a Vercel share token) or credentials.
- If `site` is missing or invalid, the portal shows no Back to website link.

What the website sends depends on where it runs (`portalReturnRule`, applied by `PortalReturn`):

| Website deployment | `site` sent only when the origin is |
|---|---|
| Production (public launch) | `https://hebslagos.com` or `https://www.hebslagos.com` (`PUBLIC_RETURN_ORIGIN`) |
| The launch PR's protected Preview (acceptance only) | as above, or the deployment's own `https://hebs-lagos-2026-<hash>-veridion-systems-projects.vercel.app` (`PORTAL_RETURN_ORIGIN`); never a branch alias |
| The private test branch (staging copy) | unchanged from the staging contract |

For any other origin, the link opens without `site`. A visitor to a `*.vercel.app` host of the production deployment therefore never sends it.

**For Desktop at launch:** the portal's validator should also drop the Vercel preview-host rule once acceptance is complete, leaving only `(www.)hebslagos.com`.

## 3. Never on a production link

These are refused in code and tests (`productionOriginRefusal`, `tests/booking-production-2027.test.ts`):

- `base44_data_env` or any other test-data parameter;
- the sandbox checkout (`/2027/pay`);
- a Base44 `preview--` host;
- the private test copy's app;
- the 2026 live portal app;
- a competition code outside the 13 contract codes;
- a Vercel share token;
- credentials, a path, a query or a fragment in the origin.

The production portal's Base44 app id is **not** written into this repository (it is public). Desktop holds it, and a test checks that no app id appears in the booking code.

## 4. Conditions for activation

1. **Claude Desktop confirms the contract.** It answers each item in section 5.
2. **The full customer journey passes acceptance** on the launch PR's protected Preview, for one ticket, one competition (by code) and Find my booking: website → portal → sign-in → payment by the agreed method → QR pass → Back to website, landing on that Preview. The private test branch keeps the staging copy.
3. **Commercial settings are approved:**
   - ticket categories, prices and payment gateway (`TICKET_SALES`; the Buy tickets link opens only when both are true);
   - 2027 competition rules and fees;
   - Terms & Conditions;
   - the owner's written approval of the production origin.

## 5. Contract status (Claude Desktop, 18 Nov 2026)

| # | Item | Status |
|---|---|---|
| 1 | Production portal origin | **Open.** The proposed domain is `tickets.hebslagos.com`. It is not yet connected or approved, so it is not written into the code, and production links fail closed. |
| 2 | Paths | **Confirmed:** `/2027/tickets`, `/2027/compete`, `/2027/booking`. The portal also serves `/privacy` and `/terms`. |
| 3 | Competition parameter and codes | **Confirmed:** `category`, the 13 v1.0 codes, unchanged |
| 4 | Dataset | **Confirmed:** production uses live records, without `base44_data_env` |
| 5 | Return to website | **Confirmed:** `site=<website origin>`. Production sends only `(www.)hebslagos.com`. Preview hosts are for protected acceptance only (section 2). |
| 6 | Payment | **Open.** NGN bank transfer is the intended first method but is not yet operational for customers. USD card payment (Stripe) is disabled pending merchant setup and acceptance. The website must not advertise card payment as available. `TICKET_SALES.payment` stays `false`. |
| 7 | Acceptance method for a real payment | **Open.** To be agreed once a payment method is operational. |

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
