# Release Process

## Versioning

This project follows semantic versioning:

- `MAJOR`: incompatible API or behavior changes.
- `MINOR`: backward-compatible features.
- `PATCH`: backward-compatible fixes.

## How a release is created

1. Ensure `main` is green (CI, tests, coverage, build).
2. Tag a release commit as `vX.Y.Z`.
3. Push the tag to GitHub.
4. GitHub Actions `release.yml` builds, packages, checksums, and publishes the release.

## Release quality gates

- `npm run check` must pass.
- Security workflows must remain healthy (CodeQL, dependency review, Scorecard).
- Release artifacts must include checksum files.
