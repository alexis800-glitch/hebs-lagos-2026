import type { Viewport } from "next";
import { ContactPage, pageTitle, reviewProps } from "@/components/2027/editorial/inner";
import { deployEnvironment } from "@/lib/publication";
import { stagingMetadata } from "@/lib/site/metadata-2027";

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export function generateMetadata() {
  return stagingMetadata(pageTitle("contact"));
}

export default function Page({ searchParams }: { searchParams: { brand?: string; notes?: string } }) {
  return <ContactPage environment={deployEnvironment()} {...reviewProps(searchParams)} />;
}
