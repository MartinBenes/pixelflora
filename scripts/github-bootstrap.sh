#!/usr/bin/env bash
set -euo pipefail

OWNER="${1:-}"
REPO="${2:-genetix}"
VISIBILITY="${3:-public}"

if [[ -z "$OWNER" ]]; then
  echo "Usage: $0 <owner> [repo=genetix] [visibility=public|private]"
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh CLI is required."
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Error: gh is not authenticated. Run: gh auth login -h github.com -p https -w"
  exit 1
fi

FULL_REPO="${OWNER}/${REPO}"

if gh repo view "$FULL_REPO" >/dev/null 2>&1; then
  echo "Repository exists: $FULL_REPO"
else
  echo "Creating repository: $FULL_REPO"
  gh repo create "$FULL_REPO" --"$VISIBILITY"
fi

if git remote get-url origin >/dev/null 2>&1; then
  echo "Remote origin already configured."
else
  echo "Configuring origin remote."
  git remote add origin "https://github.com/${FULL_REPO}.git"
fi

echo "Pushing main branch."
git push -u origin main

echo "Applying repository settings."
gh api -X PATCH "repos/${FULL_REPO}" \
  -f has_issues=true \
  -f has_projects=false \
  -f has_wiki=false \
  -f delete_branch_on_merge=true

echo "Applying branch protection for main."
gh api -X PUT "repos/${FULL_REPO}/branches/main/protection" \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks.strict=true \
  -f required_status_checks.contexts[]="Quality Gate" \
  -f enforce_admins=true \
  -f required_pull_request_reviews.required_approving_review_count=1 \
  -f required_pull_request_reviews.dismiss_stale_reviews=true \
  -f restrictions=

echo "Bootstrap completed for ${FULL_REPO}."
