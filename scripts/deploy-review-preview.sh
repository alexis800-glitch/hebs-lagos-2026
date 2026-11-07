#!/usr/bin/env bash
# Deploy the protected HEBS 2027 review preview from this checkout, with the
# owner-authorised review media in public/_review/home-2027/.
#
# The media is never committed. This builds locally in preview mode with
# HEBS_REVIEW_MEDIA=on and uploads the prebuilt output as a PREVIEW deployment,
# which Vercel Authentication protects (pages and media files alike).
# It never deploys to production and stores no setting in the Vercel project.
#
# Needs: a signed-in Vercel CLI (`npx vercel@39.3.0 login`), and the project
# linked in .vercel/project.json.
set -euo pipefail
cd "$(dirname "$0")/.."
VERCEL="npx -y vercel@39.3.0"

[ -d public/_review/home-2027 ] || { echo "public/_review/home-2027 is missing" >&2; exit 1; }
git diff --quiet HEAD -- . ':!public/_review' || { echo "commit your changes first" >&2; exit 1; }

$VERCEL pull --yes --environment=preview
HEBS_REVIEW_MEDIA=on $VERCEL build --yes
# --prebuilt uploads .vercel/output as built above; no --prod, so this is a preview.
$VERCEL deploy --prebuilt --yes --env HEBS_REVIEW_MEDIA=on
