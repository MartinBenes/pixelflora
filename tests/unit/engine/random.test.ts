import { describe, it, expect, vi } from 'vitest';
import { Random } from '@/engine/random';

describe('Random', () => {
  describe('determinism', () => {
    it('produces identical sequences for same seed', () => {
      const a = new Random('test-seed');
      const b = new Random('test-seed');
      for (let i = 0; i < 100; i++) {
        expect(a.next()).toBe(b.next());
      }
    });

    it('produces different sequences for different seeds', () => {
      const a = new Random('seed-a');
      const b = new Random('seed-b');
      const valuesA = Array.from({ length: 10 }, () => a.next());
      const valuesB = Array.from({ length: 10 }, () => b.next());
      expect(valuesA).not.toEqual(valuesB);
    });
  });

  describe('next()', () => {
    it('returns values in [0, 1)', () => {
      const rng = new Random('range-test');
      for (let i = 0; i < 1000; i++) {
        const val = rng.next();
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(1);
      }
    });
  });

  describe('range()', () => {
    it('returns integers within [min, max] inclusive', () => {
      const rng = new Random('range-test');
      for (let i = 0; i < 500; i++) {
        const val = rng.range(3, 7);
        expect(val).toBeGreaterThanOrEqual(3);
        expect(val).toBeLessThanOrEqual(7);
        expect(Number.isInteger(val)).toBe(true);
      }
    });

    it('covers the full range', () => {
      const rng = new Random('coverage');
      const seen = new Set<number>();
      for (let i = 0; i < 500; i++) {
        seen.add(rng.range(0, 3));
      }
      expect(seen).toEqual(new Set([0, 1, 2, 3]));
    });
  });

  describe('float()', () => {
    it('returns values within [min, max)', () => {
      const rng = new Random('float-test');
      for (let i = 0; i < 500; i++) {
        const val = rng.float(2.0, 5.0);
        expect(val).toBeGreaterThanOrEqual(2.0);
        expect(val).toBeLessThan(5.0);
      }
    });
  });

  describe('bool()', () => {
    it('returns roughly expected distribution', () => {
      const rng = new Random('bool-test');
      let trues = 0;
      const n = 10000;
      for (let i = 0; i < n; i++) {
        if (rng.bool(0.3)) trues++;
      }
      const ratio = trues / n;
      expect(ratio).toBeGreaterThan(0.25);
      expect(ratio).toBeLessThan(0.35);
    });
  });

  describe('pick()', () => {
    it('returns elements from the array', () => {
      const rng = new Random('pick-test');
      const items = ['a', 'b', 'c', 'd'];
      for (let i = 0; i < 100; i++) {
        expect(items).toContain(rng.pick(items));
      }
    });

    it('covers all elements eventually', () => {
      const rng = new Random('pick-coverage');
      const items = ['x', 'y', 'z'];
      const seen = new Set<string>();
      for (let i = 0; i < 200; i++) {
        seen.add(rng.pick(items));
      }
      expect(seen).toEqual(new Set(items));
    });

    it('throws when picking from an empty array', () => {
      const rng = new Random('pick-empty');
      expect(() => rng.pick([])).toThrow('Cannot pick from an empty array');
    });

    it('throws when computed pick index is out of bounds', () => {
      const rng = new Random('pick-index-out-of-bounds');
      const nextSpy = vi.spyOn(rng, 'next').mockReturnValue(1);
      expect(() => rng.pick(['x'])).toThrow('Cannot pick value from array');
      nextSpy.mockRestore();
    });
  });
});
