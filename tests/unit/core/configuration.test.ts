import { describe, expect, it } from 'vitest';
import { DEFAULT_PHENOTYPE } from '@/core/phenotype';
import {
  DEFAULT_SEED,
  MAX_SEED_LENGTH,
  parseConfiguration,
  sanitizeSeed,
} from '@/core/configuration';

describe('configuration parser', () => {
  it('keeps valid configuration values', () => {
    const config = parseConfiguration({
      phenotype: {
        stem: 'vine',
        stemTexture: 'hairy',
        leaf: 'wide',
        flowerShape: 'tulip',
        thorns: true,
      },
      seed: 'enterprise_seed-01',
      animate: true,
      bgMode: 'dark',
    });

    expect(config.phenotype.stem).toBe('vine');
    expect(config.phenotype.stemTexture).toBe('hairy');
    expect(config.phenotype.leaf).toBe('wide');
    expect(config.phenotype.flowerShape).toBe('tulip');
    expect(config.phenotype.thorns).toBe(true);
    expect(config.seed).toBe('enterprise_seed-01');
    expect(config.animate).toBe(true);
    expect(config.bgMode).toBe('dark');
  });

  it('sanitizes seeds by trimming, removing invalid chars and enforcing max length', () => {
    const rawSeed = `  @@abc DEF-01__${'x'.repeat(MAX_SEED_LENGTH)}  `;
    const sanitized = sanitizeSeed(rawSeed);

    expect(sanitized).toBe(`abcDEF-01__${'x'.repeat(MAX_SEED_LENGTH - 11)}`);
    expect(sanitized.length).toBe(MAX_SEED_LENGTH);
  });

  it('falls back to defaults when configuration payload is invalid', () => {
    const config = parseConfiguration({
      phenotype: {
        stem: 'invalid',
        stemThickness: null,
        thorns: 'true',
      },
      seed: '   ***   ',
      animate: 'false',
      bgMode: 'neon',
    });

    expect(config.phenotype.stem).toBe(DEFAULT_PHENOTYPE.stem);
    expect(config.phenotype.stemThickness).toBe(DEFAULT_PHENOTYPE.stemThickness);
    expect(config.phenotype.thorns).toBe(true);
    expect(config.seed).toBe(DEFAULT_SEED);
    expect(config.animate).toBe(false);
    expect(config.bgMode).toBe('transparent');
  });
});
