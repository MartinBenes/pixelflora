import { describe, expect, it } from 'vitest';
import { generateSecureSeed } from '@/utils/random-seed';

describe('generateSecureSeed', () => {
  it('generates alpha-numeric lowercase seed with default length', () => {
    const seed = generateSecureSeed();
    expect(seed).toMatch(/^[a-z0-9]+$/);
    expect(seed.length).toBe(12);
  });

  it('respects explicit seed length', () => {
    const seed = generateSecureSeed(24);
    expect(seed).toHaveLength(24);
  });
});
