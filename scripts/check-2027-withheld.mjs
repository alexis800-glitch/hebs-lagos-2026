#!/usr/bin/env node
// Request-level proof that a production build leaks nothing from the unpublished
// HEBS 2027 pages or the review media.
//
// For every /2027 route (found in app/(edition)/2027), an unknown /2027 path and review files,
// it requests the page as a browser load, an RSC request, a router prefetch and an
// RSC request with the _rsc query, and checks that each answer is a 404 identical to
// the one for an ordinary missing page (once the echoed URL is removed), with none of
// the 2027 markers in it. It also checks that live 2026 pages never mention 2027,
// not even in the name of a shared script chunk.
//
// usage:
//   VERCEL_ENV=production npx next build && VERCEL_ENV=production npx next start -p 3000
//   npm run test:withheld -- http://localhost:3000
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const ROOT = join(import.meta.dirname, "..");
const CONTROL = "/hebs-control-missing-page";
const MARKERS = [/2027 . Staging/i, /staging preview/i, /provisional/i, /approval status/i, /beyond beauty/i, /july 23/i, /_withheld/, /_review/];
const MODES = {
  page: { headers: {} },
  rsc: { headers: { RSC: "1" } },
  prefetch: { headers: { RSC: "1", "Next-Router-Prefetch": "1" } },
  rscQuery: { headers: { RSC: "1" }, query: "?_rsc=check" },
};

function routes(dir = join(ROOT, "app/(edition)/2027")) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...routes(p));
    else if (/^(page|route)\.tsx?$/.test(name)) {
      out.push("/" + relative(join(ROOT, "app"), dir).split("/").filter((s) => !/^\(.+\)$/.test(s)).map((s) => (s.startsWith("[") ? "sample" : s)).join("/"));
    }
  }
  return out;
}

/** The answer without the requested URL, which Next.js echoes on every missing page. */
function normalise(body, path) {
  const segs = path.split("/").filter(Boolean);
  return body
    .replace(/\\?"urlParts\\?":\[[^\]]*\]/g, "")
    .replaceAll(path, "")
    .replace(new RegExp(segs.map((s) => `\\\\?"${s}\\\\?"`).join(","), "g"), "");
}

async function get(path, mode) {
  const res = await fetch(BASE + path + (mode.query ?? ""), { headers: mode.headers, redirect: "manual" });
  return { status: res.status, body: await res.text() };
}

/** Live 2026 pages, which must not reveal that a 2027 site exists. */
const LIVE = ["/", "/about", "/competitions", "/tickets", "/privacy", CONTROL];

const paths = [...routes(), "/2027/not-a-page", "/_review/home-2027/mark-2027-a.png", "/_review/home-2027/hair-wide.mp4", "/2027/media/hair-wide.mp4", "/2027/media/hero-card-guest.webp"];
const failures = [];
let checked = 0;
for (const [name, mode] of Object.entries(MODES)) {
  const control = await get(CONTROL, mode);
  if (control.status !== 404) failures.push(`${name} ${CONTROL}: control answered ${control.status}`);
  const expected = normalise(control.body, CONTROL);
  for (const path of paths) {
    const r = await get(path, mode);
    checked++;
    if (r.status !== 404) failures.push(`${name} ${path}: status ${r.status}`);
    const body = normalise(r.body, path);
    if (body !== expected) failures.push(`${name} ${path}: differs from an ordinary missing page`);
    for (const m of MARKERS) if (m.test(body) && !m.test(expected)) failures.push(`${name} ${path}: contains ${m}`);
  }
}

for (const path of LIVE) {
  const r = await get(path, MODES.page);
  checked++;
  if (/2027/.test(r.body)) failures.push(`live ${path}: mentions 2027`);
}

console.log(`${checked} requests: ${paths.length} paths × ${Object.keys(MODES).length} request types, and ${LIVE.length} live 2026 pages, against ${BASE}`);
if (failures.length) {
  console.error(`FAILED (${failures.length}):\n  ` + failures.join("\n  "));
  process.exit(1);
}
console.log("OK: every unpublished 2027 path and review file answers exactly like an ordinary missing page.");
