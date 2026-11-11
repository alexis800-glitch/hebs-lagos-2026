#!/usr/bin/env bash
# Deploy the client design-review preview of the HEBS Lagos 2027 site: a PREVIEW
# deployment built with HEBS_CLIENT_PREVIEW=on, so it renders exactly as
# production would with every built 2027 page open (lib/publication.ts,
# clientPreview), and with nothing indexed or tracked.
#
# Only the approved media (public/2027/media/) is copied in. The private review
# folder (public/_review/), which holds excluded and restricted material, is not,
# and the middleware answers /_review/*, /2027/review, /2027/status and the
# concept studies as missing pages there anyway.
#
# It never deploys to production and stores no setting in the Vercel project.
# Access for a viewer without a Vercel account is a deployment-scoped share
# link with an expiry, created separately and revocable at any time.
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT=$(pwd)
VERCEL="npx -y vercel@65.2.0"
[ -d public/2027/media ] || { echo "public/2027/media is missing: run npm run media:prepare" >&2; exit 1; }
# The Vercel project: .vercel/project.json, or VERCEL_ORG_ID and VERCEL_PROJECT_ID in the environment.
[ -f .vercel/project.json ] || [ -n "${VERCEL_PROJECT_ID:-}" ] || { echo "No Vercel project: link it or set VERCEL_ORG_ID and VERCEL_PROJECT_ID" >&2; exit 1; }
WORK=$(mktemp -d)/client-preview
trap 'git -C "$ROOT" worktree remove --force "$WORK" >/dev/null 2>&1 || true' EXIT
git worktree add --detach "$WORK" HEAD >/dev/null
mkdir -p "$WORK/public/2027" "$WORK/.vercel"
cp -R public/2027/media "$WORK/public/2027/"
[ -f .vercel/project.json ] && cp .vercel/project.json "$WORK/.vercel/"
cd "$WORK"
$VERCEL deploy --yes --build-env HEBS_CLIENT_PREVIEW=on --env HEBS_CLIENT_PREVIEW=on
