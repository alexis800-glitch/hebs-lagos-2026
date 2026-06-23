# NJS Royal Beach Resort Project Rules

## Active Project

This is the NJS Royal Beach Resort concept website workspace.

Work only inside this workspace:

`NJS_ROYALE_WEBSITE_ASSETS`

The actual website code must stay inside:

`website-build`

Do not create another website project folder unless explicitly instructed.

## Reference Folders

Do not delete, rename, move, or modify these reference folders:

* `floor-plans`
* `images`
* `mep-drawings`
* `pool-and-sections`
* `reference-pdf`
* `prompt`

Use these folders only as reference material.

If an image from a PDF is needed for the website, ask the user to extract it into the `images` folder first. Do not make the website depend directly on PDF files.

## Reference PDF Rule

Always review the `reference-pdf` folder when working on visual direction, image selection, resort positioning, rooms/spaces, dining, event spaces, lobby, bar, spa, or rooftop pool sections.

The PDF may include important interior design references, but the website must use actual image files from `website-build/public/images/` or copied/optimized images from the `images` folder.

Do not directly link to large PDFs from the website.

## Project Stage

This is currently a concept preview landing page, not the final production website.

Do not add:

* booking engine
* payment system
* PMS integration
* live contact form
* custom domain
* final reservation flow

unless explicitly requested.

Use concept-stage wording such as:

* “Enquire Now”
* “Register Interest”
* “Plan Your Stay”
* “Plan an Event”
* “Reservations opening soon”
* “Contact details to be confirmed”

Avoid final booking language like:

* “Book Now”
* “Reserve a Room”
* “Check Availability”
* “Pay Now”

unless official booking flow details are provided.

## Think Before Editing

Before making changes:

1. Inspect the relevant files.
2. State the intended plan briefly.
3. Identify the exact files likely to change.
4. If there is ambiguity, ask before editing.

## Surgical Changes Only

Only edit files directly related to the requested task.

Do not touch unrelated:

* layout
* hero section
* image paths
* CTA wording
* gallery
* footer
* deployment settings
* package files
* project configuration

unless the task specifically requires it.

## Do Not Invent Content

Do not add:

* fake guest names
* fake testimonials
* fake countries
* fake awards
* fake ratings or certifications
* fake phone numbers
* fake emails
* fake partners
* Lorem Ipsum
* placeholder content that appears final

Use neutral premium wording when details are not confirmed.

## Image Rules

Use clean image naming where possible:

* lowercase
* hyphen-separated
* no spaces
* no long WhatsApp filenames

Good examples:

* `exterior-entrance-facade-01.jpg`
* `grand-entrance-hall-01.jpg`
* `double-height-grand-lounge-01.jpg`
* `ground-floor-bar-01.jpg`
* `rooftop-pool-01.jpg`
* `fine-dining-restaurant-01.jpg`

Do not use images that confuse the resort brand, including:

* technical/server room images
* luggage room images
* back-of-house operational images
* hair salon images with unrelated branding
* nail salon images with “NAIL” signage
* children’s playground images unless specifically requested

## Rooftop Pool Rule

The rooftop pool is an important selling point.

When working on the rooftop pool section, reference:

* `pool-and-sections/POOL SECTION.pdf`
* `floor-plans/fifth floor.pdf`

If no pool render exists, keep the pool section text-led and concept-stage. Do not pretend a final pool photo exists.

## Rooms and Suites Rule

Do not misrepresent spa, salon, lounge, or corridor images as confirmed guest rooms.

If actual guest room renders are not available, use softer section naming such as:

* “Signature Spaces”
* “Luxury Spaces Preview”
* “Interior Concept Preview”

instead of final “Rooms & Suites” claims.

## Design Direction

Maintain a premium luxury resort feel:

* navy
* gold
* sand
* ivory
* marble
* glass
* tropical elegance
* calm spacing
* elegant typography
* mobile-first layout

The visual style should feel like a premium oceanfront resort, not a generic hotel template.

## Context7

Use Context7 when working with:

* Next.js
* Tailwind CSS
* Framer Motion
* TypeScript
* next/font/google
* Next.js Image
* Lucide React
* Vercel

## Verify Before Reporting Done

After changes, run:

`npm run build`

from inside:

`website-build`

Then report:

1. files changed
2. exact changes made
3. images used or changed
4. fake/placeholder content removed if applicable
5. mobile checks if UI was changed
6. build result
7. anything that needs review

## Git Safety

Do not commit or push automatically.

After changes, report the result first and wait for approval before running:

* `git add`
* `git commit`
* `git push`

## Deployment Safety

Do not deploy unless explicitly approved.

If deployed, it must be a preview/staging deployment unless the user clearly says it is production.

Do not connect a custom domain unless explicitly requested.

## If Unsure

Stop and ask before editing.
