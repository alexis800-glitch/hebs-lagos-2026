import { deployEnvironment } from "@/lib/publication";
import {
  Destination,
  FinalCta,
  Header2027,
  Hero,
  Partners,
  PriorityListPreview,
  QrAccess,
  ThreeDays,
} from "@/components/2027/sections";

/**
 * Deliverable A: the HEBS 2027 announcement landing page (directive section 11).
 * The complete homepage (sections A-J) is previewed at /2027/homepage.
 */
export default function Announcement2027() {
  const environment = deployEnvironment();
  return (
    <>
      <Header2027 home="/2027" />
      <main>
        <Hero environment={environment} exploreHref="#three-days" />
        <ThreeDays environment={environment} programHref="/2027/status#program" />
        <Destination environment={environment} />
        <PriorityListPreview />
        <Partners />
        <QrAccess />
        <FinalCta environment={environment} />
      </main>
    </>
  );
}
