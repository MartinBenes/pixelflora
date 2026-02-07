# Architecture

## Design goals

- Deterministic rendering for the same input seed.
- Clear separation between domain model, rendering engine, and UI orchestration.
- Small, testable modules with explicit data flow.
- Minimal hidden state.

## Module boundaries

### `src/core`

Domain vocabulary and immutable constants:

- type system (`types.ts`),
- phenotype defaults/options (`phenotype.ts`),
- color palettes and global constants.

### `src/engine`

Low-level primitives and utility logic:

- pixel/shape drawing,
- color shading,
- deterministic random number generation.

No UI or orchestration concerns should live here.

### `src/renderers`

Concrete drawing logic for individual plant parts:

- stem,
- leaves/tendrils,
- flowers,
- accessories (thorns/fruits/glow),
- pot.

Renderers receive all state via arguments and should remain deterministic.

### `src/orchestrator`

Top-level pipeline that coordinates renderers:

- context setup,
- background handling,
- wind frame interpolation,
- seeded RNG partitioning per component.

### `src/ui`

Browser integration layer:

- DOM state capture,
- animation loop and event wiring,
- export operations.

Business logic should remain outside this layer whenever possible.

## Testing strategy

- Unit tests for deterministic primitives and math logic.
- Integration tests for end-to-end render pipeline behavior.
- Coverage thresholds enforced in CI.

## Non-goals

- Framework lock-in.
- Hidden mutable global state.
- UI-driven mutation of rendering engine internals.
