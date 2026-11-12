import { COPY } from "@/lib/content/2027";
import { EDITION_DAYS, VENUE } from "@/lib/editions/2027";
import { siteOrigin } from "@/lib/launch-2027";
import { deployEnvironment, gatedValue, isRenderable, type DeployEnvironment } from "@/lib/publication";
import { BASE } from "@/lib/site/2027";
import { SITE_NAME, SOCIAL_CARD } from "@/lib/site/seo-2027";

/**
 * schema.org Event data for the 2027 summit, from confirmed facts only: the name
 * and the three dates. The venue and the description join only where they may
 * be shown in this environment (on production: once approved). There are no
 * offers, prices, times, performers or speakers: none is confirmed.
 */
export function eventJsonLd(environment: DeployEnvironment = deployEnvironment()) {
  const origin = siteOrigin();
  const venue = gatedValue(VENUE.name, environment);
  const description = isRenderable(COPY.seo.homeDescription.status, environment) ? COPY.seo.homeDescription.text : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: SITE_NAME,
    startDate: EDITION_DAYS[0].isoDate,
    endDate: EDITION_DAYS[EDITION_DAYS.length - 1].isoDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: `${origin}${BASE}`,
    image: [`${origin}${SOCIAL_CARD.path}`],
    ...(description ? { description } : {}),
    ...(venue
      ? { location: { "@type": "Place", name: venue, address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" } } }
      : {}),
    organizer: { "@type": "Organization", name: "Hair Education Beauty Summit (HEBS)", url: origin },
  };
}

/** The Event data as a JSON-LD script, escaped so no value can close the tag. */
export function EventJsonLd() {
  const json = JSON.stringify(eventJsonLd()).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
