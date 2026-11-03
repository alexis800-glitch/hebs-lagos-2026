/**
 * Server-to-server call to the portal: sign, send, 10 s timeout, one retry
 * with the same client_request_id. Returns the HTTP status and parsed body, or
 * status 0 when the portal could not be reached.
 */
import { RETRYABLE } from "./contract";
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

async function once(c: Required<Omit<PortalCall, "body">> & { body: unknown }): Promise<{ status: number; json: unknown }> {
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
    return { status: res.status, json };
  } catch {
    return { status: 0, json: null };
  } finally {
    clearTimeout(t);
  }
}

export async function callPortal(c: PortalCall): Promise<{ status: number; json: unknown; attempts: number }> {
  const full = {
    url: c.url, appId: c.appId, secret: c.secret, body: c.body,
    fetch: c.fetch ?? fetch,
    nowSeconds: c.nowSeconds ?? (() => Math.floor(Date.now() / 1000)),
    sleep: c.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms))),
    timeoutMs: c.timeoutMs ?? 10_000,
  };
  const first = await once(full);
  if (first.status !== 0 && !RETRYABLE.has(first.status)) return { ...first, attempts: 1 };
  await full.sleep(2000);
  // Same body, so the same client_request_id; a fresh timestamp and signature.
  const second = await once(full);
  return { ...second, attempts: 2 };
}
