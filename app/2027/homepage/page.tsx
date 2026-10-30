import { deployEnvironment } from "@/lib/publication";
import {
  Competitions,
  Destination,
  Education,
  Experience,
  FinalCta,
  Header2027,
  Hero,
  Highlights2026,
  Partners,
  PriorityListPreview,
  ThreeDays,
  Welcome,
} from "@/components/2027/sections";

/**
 * Deliverable B: the complete redesigned homepage, all ten sections A-J of
 * directive section 4, in directive order. The priority list sits before the
 * final call to action so every "priority list" button has a target.
 */
export default function Homepage2027() {
  const environment = deployEnvironment();
  return (
    <>
      <Header2027 home="/2027/homepage" />
      <main>
        <Hero environment={environment} exploreHref="#experience" />
        <Welcome />
        <ThreeDays environment={environment} programHref="/2027/status#program" />
        <Experience environment={environment} />
        <Destination environment={environment} />
        <Competitions />
        <Education environment={environment} />
        <Partners />
        <Highlights2026 environment={environment} />
        <PriorityListPreview />
        <FinalCta environment={environment} />
      </main>
    </>
  );
}
