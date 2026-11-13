/**
 * The shared server-side store behind rate limiting and submission
 * idempotency. On Vercel it is a Redis-compatible REST store (Upstash / Vercel
 * KV), shared by every instance; memory exists for local development and tests.
 * Any store failure is reported, never ignored, so the route fails closed.
 */
import type { StoreConfig } from "./config";

export interface SharedStore {
  /** Increments `key` in a window of `windowSeconds` and returns the new count. */
  hit(key: string, windowSeconds: number): Promise<number>;
  /** Stores `value` under `key` unless present; returns whichever value is stored. */
  claim(key: string, value: string, ttlSeconds: number): Promise<string>;
}

export function memoryStore(now: () => number = Date.now): SharedStore {
  const counts = new Map<string, { n: number; until: number }>();
  const values = new Map<string, { v: string; until: number }>();
  return {
    async hit(key, windowSeconds) {
      const t = now();
      const e = counts.get(key);
      if (!e || e.until <= t) {
        counts.set(key, { n: 1, until: t + windowSeconds * 1000 });
        return 1;
      }
      e.n += 1;
      return e.n;
    },
    async claim(key, value, ttlSeconds) {
      const t = now();
      const e = values.get(key);
      if (e && e.until > t) return e.v;
      values.set(key, { v: value, until: t + ttlSeconds * 1000 });
      return value;
    },
  };
}

type FetchLike = (url: string, init: RequestInit) => Promise<Response>;

/**
 * A store failure with a short, safe reason for the server log: the HTTP status
 * (http_401), the Redis error's leading code word (command_ERR, command_NOPERM),
 * network, timeout or bad_response. Never a URL, token, key or error text.
 */
export class StoreError extends Error {
  constructor(readonly reason: string) {
    super(`store ${reason}`);
  }
}

/** The safe reason for any error thrown by a store, for the log. */
export function storeReason(e: unknown): string {
  return e instanceof StoreError ? e.reason : "unknown";
}

const errorCode = (error: unknown) => {
  const word = typeof error === "string" ? /^[A-Z]{2,20}\b/.exec(error)?.[0] : undefined;
  return `command_${word ?? "unknown"}`;
};

/**
 * Upstash / Vercel KV over REST. Each operation is one MULTI/EXEC transaction
 * (/multi-exec, atomic) of basic commands only: SET with NX and EX, INCR and
 * GET. No Redis 7 command options, which a REST store need not support.
 */
export function restStore(cfg: { url: string; token: string }, fetchImpl: FetchLike = fetch, timeoutMs = 5_000): SharedStore {
  const transaction = async (commands: (string | number)[][]) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    let res: Response;
    try {
      res = await fetchImpl(`${cfg.url.replace(/\/$/, "")}/multi-exec`, {
        method: "POST",
        headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
        body: JSON.stringify(commands),
        cache: "no-store",
        signal: ctrl.signal,
      });
    } catch {
      throw new StoreError(ctrl.signal.aborted ? "timeout" : "network");
    } finally {
      clearTimeout(timer);
    }
    const out = (await res.json().catch(() => null)) as { result?: unknown; error?: unknown }[] | { error?: unknown } | null;
    // Upstash REST: 401 for a missing or invalid token; a transaction discarded as a whole answers one
    // error object; otherwise one {result} or {error} per command, in order, with 200, or 400 when a
    // command failed.
    if (res.status === 401) throw new StoreError("http_401");
    if (out && !Array.isArray(out) && out.error !== undefined) throw new StoreError(errorCode(out.error));
    if (Array.isArray(out)) {
      const failed = out.find((r) => r?.error !== undefined);
      if (failed) throw new StoreError(errorCode(failed.error));
    }
    if (!res.ok) throw new StoreError(`http_${res.status}`);
    if (!Array.isArray(out) || out.length !== commands.length) throw new StoreError("bad_response");
    return out.map((r) => r.result);
  };
  return {
    async hit(key, windowSeconds) {
      // SET NX EX starts a window with its expiry; INCR counts in it and keeps that expiry.
      const [, n] = await transaction([["SET", key, "0", "EX", windowSeconds, "NX"], ["INCR", key]]);
      if (typeof n !== "number") throw new StoreError("bad_response");
      return n;
    },
    async claim(key, value, ttlSeconds) {
      const [, stored] = await transaction([["SET", key, value, "NX", "EX", ttlSeconds], ["GET", key]]);
      if (typeof stored !== "string") throw new StoreError("bad_response");
      return stored;
    },
  };
}

const g = globalThis as typeof globalThis & { __hebs2027MemoryStore?: SharedStore };

export function storeFor(cfg: StoreConfig | null): SharedStore | null {
  if (!cfg) return null;
  if (cfg.kind === "rest" && cfg.url && cfg.token) return restStore({ url: cfg.url, token: cfg.token });
  g.__hebs2027MemoryStore ??= memoryStore();
  return g.__hebs2027MemoryStore;
}
