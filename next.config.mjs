import { privateTestBuildErrors } from "./lib/forms-2027/private-test.mjs";

// The private end-to-end test switch never reaches production: such a build fails here.
const privateTestErrors = privateTestBuildErrors(process.env);
if (privateTestErrors.length) {
  throw new Error(`HEBS 2027 private-test guard: ${privateTestErrors.join("; ")}`);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
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
