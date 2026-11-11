/**
 * Copy for the HEBS 2027 inner pages (directive section 5), batch 1.
 *
 * The same rule as lib/content/2027.ts: headlines quoted in the directive are
 * `approved`; body copy written for the preview from the directive's own
 * wording is `provisional` until the owner signs it off. No speakers, sponsors,
 * prices, times, packages, addresses, contacts or figures are stated.
 */
import type { CopyBlock } from "./2027";
import { DIRECTIVE_HEADLINES as D } from "./directive-headlines-2027";

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
      "exp-destination": draft("For the first time, the whole summit takes place at one resort on the Atlantic coast, so the event is also a place to stay and enjoy."),
    } as Record<string, CopyBlock>,
  },
  programme: {
    title: draft("Event programme"),
    intro: draft("The day-by-day schedule for HEBS Lagos 2027. Sessions, times and locations are added here as each one is confirmed."),
    empty: draft("No 2027 session is confirmed yet. This day's sessions appear here as they are approved."),
  },
  education: {
    title: directive(D.education),
    intro: draft("Professional education is one of HEBS's strongest foundations. The 2027 programme is planned around five areas of learning."),
    tracks: [
      { id: "hair-education", title: "Hair education", body: draft("Cutting, colour, styling and care, taught by working professionals.") },
      { id: "technical-training", title: "Technical training", body: draft("Hands-on technique for stylists, barbers and beauty professionals who want to sharpen their craft.") },
      { id: "demonstrations", title: "Live demonstrations", body: draft("Techniques shown live on stage, from first step to finished look.") },
      { id: "business", title: "Beauty business development", body: draft("Building, running and growing a beauty business: clients, pricing, brand and team.") },
      { id: "masterclasses", title: "Professional masterclasses", body: draft("Focused sessions with leading educators for professionals ready for the next level.") },
    ],
    educators: draft("Speakers and educators are added here as they are officially confirmed."),
    registration: draft("How to register for education sessions is published with the 2027 programme."),
    leadCaption: draft("HEBS Lagos 2026"),
    photos: draft("Learning at HEBS Lagos 2026."),
    photosCaption: draft("Photographed at HEBS Lagos 2026."),
    speakerCaption: draft("A speaker at HEBS Lagos 2026. 2027 speakers will be announced once confirmed."),
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
      { title: "Brand activation", body: draft("Create a moment guests take part in, at the resort or on stage.") },
    ],
    brands: draft("Participating brands are listed here as they are confirmed."),
  },
  travel: {
    title: draft("Travel & accommodation"),
    intro: draft("Everything visitors need to plan their trip to HEBS Lagos 2027, from arriving in Lagos to staying at the resort. Details are added as they are confirmed."),
    venue: draft("For the first time, the entire HEBS experience takes place at NJS Royale Beach Resort, on the Atlantic coast of Lagos."),
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
      { q: "Who can help me plan my visit?", a: draft("Support contacts for international visitors are published once approved. The 2027 priority list, opening soon, is the way to hear first.") },
    ],
  },
  tickets: {
    title: draft("Tickets & registration"),
    intro: draft("Tickets for HEBS Lagos 2027 are not on sale yet. Ticket categories, prices and registration open once they are officially approved."),
    status: draft("Ticket sales are not open. No payment is taken through this website until ticket sales are officially opened."),
    categories: draft("Ticket categories and prices are published here once approved."),
    /** Directive section 6, what ticketing will support once released. */
    willSupport: ["Different ticket categories", "Secure online payment", "Automatic confirmation emails", "A unique ticket reference and QR code", "Secure handling of attendee details"],
    willSupportNote: draft("When tickets are released, registration will include:"),
  },
  gallery: {
    title: draft("Gallery & past events"),
    intro: draft("Photographs, videos, testimonials and highlights from HEBS Lagos. Approved HEBS Lagos 2026 material is added here as it is cleared for use."),
    pending: draft("HEBS Lagos 2026 photographs and videos appear here once approved, with rights and consent recorded for every image."),
    archive: draft("The HEBS Lagos 2026 website stays online as the record of the 2026 edition."),
    earlier: draft("HEBS held earlier editions in the United States. Their photographs belong to the HEBS archive and are not shown on the Lagos 2027 site."),
    photosTitle: draft("HEBS Lagos 2026, in photographs."),
    photosIntro: draft("Photographed on the two summit days, 24 and 25 October 2026."),
    /** Review photographs (lib/assets/home-2027-review.ts), grouped by what each one shows. */
    categories: [
      { id: "hair", title: draft("Hair and barbering"), photos: ["gal-img_6721", "gal-img_6724", "gal-dsc_1947", "gal-dsc_1395", "gal-img_6824", "gal-dsc_2148", "gal-dsc_1969", "gal-dsc_2239"] },
      { id: "competitions", title: draft("Competitions and awards"), photos: ["gal-img_6688", "gal-img_8357", "gal-img_6755", "gal-img_7937", "gal-img_7821"] },
      { id: "beauty", title: draft("Beauty and nails"), photos: ["gal-dsc_1489", "gal-dsc_1452", "gal-dsc_1276"] },
      { id: "stage", title: draft("Learning on stage"), photos: ["gal-dsc_1194", "gal-dsc_1305", "gal-0q1a0444", "gal-0q1a0445", "gal-img_7809", "gal-dsc_1786", "gal-dsc_1798"] },
      { id: "fashion", title: draft("Fashion and runway"), photos: ["gal-dsc_2093", "gal-dsc_2097", "gal-dsc_2034", "gal-dsc_2037", "gal-0q1a0481", "gal-0q1a0117"] },
      { id: "exhibitors", title: draft("Exhibitors"), photos: ["gal-0q1a0074", "gal-dsc_1734", "gal-0q1a0098", "gal-dsc_1727"] },
      { id: "guests", title: draft("Guests and celebrations"), photos: ["gal-0q1a0470", "gal-img_7144", "gal-img_7147", "gal-img_7139", "gal-0q1a0374", "gal-img_7299"] },
    ],
  },
  contact: {
    title: draft("Contact us"),
    intro: draft("Questions about HEBS Lagos 2027, partnerships or the press. Official contact details are published once approved."),
    emails: draft("Official HEBS 2027 email addresses are published here once approved."),
    social: draft("Official HEBS social media accounts are listed here once confirmed."),
  },
  about: {
    title: draft("About HEBS"),
    /** From the live HEBS Lagos 2026 About page; to be reconfirmed for 2027. */
    history: draft("After United States editions in 2024 and 2025, and another sold-out edition from 2–4 May 2026, the Hair Education Beauty Summit came home to Lagos for its fourth edition in October 2026."),
    next: draft("In 2027, for the first time, the entire HEBS experience takes place at one destination: NJS Royale Beach Resort, on the Atlantic coast of Lagos."),
    pillarsSource: "HEBS Lagos 2026 About page, as published",
    pillars: [
      { title: "Bridging Education with Opportunity", body: draft("Providing beauty and industry professionals with world-class technical training, mentorship programs, and immediate access to the latest global trends and product innovations.") },
      { title: "Connecting Professionals Worldwide", body: draft("Creating a dynamic global network and physical hub where hairstylists, masters barbers, creative makeup artists, fashion stylists, educators, and global brand leaders can seamlessly collaborate, share narratives, and grow collectively.") },
      { title: "Empowering the Next Generation", body: draft("Ensuring that the collective future of beauty, grooming, and high-fashion remains completely inclusive, boundary-pushing, hyper-innovative, and continuously driven by technical excellence.") },
    ],
    vision: draft("The HEBS vision and its impact on the beauty industry are published here once approved."),
  },
  speakers: {
    title: draft("Speakers & educators"),
    intro: draft("The professionals who teach, demonstrate and speak at HEBS Lagos 2027. Each is added here once officially confirmed."),
    pending: draft("No speaker or educator for 2027 is confirmed yet."),
    profile: ["Professional profile", "Biography", "Photograph", "Sessions at HEBS 2027"],
    teach: draft("Interested in teaching at HEBS 2027? Speakers and educators are confirmed by the HEBS team; the 2027 priority list, opening soon, is the way to hear first."),
  },
} as const;
