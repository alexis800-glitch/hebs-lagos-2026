/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // The preferred-homepage review route checks public/_review/ on disk in local
    // development only. Without this, output tracing would pack the whole public
    // folder (site videos included) into its serverless function.
    outputFileTracingExcludes: {
      "/2027/concepts/home": ["./public/**/*"],
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
