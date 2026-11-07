#!/usr/bin/env bash
# Deploy the protected HEBS 2027 review preview with the owner-authorised review
# media from public/_review/home-2027/.
#
# The media is never committed. This exports the committed code (HEAD) to a
# temporary worktree, so no untracked or uncommitted file can ride along, copies
# in only the review media and the Vercel project link, builds there in preview
# mode with HEBS_REVIEW_MEDIA=on, and uploads the prebuilt output as a PREVIEW
# deployment. Vercel Authentication protects it, pages and media files alike.
# It never deploys to production and stores no setting in the Vercel project.
#
# Needs: a signed-in Vercel CLI (`npx -y vercel@65.1.0 login`) and the project
# link in .vercel/project.json.
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT=$(pwd)
VERCEL="npx -y vercel@65.1.0"

[ -d public/_review/home-2027 ] || { echo "public/_review/home-2027 is missing" >&2; exit 1; }
[ -f .vercel/project.json ] || { echo ".vercel/project.json is missing" >&2; exit 1; }

WORK=$(mktemp -d)/review-preview
trap 'git -C "$ROOT" worktree remove --force "$WORK" >/dev/null 2>&1 || true' EXIT
git worktree add --detach "$WORK" HEAD >/dev/null
mkdir -p "$WORK/public/_review" "$WORK/.vercel"
cp -R public/_review/home-2027 "$WORK/public/_review/"
cp .vercel/project.json "$WORK/.vercel/"

cd "$WORK"
$VERCEL pull --yes --environment=preview
HEBS_REVIEW_MEDIA=on $VERCEL build --yes
# --prebuilt uploads .vercel/output as built above; no --prod, so this is a preview.
$VERCEL deploy --prebuilt --yes --env HEBS_REVIEW_MEDIA=on
