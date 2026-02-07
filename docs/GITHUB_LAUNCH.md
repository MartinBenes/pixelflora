# GitHub Launch Guide

This guide is the canonical checklist for publishing PixelFlora on GitHub with enterprise-grade defaults.

## Prerequisites

- `git` installed
- `gh` installed (`gh --version`)
- GitHub authentication configured (`gh auth login`)

## 1. Authenticate GitHub CLI

```bash
gh auth login -h github.com -p https -w
gh auth status
```

## 2. Create or connect remote repository

Automated option (recommended):

```bash
./scripts/github-bootstrap.sh <owner> pixelflora public
```

Manual option:

If the repository does not exist yet:

```bash
gh repo create <owner>/pixelflora --public --source=. --remote=origin --push
```

If the repository already exists:

```bash
git remote add origin git@github.com:<owner>/pixelflora.git
git push -u origin main
```

## 3. Enable GitHub security features

```bash
gh api -X PATCH repos/<owner>/pixelflora \
  -f has_issues=true \
  -f has_projects=false \
  -f has_wiki=false \
  -f delete_branch_on_merge=true
```

## 4. Protect `main` branch

```bash
gh api -X PUT repos/<owner>/pixelflora/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks.strict=true \
  -f required_status_checks.contexts[]="Quality Gate" \
  -f enforce_admins=true \
  -f required_pull_request_reviews.required_approving_review_count=1 \
  -f required_pull_request_reviews.dismiss_stale_reviews=true \
  -f restrictions=
```

## 5. Verify workflows

After first push, ensure these workflows are green in GitHub Actions:

- `CI` (`.github/workflows/ci.yml`)
- `CodeQL` (`.github/workflows/codeql.yml`)
- `Dependency Review` (`.github/workflows/dependency-review.yml`)
- `Scorecard` (`.github/workflows/scorecard.yml`)

## 6. Create first release

```bash
git tag v1.0.0
git push origin v1.0.0
```

This triggers `.github/workflows/release.yml`, which runs checks, packages `dist/`, creates SHA-256 checksums, and publishes a GitHub release.
