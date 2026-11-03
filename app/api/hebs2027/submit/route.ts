/**
 * POST /api/hebs2027/submit: the only way a HEBS 2027 form reaches the
 * portal. All rules live in lib/forms-2027/handler.ts; this adapts Next.js.
 */
import { submitConfig } from "@/lib/forms-2027/config";
import { handleSubmit, MAX_BODY_BYTES } from "@/lib/forms-2027/handler";
import { mockPortalFetch } from "@/lib/forms-2027/mock-dev";
import { storeFor } from "@/lib/forms-2027/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const config = submitConfig();
  const declared = Number(req.headers.get("content-length") ?? "0");
  const body = declared > MAX_BODY_BYTES ? "x".repeat(MAX_BODY_BYTES + 1) : await req.text();
  const result = await handleSubmit(
    {
      method: req.method,
      contentType: req.headers.get("content-type"),
      origin: req.headers.get("origin"),
      host: req.headers.get("x-forwarded-host") ?? req.headers.get("host"),
      ip: (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip"),
      body,
    },
    { config, store: storeFor(config.store), portalFetch: config.mode === "mock" ? mockPortalFetch() : undefined },
  );
  if (result.outcome.status === "not_found") return new Response("Not found", { status: 404 });
  return Response.json(result.outcome, { status: result.httpStatus, headers: { "Cache-Control": "no-store" } });
}

export function GET() {
  return new Response(null, { status: 405, headers: { Allow: "POST" } });
}
