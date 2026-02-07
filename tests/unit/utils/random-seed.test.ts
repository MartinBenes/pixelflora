import { afterEach, describe, expect, it } from 'vitest';
import { generateSecureSeed } from '@/utils/random-seed';

const originalCryptoDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto');

afterEach(() => {
  if (originalCryptoDescriptor) {
    Object.defineProperty(globalThis, 'crypto', originalCryptoDescriptor);
  }
});

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

  it('falls back when crypto is unavailable', () => {
    Object.defineProperty(globalThis, 'crypto', {
      value: undefined,
      configurable: true,
      writable: true,
    });

    const seed = generateSecureSeed(10);
    expect(seed).toHaveLength(10);
    expect(seed).toMatch(/^[a-z0-9]+$/);
  });

  it('uses default length when an invalid length is provided', () => {
    const seed = generateSecureSeed(0);
    expect(seed).toHaveLength(12);
  });
});
