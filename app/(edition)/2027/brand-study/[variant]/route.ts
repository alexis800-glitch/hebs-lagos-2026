import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { deployEnvironment } from "@/lib/publication";

/**
 * Serves the D3 logo colour studies to the staging comparison only. They are
 * internal-review assets, kept outside public/ so no static URL exists for
 * them; on a production deployment this route always answers 404.
 */
const FILES: Record<string, string> = {
  "champagne-ivory": join(process.cwd(), "brand-studies/hebs_logo_nav_champagne_ivory_comparison.png"),
  "champagne-black": join(process.cwd(), "brand-studies/hebs_logo_nav_champagne_black_comparison.png"),
};

export async function GET(_req: Request, { params }: { params: { variant: string } }) {
  const file = FILES[params.variant];
  if (!file || deployEnvironment() === "production") return new Response("Not found", { status: 404 });
  const body = await readFile(file);
  return new Response(body, {
    headers: { "Content-Type": "image/png", "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" },
  });
}
