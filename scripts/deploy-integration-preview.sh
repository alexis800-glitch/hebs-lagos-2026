#!/usr/bin/env bash
# Deploy the protected INTEGRATION preview: the full 2027 review site (review
# media and approved media copied in, as scripts/deploy-review-preview.sh does)
# with the forms in staging mode, submitting to the private Base44 TEST copy.
#
# The staging settings are NOT passed here. The owner sets them once as Vercel
# environment variables, Preview scope only, typed directly into Vercel:
#   HEBS_STAGING_PORTAL_FORM_URL     the test copy's evSubmitPublicForm URL (from Claude Desktop)
#   HEBS_STAGING_PORTAL_APP_ID       the test copy's app id
#   HEBS_STAGING_PORTAL_FORM_SECRET  the secret the test copy holds (EV_FORM_HMAC_SECRET)
#   HEBS_RATE_LIMIT_REST_URL / _TOKEN and HEBS_RATE_LIMIT_SALT (shared store), or
#   HEBS_STAGING_ALLOW_MEMORY_STORE=yes for a short test run
#   HEBS_STAGING_RATE_LIMIT_MAX      optional, e.g. 50 for an end-to-end run
# The website refuses staging mode on production, on the client preview and
# against the live portal (lib/forms-2027/config.ts). It never deploys to production.
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT=$(pwd)
VERCEL="npx -y vercel@65.2.0"
[ -d public/_review/home-2027 ] || { echo "public/_review/home-2027 is missing" >&2; exit 1; }
[ -d public/2027/media ] || { echo "public/2027/media is missing: run npm run media:prepare" >&2; exit 1; }
[ -f .vercel/project.json ] || [ -n "${VERCEL_PROJECT_ID:-}" ] || { echo "No Vercel project: link it or set VERCEL_ORG_ID and VERCEL_PROJECT_ID" >&2; exit 1; }
WORK=$(mktemp -d)/integration-preview
trap 'git -C "$ROOT" worktree remove --force "$WORK" >/dev/null 2>&1 || true' EXIT
git worktree add --detach "$WORK" HEAD >/dev/null
mkdir -p "$WORK/public/_review" "$WORK/public/2027" "$WORK/.vercel"
cp -R public/_review/home-2027 "$WORK/public/_review/"
cp -R public/2027/media "$WORK/public/2027/"
[ -f .vercel/project.json ] && cp .vercel/project.json "$WORK/.vercel/"
cd "$WORK"
$VERCEL deploy --yes --build-env HEBS_REVIEW_MEDIA=on --env HEBS_REVIEW_MEDIA=on --env HEBS_FORMS_MODE=staging
