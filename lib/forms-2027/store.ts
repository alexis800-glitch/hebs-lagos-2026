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

export function restStore(cfg: { url: string; token: string }, fetchImpl: FetchLike = fetch): SharedStore {
  const pipeline = async (commands: (string | number)[][]) => {
    const res = await fetchImpl(`${cfg.url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`store HTTP ${res.status}`);
    const out = (await res.json()) as { result?: unknown; error?: string }[];
    if (!Array.isArray(out) || out.some((r) => r.error)) throw new Error("store command failed");
    return out.map((r) => r.result);
  };
  return {
    async hit(key, windowSeconds) {
      const [n] = await pipeline([["INCR", key], ["EXPIRE", key, windowSeconds, "NX"]]);
      if (typeof n !== "number") throw new Error("store returned no count");
      return n;
    },
    async claim(key, value, ttlSeconds) {
      const [, stored] = await pipeline([["SET", key, value, "NX", "EX", ttlSeconds], ["GET", key]]);
      if (typeof stored !== "string") throw new Error("store returned no value");
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
