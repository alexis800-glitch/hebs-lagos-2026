import type { Viewport } from "next";
import { TicketsPage, pageTitle, reviewProps } from "@/components/2027/editorial/inner";
import { deployEnvironment } from "@/lib/publication";
import { stagingMetadata } from "@/lib/site/metadata-2027";
import { EDITORIAL_FONTS } from "../concepts/fonts-editorial";

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export function generateMetadata() {
  return stagingMetadata(pageTitle("tickets"));
}

export default function Page({ searchParams }: { searchParams: { brand?: string; notes?: string } }) {
  return (
    <div className={EDITORIAL_FONTS}>
      <TicketsPage environment={deployEnvironment()} {...reviewProps(searchParams)} />
    </div>
  );
}
