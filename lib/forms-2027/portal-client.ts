/**
 * Server-to-server call to the portal: sign, send, 10 s timeout, and at most
 * ONE retry, always with the same body (so the same client_request_id) and a
 * fresh timestamp and signature (corrected v1.1 section 7):
 *   - 500 / 503 (including audit_failed) or no answer: retry after 2 s;
 *   - 503 busy: retry after retry_after_s (clamped to 1-60) when that fits in
 *     this request (MAX_INLINE_BUSY_WAIT_S); otherwise no retry here, and the
 *     visitor is told when to resend (their resend reuses the same id);
 *   - anything else, including 413: no retry.
 * Returns the HTTP status, parsed body and Retry-After header of the last
 * answer, or status 0 when the portal could not be reached.
 */
import { MAX_INLINE_BUSY_WAIT_S, RETRYABLE, RETRY_DELAY_MS, busyDelaySeconds, isBusy } from "./contract";
import { signedRequest } from "./sign";

export type FetchLike = (url: string, init: RequestInit) => Promise<Response>;

export interface PortalCall {
  url: string;
  appId: string;
  secret: string;
  body: unknown;
  fetch?: FetchLike;
  nowSeconds?: () => number;
  sleep?: (ms: number) => Promise<void>;
  timeoutMs?: number;
}

export interface PortalAnswer {
  status: number;
  json: unknown;
  retryAfter: string | null;
  attempts: number;
}

async function once(c: Required<Omit<PortalCall, "body">> & { body: unknown }): Promise<Omit<PortalAnswer, "attempts">> {
  const { raw, headers } = signedRequest(c.secret, c.appId, c.body, c.nowSeconds());
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), c.timeoutMs);
  try {
    const res = await c.fetch(c.url, { method: "POST", headers, body: raw, signal: ctrl.signal, cache: "no-store", redirect: "error" });
    let json: unknown = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }
    return { status: res.status, json, retryAfter: res.headers.get("retry-after") };
  } catch {
    return { status: 0, json: null, retryAfter: null };
  } finally {
    clearTimeout(t);
  }
}

export async function callPortal(c: PortalCall): Promise<PortalAnswer> {
  const full = {
    url: c.url, appId: c.appId, secret: c.secret, body: c.body,
    fetch: c.fetch ?? fetch,
    nowSeconds: c.nowSeconds ?? (() => Math.floor(Date.now() / 1000)),
    sleep: c.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms))),
    timeoutMs: c.timeoutMs ?? 10_000,
  };
  const first = await once(full);
  let delayMs: number;
  if (isBusy(first.status, first.json)) {
    const s = busyDelaySeconds(first.json, first.retryAfter);
    if (s > MAX_INLINE_BUSY_WAIT_S) return { ...first, attempts: 1 };
    delayMs = s * 1000;
  } else if (first.status === 0 || RETRYABLE.has(first.status)) {
    delayMs = RETRY_DELAY_MS;
  } else {
    return { ...first, attempts: 1 };
  }
  await full.sleep(delayMs);
  const second = await once(full);
  return { ...second, attempts: 2 };
}
