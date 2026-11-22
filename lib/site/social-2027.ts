/**
 * Official HEBS social accounts for the 2027 site. They are the accounts already
 * published on the live HEBS site (www.hebslagos.com header and contact page,
 * retrieved 22 Nov 2026), restored on the 2027 pages on HEBS management's
 * instruction of 22 Nov 2026 (compliance audit, directive section 5 "Contact Us"
 * and section 9 "Social media integration"). Links only: no embedded feed, no
 * third-party script, nothing loaded before a visitor clicks.
 */
export interface SocialAccount {
  id: "instagram" | "facebook";
  label: string;
  handle: string;
  url: string;
}

export const SOCIAL_2027: readonly SocialAccount[] = [
  { id: "instagram", label: "Instagram", handle: "@haireducationbeautysummit", url: "https://www.instagram.com/haireducationbeautysummit/" },
  { id: "facebook", label: "Facebook", handle: "Hair Education Beauty Summit", url: "https://www.facebook.com/p/Hair-Education-Beauty-Summit-61571760180801/" },
];

export const SOCIAL_SOURCE =
  "Published on the live HEBS site, www.hebslagos.com (2026 header and contact page), retrieved 22 Nov 2026; restored for 2027 on HEBS management's instruction of 22 Nov 2026.";
