/** The live site's static media, never read by server code. */
const TRACE_EXCLUDES_2027 = ["./public/videos/**/*", "./public/competition-pdfs/**/*", "./public/images/**/*", "./public/downloads/**/*", "./public/assets/**/*"];

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Every 2027 page checks public/_review/ on disk (the mark, the homepage media),
    // so output tracing would otherwise pack the whole public folder - the live
    // site's videos, PDFs and images, about 650 MB - into each 2027 function and
    // exceed Vercel's 250 MB limit. Those folders are served as static files and
    // no server code reads them. public/_review stays traced, so a protected
    // preview with HEBS_REVIEW_MEDIA=on can find its review files.
    outputFileTracingExcludes: {
      "/2027": TRACE_EXCLUDES_2027,
      "/2027/**": TRACE_EXCLUDES_2027,
    },
  },
  // Retired competition routes. The Crown / Crowned Icons pages were replaced by
  // the Signature Competitions on /competitions; the two placeholder pages were
  // never linked. Permanent so search engines drop the old URLs.
  async redirects() {
    return [
      { source: "/crown-icons", destination: "/competitions", permanent: true },
      { source: "/competition/crowned-icons", destination: "/competitions", permanent: true },
      { source: "/competition/barber-battles", destination: "/competitions?track=barber", permanent: true },
      { source: "/barber-stylist", destination: "/competitions?track=barber", permanent: true },
    ];
  },
};

export default nextConfig;
