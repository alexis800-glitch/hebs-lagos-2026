/* eslint-disable @next/next/no-img-element -- the mark is a small static logo served at two fixed cuts */
/**
 * The approved 2027 mark (mark-2027-a, decision D3). Its 240/480 px cuts are
 * committed under public/2027/brand/ (byte-identical to the approved files in
 * published-media-2027.json, tests/mark-2027.test.ts), so it renders in every
 * build, with or without the gitignored media folder. No other logo is ever
 * substituted on a 2027 page. The alt text is the signed-off site wording
 * (layout.site.508e91d0b6); the home link around it names HEBS Lagos 2027.
 */
export const MARK_2027_DIR = "/2027/brand/";
const cut = (w: 240 | 480) => `${MARK_2027_DIR}mark-2027-a-${w}.webp`;

/** The HEBS Lagos 2027 mark, the same on every 2027 page. */
export function Mark({ className = "logo", sizes = "(max-width: 600px) 84px, (max-width: 1279px) 96px, 108px", lazy = false }: { className?: string; sizes?: string; lazy?: boolean }) {
  return (
    <img
      className={className}
      src={cut(480)}
      srcSet={`${cut(240)} 240w, ${cut(480)} 480w`}
      sizes={sizes}
      width={480}
      height={450}
      alt="HEBS, Hair Education Beauty Summit"
      loading={lazy ? "lazy" : "eager"}
      decoding="async"
    />
  );
}
