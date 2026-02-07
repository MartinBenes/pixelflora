# PixelFlora

Procedural plant generator focused on deterministic pixel-art rendering with a strict engineering baseline for open source collaboration.

![PixelFlora animation](docs/assets/animation.gif)

## Why this project

- Deterministic rendering from a seed for reproducibility.
- Clean TypeScript architecture split into `core`, `engine`, `renderers`, `orchestrator`, and `ui`.
- Enterprise-grade quality controls: CI quality gate, dependency review, CodeQL, OpenSSF Scorecard, SBOM artifacts, and coverage thresholds.

## Quick start

```bash
npm ci
npm run dev
```

Open the app at `/index-vite.html` (served by Vite).

## Quality commands

```bash
npm run format:check
npm run lint
npm run test
npm run test:coverage
npm run build
npm run check
```

## Architecture

- `src/core`: shared constants, domain types, phenotype defaults/options, palettes.
- `src/engine`: low-level drawing primitives, shading, deterministic RNG.
- `src/renderers`: plant part renderers (stem, leaves, flowers, accessories, pot).
- `src/orchestrator`: full render pipeline coordination.
- `src/ui`: DOM controls, app lifecycle, animation, export behavior.
- `tests`: unit and integration tests with mock canvas.

More details are in `docs/ARCHITECTURE.md`.

## Engineering standards

- Strict TypeScript (`strict` + extra safety flags).
- Prettier + ESLint enforcement.
- Coverage thresholds (Vitest) enforced in CI.
- PR template and issue forms for consistent collaboration.
- Security and supply-chain automation via Dependabot + CodeQL + Scorecard + SBOM generation.

## Project governance

- Contribution workflow: `CONTRIBUTING.md`
- Maintainer governance and decision model: `GOVERNANCE.md`
- Support policy and response targets: `SUPPORT.md`
- Release process and versioning: `RELEASE.md`
- GitHub publishing and hardening checklist: `docs/GITHUB_LAUNCH.md`

## Contributing

See `CONTRIBUTING.md`.

## GitHub bootstrap

After authenticating GitHub CLI, you can bootstrap repository settings with:

```bash
./scripts/github-bootstrap.sh <owner> pixelflora public
```

## Security

See `SECURITY.md`.

## License

ISC, see `LICENSE`.
