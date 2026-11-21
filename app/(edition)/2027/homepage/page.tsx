import { redirect } from "next/navigation";

/**
 * The earlier editorial homepage is retired (A2): the cinematic homepage at /2027
 * is the single 2027 homepage. Its priority-list section now lives on the Tickets
 * & registration page (PRIORITY_HREF).
 */
export default function EarlierHomepageRetired() {
  redirect("/2027");
}
