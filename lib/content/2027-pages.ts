/**
 * Copy for the HEBS 2027 inner pages (directive section 5), batch 1.
 *
 * The same rule as lib/content/2027.ts: headlines quoted in the directive are
 * `approved`; body copy written for the preview from the directive's own
 * wording is `provisional` until the owner signs it off. No speakers, sponsors,
 * prices, times, packages, addresses, contacts or figures are stated.
 */
import type { CopyBlock } from "./2027";

const directive = (text: string): CopyBlock => ({ status: "approved", text });
const draft = (text: string): CopyBlock => ({ status: "provisional", text });

export const PAGES = {
  experience: {
    title: draft("The HEBS 2027 experience"),
    intro: draft("Three days at NJS Royale Beach Resort, and six experiences that run through them: education, competitions, exhibitions, networking, celebrations and the destination itself."),
    daysIntro: draft("Each day has its own character. The detailed schedule is published on the event programme as sessions are confirmed."),
    /** Longer descriptions for the six experiences (directive 4D), by register slot. */
    more: {
      "exp-education": draft("Hair education, technical training, live demonstrations, beauty business development and professional masterclasses: the summit's strongest foundation."),
      "exp-competitions": draft("The competitions and categories of HEBS Lagos 2026, carried forward to 2027, recognising talent, creativity and technical excellence."),
      "exp-exhibitions": draft("Brands and businesses showing products, tools and services to the professionals who choose and use them."),
      "exp-networking": draft("Beauty professionals, educators, entrepreneurs and brands from Nigeria, across Africa, the United States, Europe and beyond, in one place for three days."),
      "exp-entertainment": draft("The Welcome Pre-Party opens the summit on July 23, and closing celebrations end it on July 25."),
      "exp-destination": draft("For the first time, the whole summit takes place at one beachfront resort on the Atlantic, so the event is also a place to stay and enjoy."),
    } as Record<string, CopyBlock>,
  },
  programme: {
    title: draft("Event programme"),
    intro: draft("The day-by-day schedule for HEBS Lagos 2027. Sessions, times and locations are added here as each one is confirmed."),
    empty: draft("No 2027 session is confirmed yet. This day's sessions appear here as they are approved."),
  },
  education: {
    title: directive("EDUCATION & MASTERCLASSES"),
    intro: draft("Professional education is one of HEBS's strongest foundations. The 2027 programme is built around five areas of learning, led by educators who are announced as they are officially confirmed."),
    tracks: [
      { id: "hair-education", title: "Hair education", body: draft("Cutting, colour, styling and care, taught by working professionals.") },
      { id: "technical-training", title: "Technical training", body: draft("Hands-on technique for stylists, barbers and beauty professionals who want to sharpen their craft.") },
      { id: "demonstrations", title: "Live demonstrations", body: draft("Techniques shown live on stage, from first step to finished look.") },
      { id: "business", title: "Beauty business development", body: draft("Building, running and growing a beauty business: clients, pricing, brand and team.") },
      { id: "masterclasses", title: "Professional masterclasses", body: draft("Focused sessions with leading educators for professionals ready for the next level.") },
    ],
    educators: draft("Speakers and educators are added here as they are officially confirmed."),
    registration: draft("How to register for education sessions is published with the 2027 programme."),
  },
  competitions: {
    intro: draft("HEBS competitions recognise talent, creativity and professional excellence. The 2027 competition categories and prize values remain the same as 2026."),
    eligibility: draft("Who may enter each competition, and what competitors must bring, is published with the 2027 rules."),
    rules: draft("The 2027 rules for every competition, including timing, judging and conduct, are published once approved."),
    apply: draft("Applications open through the HEBS 2027 registration portal once the 2027 rules, entry fees and deadlines are approved."),
    awards: draft("Every competition carries a prize, and 2027 prize values are the same as 2026. Amounts are shown here once the 2027 currency presentation is approved."),
  },
  sponsorship: {
    intro: draft("Sponsorship, exhibition, brand activation and strategic partnership opportunities for businesses that want to reach beauty professionals in Lagos and beyond."),
    steps: [
      { title: "See the opportunities", body: draft("Choose how you want to take part: sponsorship, exhibition, brand activation or a strategic partnership.") },
      { title: "Send an inquiry", body: draft("Tell the HEBS team about your brand and what you want to achieve.") },
      { title: "Receive the prospectus", body: draft("The 2027 sponsorship prospectus, with packages, is sent once it is approved.") },
      { title: "Get confirmation", body: draft("You receive confirmation that your inquiry has arrived, and the team follows up.") },
    ],
    prospectus: draft("The 2027 sponsorship prospectus and packages are published once approved."),
    contact: draft("Partnership contact details are published once approved."),
  },
  exhibitors: {
    title: draft("Exhibit at HEBS Lagos 2027"),
    intro: draft("Show your products, tools and services to beauty professionals across three days at NJS Royale Beach Resort."),
    opportunities: [
      { title: "Exhibition space", body: draft("A place on the exhibition floor to meet professionals and present your range.") },
      { title: "Brand showcases", body: draft("Present a launch, a collection or a service to the summit audience.") },
      { title: "Brand activation", body: draft("Create a moment guests take part in, on the beachfront or on stage.") },
    ],
    brands: draft("Participating brands are listed here as they are confirmed."),
  },
  travel: {
    title: draft("Travel & accommodation"),
    intro: draft("Everything visitors need to plan their trip to HEBS Lagos 2027, from arriving in Lagos to staying at the resort. Details are added as they are confirmed."),
    venue: draft("For the first time, the entire HEBS experience takes place at NJS Royale Beach Resort on the Atlantic beachfront in Lagos."),
    directions: draft("The resort's address and directions are published once the venue details are confirmed."),
    arrival: draft("International flights to Lagos arrive at Murtala Muhammed International Airport (LOS)."),
    airport: draft("Guidance on getting from the airport to the resort is published once transport arrangements are confirmed."),
    accommodation: draft("Special HEBS accommodation and hospitality packages at NJS Royale Beach Resort are being explored and will be introduced once officially approved."),
    visas: draft("Visa requirements depend on your nationality. Check them with the Nigeria Immigration Service before you book, and apply only through its official e-Visa portal."),
    support: draft("Support contacts for international visitors are published once approved."),
    faqs: [
      { q: "When and where is HEBS Lagos 2027?", a: draft("July 23–25, 2027, at NJS Royale Beach Resort in Lagos, Nigeria.") },
      { q: "Do I need a visa to visit Nigeria?", a: draft("It depends on your nationality. The Nigeria Immigration Service sets the rules; check its website before you travel and apply only through its official e-Visa portal.") },
      { q: "Where should I stay?", a: draft("HEBS accommodation packages at the resort are introduced once approved. Until then, no room or package is offered through this website.") },
      { q: "How do I get from the airport to the resort?", a: draft("Transport guidance is published here once arrangements are confirmed.") },
      { q: "Who can help me plan my visit?", a: draft("Support contacts for international visitors are published once approved. Join the priority list to hear first.") },
    ],
  },
} as const;
