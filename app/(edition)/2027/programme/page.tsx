import type { Viewport } from "next";
import { ProgrammePage, pageTitle, reviewProps } from "@/components/2027/editorial/inner";
import { deployEnvironment } from "@/lib/publication";
import { stagingMetadata } from "@/lib/site/metadata-2027";

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export function generateMetadata() {
  return stagingMetadata(pageTitle("programme"));
}

export default function Page({ searchParams }: { searchParams: { brand?: string; notes?: string } }) {
  return <ProgrammePage environment={deployEnvironment()} {...reviewProps(searchParams)} />;
}
