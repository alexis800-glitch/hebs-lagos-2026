import type { Viewport } from "next";
import { SponsorshipPage, pageTitle, reviewProps } from "@/components/2027/editorial/inner";
import { deployEnvironment } from "@/lib/publication";
import { stagingMetadata } from "@/lib/site/metadata-2027";

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export function generateMetadata() {
  return stagingMetadata(pageTitle("sponsorship"));
}

export default function Page({ searchParams }: { searchParams: { brand?: string; notes?: string } }) {
  return <SponsorshipPage environment={deployEnvironment()} {...reviewProps(searchParams)} />;
}
