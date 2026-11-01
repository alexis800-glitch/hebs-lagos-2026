import type { Viewport } from "next";
import DirectionA from "@/components/2027/concepts/DirectionA";
import { deployEnvironment } from "@/lib/publication";
import { EDITORIAL_FONTS } from "../fonts-editorial";

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

/** Direction A, refined: hero, Welcome and three days (staging, owner review). */
export default function DirectionAPage() {
  return (
    <div className={EDITORIAL_FONTS}>
      <DirectionA environment={deployEnvironment()} />
    </div>
  );
}
