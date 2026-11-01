import Image from "next/image";
import { findAsset } from "@/lib/assets/register";

/**
 * D3 comparison, internal: the official HEBS mark beside a colour-only study of
 * the same mark in champagne and ivory (dark grounds) or champagne and black
 * (light grounds). Shape, proportions and lettering are untouched.
 */
const GROUNDS = [
  { name: "Black", bg: "#000000", fg: "#F5EFE4", study: "hebs-logo-champagne-ivory" },
  { name: "Atlantic", bg: "#0E3A3F", fg: "#F5EFE4", study: "hebs-logo-champagne-ivory" },
  { name: "Ivory", bg: "#F5EFE4", fg: "#000000", study: "hebs-logo-champagne-black" },
] as const;

export default function LogoComparison() {
  const official = findAsset("hebs-logo-nav");
  return (
    <main className="min-h-screen bg-[#F5EFE4] px-5 py-14 text-black sm:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold">Official HEBS mark: colour comparison (D3)</h1>
        <p className="mt-3 max-w-[70ch] text-[15px] leading-relaxed text-[#3B362F]">
          Internal comparison only. The working design keeps the official mark. The study changes colour alone:
          the violet-to-pink letterforms become ivory (black on light grounds) and the gold strands and tagline
          become champagne. Nothing is redrawn, and neither study replaces the official logo without
          Mrs. Shuler&apos;s approval.
        </p>
        <div className="mt-10 grid gap-6">
          {GROUNDS.map((g) => {
            const study = findAsset(g.study);
            return (
              <section key={g.name} aria-label={`${g.name} ground`} className="grid gap-px sm:grid-cols-2" style={{ background: g.bg, color: g.fg }}>
                {[
                  { label: "Official mark, as supplied", src: official.src, alt: "Official HEBS mark", study: false },
                  { label: "Colour study (internal, not approved)", src: study.src, alt: "HEBS mark recoloured in champagne, colour study", study: true },
                ].map((v) => (
                  <figure key={v.label} className="flex flex-col items-center gap-5 p-10">
                    <Image src={v.src} alt={v.alt} width={192} height={160} unoptimized={v.study} className="h-40 w-auto" />
                    <figcaption className="text-[13px]">{g.name} ground: {v.label}</figcaption>
                  </figure>
                ))}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
