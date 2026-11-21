/**
 * Request signing, as INTEGRATION-CONTRACT-v1.0 specifies: lowercase hex of
 * HMAC-SHA256(secret, "<unix seconds>.<raw body string>"), over the exact
 * string sent. Server only.
 */
import { createHmac } from "node:crypto";

export function signBody(secret: string, timestamp: number, raw: string): string {
  return createHmac("sha256", secret).update(`${timestamp}.${raw}`).digest("hex");
}

/** Serialise once, sign that string, send that string. */
export function signedRequest(secret: string, appId: string, body: unknown, nowSeconds: number) {
  const raw = JSON.stringify(body);
  return {
    raw,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-App-Id": appId,
      "X-HEBS-Timestamp": String(nowSeconds),
      "X-HEBS-Signature": signBody(secret, nowSeconds, raw),
    },
  };
}
