import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONSENT_COOKIE_NAME } from "@/lib/consent";

export const metadata: Metadata = {
  title: "Privacy & Cookie Notice | HEBS Lagos 2026",
  description:
    "How the HEBS Lagos 2026 website uses the Meta Pixel, why your consent is optional, and how to change or withdraw it at any time.",
  alternates: { canonical: "/privacy" },
};

/**
 * Deliberately narrow: this notice covers the one optional tracking technology
 * the website runs and the single cookie that records the visitor's decision
 * about it. It does not describe registration, ticketing or the event portal,
 * which are separate systems.
 *
 * The controller is identified at brand level - "Hair Education Beauty Summit
 * (HEBS), organiser of HEBS Lagos 2026" - on the organiser's instruction of
 * 2026-09-01. TODO: replace this with the exact registered corporate name once
 * the organiser confirms it. Do not append LLC, Inc., Limited, a US state, a
 * registration number or an address until that entity is confirmed.
 *
 * Still deliberately absent, because none of it has been supplied: a named data
 * protection officer, a dedicated privacy email or postal address, and any
 * retention period. Privacy enquiries route to the existing Contact page for
 * now. Inventing any of these would be worse than omitting them.
 */
export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050505] pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <h1 className="section-title text-white">Privacy &amp; Cookie Notice</h1>
          <p className="mt-4 text-sm" style={{ color: "#9b9b9b" }}>
            This notice explains the optional tracking used on the HEBS Lagos 2026
            website and the choice you have about it.
          </p>

          <Section title="Who is responsible">
            <p>
              This website is operated by{" "}
              <strong className="text-white">
                Hair Education Beauty Summit (HEBS), organiser of HEBS Lagos 2026
              </strong>
              . HEBS decides why and how the tracking described below is used, and is the
              data controller for that processing.
            </p>
            <p>
              For privacy enquiries, please use our{" "}
              <Link
                href="/contact"
                className="text-white underline underline-offset-4 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
              >
                Contact page
              </Link>
              .
            </p>
          </Section>

          <Section title="Tracking we use">
            <p>
              This website uses one optional tracking technology: the{" "}
              <strong className="text-white">Meta Pixel</strong>, provided by Meta
              Platforms. When it is switched on, it loads a script from Meta and sends
              Meta a record that you viewed a page on this site.
            </p>
            <p>
              We use it to understand how our advertising performs and how visitors
              interact with the website, so we can improve both.
            </p>
          </Section>

          <Section title="Your consent is optional">
            <p>
              The Meta Pixel is <strong className="text-white">off by default</strong>.
              It is not loaded, and no data is sent to Meta, unless you choose{" "}
              <strong className="text-white">Accept</strong>.
            </p>
            <p>
              Choosing <strong className="text-white">Reject</strong> does not limit the
              website in any way. Every page, and all event, competition and
              registration information, works exactly the same either way. Ignoring or
              dismissing the banner is not consent — the pixel stays off until you
              actively accept it.
            </p>
            <p>
              This reflects the consent principles in{" "}
              <strong className="text-white">
                section 26 of the Nigeria Data Protection Act 2023
              </strong>
              : a consent request must be in clear and simple language, consent must be
              given by an affirmative act rather than by a pre-selected option or by
              silence, and you must be told that you can withdraw it.
            </p>
          </Section>

          <Section title="The cookie that records your choice">
            <p>
              So that we do not ask you on every page, your decision is stored in a
              first-party cookie:
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <tbody>
                  <Row label="Name">
                    <code className="text-white">{CONSENT_COOKIE_NAME}</code>
                  </Row>
                  <Row label="Purpose">Remembers whether you accepted or rejected Meta Pixel tracking</Row>
                  <Row label="Values">
                    <code className="text-white">accepted</code> or{" "}
                    <code className="text-white">rejected</code> — nothing else
                  </Row>
                  <Row label="Lifetime">12 months, after which you are asked again</Row>
                  <Row label="Set by">This website only (first-party)</Row>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              This cookie holds no name, email address, identifier or profile — only the
              single word recording your decision. It is not used for advertising.
            </p>
          </Section>

          <Section title="Changing or withdrawing your choice">
            <p>
              You can change your mind at any time using the{" "}
              <strong className="text-white">Cookie preferences</strong> link in the
              footer of every page. You can move from rejected to accepted, or from
              accepted back to rejected, as often as you like.
            </p>
            <p>
              Withdrawing consent stops future Meta Pixel tracking from this website: the
              pixel stops running and is not loaded again on any future visit. It does not
              affect processing that occurred before consent was withdrawn.
            </p>
            <p>
              For questions or requests concerning personal data processed through the
              HEBS Lagos website, please use our{" "}
              <Link
                href="/contact"
                className="text-white underline underline-offset-4 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
              >
                Contact page
              </Link>
              . Meta also provides its own privacy controls for data processed through its
              services.
            </p>
            <p>
              You can also block or delete cookies in your browser settings. If you delete
              the cookie above, the website will simply ask you again on your next visit,
              with tracking off in the meantime.
            </p>
          </Section>

          <Section title="Your data protection rights">
            <p>
              Under the Nigeria Data Protection Act 2023, individuals may have rights over
              their personal data. Depending on the circumstances, these can include:
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>access to the personal data held about you</li>
              <li>correction of data that is inaccurate or incomplete</li>
              <li>erasure of your data, where applicable</li>
              <li>restriction of how your data is processed</li>
              <li>objection to processing</li>
              <li>withdrawal of consent you have given</li>
              <li>
                the right to complain to the Nigeria Data Protection Commission (NDPC)
              </li>
            </ul>
            <p>
              To ask about any of these in relation to this website, please use our{" "}
              <Link
                href="/contact"
                className="text-white underline underline-offset-4 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
              >
                Contact page
              </Link>
              .
            </p>
          </Section>

          <Section title="Questions">
            <p>
              If you have a question about this notice or about your choice, please reach
              us through the details on our{" "}
              <Link
                href="/contact"
                className="text-white underline underline-offset-4 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
              >
                Contact page
              </Link>
              .
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-white tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed" style={{ color: "#cfcfcf" }}>
        {children}
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <th
        scope="row"
        className="py-2 pr-4 align-top font-medium whitespace-nowrap"
        style={{ color: "#9b9b9b" }}
      >
        {label}
      </th>
      <td className="py-2" style={{ color: "#cfcfcf" }}>
        {children}
      </td>
    </tr>
  );
}
