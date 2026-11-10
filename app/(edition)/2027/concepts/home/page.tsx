import { redirect } from "next/navigation";

/** The preferred homepage became the canonical 2027 homepage (A2): one homepage only. */
export default function PreferredHomepageMoved() {
  redirect("/2027");
}
