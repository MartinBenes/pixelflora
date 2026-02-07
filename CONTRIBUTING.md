# Contributing to PixelFlora

Thanks for contributing. This project is intentionally strict on quality because reproducibility and maintainability are core goals.

## Prerequisites

- Node.js `>= 20`
- npm `>= 10`

## Setup

```bash
npm ci
npm run dev
```

## Development workflow

1. Create a focused branch from `main`.
2. Keep changes small and logically scoped.
3. Add/update tests for behavior changes.
4. Run `npm run check` before opening a PR.
5. Fill out the PR template completely.

## Pull request checklist

- [ ] Clear problem statement and solution summary.
- [ ] Tests added/updated where behavior changed.
- [ ] No unrelated refactors mixed into the PR.
- [ ] `npm run check` passes locally.
- [ ] Risk and rollback plan included in PR description.

## Coding standards

- Use TypeScript strict mode idioms; avoid unsafe casts.
- Prefer pure functions and explicit input/output boundaries.
- Keep renderer behavior deterministic for identical seeds.
- Preserve separation between orchestration and drawing primitives.
- Follow existing naming and module conventions.

## Commit quality

- Use descriptive commit messages.
- Prefer one responsibility per commit.
- Avoid force-push to shared branches unless coordinated.

## Reporting issues

- Use issue templates for bug reports and feature requests.
- Include seed/config details for rendering issues whenever possible.
