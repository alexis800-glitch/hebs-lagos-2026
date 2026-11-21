import { sitemapXml } from "@/lib/site/seo-2027";
import { clientPreview, deployEnvironment } from "@/lib/publication";

/** The 2027 sitemap (lib/site/seo-2027.ts): published pages only, and noindex off production. */
export function GET() {
  const environment = deployEnvironment();
  const xml = sitemapXml(environment);
  if (!xml) return new Response("Not Found", { status: 404 });
  const headers: Record<string, string> = { "Content-Type": "application/xml; charset=utf-8" };
  if (environment !== "production" || clientPreview()) headers["X-Robots-Tag"] = "noindex";
  return new Response(xml, { headers });
}
