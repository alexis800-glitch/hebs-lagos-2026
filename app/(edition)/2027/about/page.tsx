import type { Viewport } from "next";
import { AboutPage, reviewProps } from "@/components/2027/editorial/inner";
import { deployEnvironment } from "@/lib/publication";
import { pageMetadata } from "@/lib/site/seo-2027";

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export function generateMetadata() {
  return pageMetadata("about");
}

export default function Page({ searchParams }: { searchParams: { brand?: string; notes?: string } }) {
  return <AboutPage environment={deployEnvironment()} {...reviewProps(searchParams)} />;
}
