import { describe, expect, it } from 'vitest';
import { getRequiredContext2D } from '@/utils/canvas';

describe('getRequiredContext2D', () => {
  it('returns context when available', () => {
    const context = {} as CanvasRenderingContext2D;
    const canvas = {
      getContext: () => context,
    };

    expect(getRequiredContext2D(canvas as any)).toBe(context);
  });

  it('throws when 2D context is unavailable', () => {
    const canvas = {
      getContext: () => null,
    };

    expect(() => getRequiredContext2D(canvas as any)).toThrow(
      'Unable to acquire 2D canvas context.',
    );
  });
});
