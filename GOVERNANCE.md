# Governance

## Purpose

This document defines how project decisions are made, who is responsible for critical areas, and how contributors can participate in roadmap and architecture direction.

## Roles

- Maintainers: trusted reviewers with merge and release authority.
- Contributors: anyone proposing changes via issues and pull requests.

Current maintainer ownership is defined in `.github/CODEOWNERS`.

## Decision model

- Day-to-day changes: maintainers decide in pull requests.
- Significant changes: use a short design proposal in an issue before implementation.
- Breaking changes: require explicit maintainer approval and migration notes.

For most topics, this project uses lazy consensus:

- If no strong objection is raised within a reasonable review window, maintainers may merge.
- Objections must include technical rationale and a concrete alternative.

## Conflict resolution

- Resolve disagreements with reproducible data: benchmarks, tests, architecture tradeoff notes.
- If consensus cannot be reached, maintainers make the final call and document the reasoning in the PR.

## Security exception path

For active vulnerabilities, maintainers may use a private patch flow and coordinated disclosure process defined in `SECURITY.md`.

## Release and maintenance expectations

- Maintainers are responsible for release quality and changelog accuracy.
- Security and dependency updates are prioritized over non-critical feature work.
- Inactive maintainers may be removed from CODEOWNERS after prolonged inactivity.
