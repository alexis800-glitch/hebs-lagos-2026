/**
 * POST /api/hebs2027/submit: the only way a HEBS 2027 form reaches the
 * portal. All rules live in lib/forms-2027/handler.ts; this adapts Next.js.
 * While the feature is unpublished every method answers 404 (handler step 1).
 */
import { submitConfig } from "@/lib/forms-2027/config";
import { handleSubmit, MAX_BODY_BYTES, MAX_UPLOAD_REQUEST_BYTES } from "@/lib/forms-2027/handler";
import { mockPortalFetch } from "@/lib/forms-2027/mock-dev";
import type { UploadedFile } from "@/lib/forms-2027/pdf";
import { storeFor } from "@/lib/forms-2027/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Two 10 s portal calls plus at most a 5 s busy wait (lib/forms-2027/portal-client.ts). */
export const maxDuration = 30;

const notFound = () => new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
const tooLarge = "x".repeat(MAX_BODY_BYTES + 1);

export async function POST(req: Request) {
  const config = submitConfig();
  if (config.mode === "off") return notFound();
  const contentType = req.headers.get("content-type");
  const declared = Number(req.headers.get("content-length") ?? "0");
  const multipart = !!contentType && /^multipart\/form-data\b/i.test(contentType);

  let body = "";
  let file: UploadedFile | null = null;
  if (multipart && config.uploads) {
    if (declared > MAX_UPLOAD_REQUEST_BYTES) {
      body = tooLarge;
    } else {
      const fd = await req.formData();
      const payload = fd.get("payload");
      body = typeof payload === "string" ? payload : "";
      const part = fd.get("company_profile");
      if (part && typeof part !== "string" && part.size > 0) {
        file = { name: part.name, type: part.type, bytes: new Uint8Array(await part.arrayBuffer()) };
      }
    }
  } else if (!multipart) {
    body = declared > MAX_BODY_BYTES ? tooLarge : await req.text();
  }

  const result = await handleSubmit(
    {
      method: req.method,
      contentType,
      origin: req.headers.get("origin"),
      host: req.headers.get("x-forwarded-host") ?? req.headers.get("host"),
      ip: (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip"),
      body,
      file,
    },
    { config, store: storeFor(config.store), portalFetch: config.mode === "mock" ? mockPortalFetch() : undefined },
  );
  if (result.outcome.status === "not_found") return notFound();
  const headers: Record<string, string> = { "Cache-Control": "no-store" };
  if (result.outcome.status === "busy") headers["Retry-After"] = String(result.outcome.retryAfterSeconds);
  return Response.json(result.outcome, { status: result.httpStatus, headers });
}

// Unsupported access: 404, as if the route did not exist.
export const GET = notFound;
export const HEAD = notFound;
export const PUT = notFound;
export const PATCH = notFound;
export const DELETE = notFound;
export const OPTIONS = notFound;
