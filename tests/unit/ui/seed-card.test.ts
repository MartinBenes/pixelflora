import { describe, expect, it } from 'vitest';
import { makePhenotype } from '../../helpers/phenotype';
import { deserializeSeedCard, SEED_CARD_SCHEMA_VERSION, serializeSeedCard } from '@/ui/seed-card';
import type { AppConfiguration } from '@/core/types';

describe('seed card', () => {
  const baseConfig: AppConfiguration = {
    phenotype: makePhenotype({ stem: 'vine', flowerShape: 'daisy', glow: true }),
    seed: 'legacy-seed',
    animate: true,
    bgMode: 'dark',
  };

  it('serializes to versioned schema', () => {
    const serialized = serializeSeedCard(baseConfig);
    const parsed = JSON.parse(serialized) as { schemaVersion: number; config: AppConfiguration };

    expect(parsed.schemaVersion).toBe(SEED_CARD_SCHEMA_VERSION);
    expect(parsed.config.seed).toBe('legacy-seed');
  });

  it('deserializes current schema payload', () => {
    const serialized = serializeSeedCard(baseConfig);
    const config = deserializeSeedCard(serialized);

    expect(config.seed).toBe(baseConfig.seed);
    expect(config.phenotype.flowerShape).toBe(baseConfig.phenotype.flowerShape);
    expect(config.bgMode).toBe(baseConfig.bgMode);
  });

  it('migrates legacy non-versioned payloads', () => {
    const legacyPayload = JSON.stringify(baseConfig);
    const config = deserializeSeedCard(legacyPayload);

    expect(config.seed).toBe(baseConfig.seed);
    expect(config.phenotype.stem).toBe(baseConfig.phenotype.stem);
  });

  it('throws for invalid payloads', () => {
    expect(() => deserializeSeedCard('not-json')).toThrow('Invalid seed card JSON.');
    expect(() => deserializeSeedCard(JSON.stringify({ schemaVersion: 99 }))).toThrow(
      'Unsupported seed card schema.',
    );
  });
});
