import { describe, it, expect, beforeEach } from 'vitest';
import { createMockCanvas, MockCanvasRenderingContext2D } from '../../setup';
import { drawPixel, drawLine, drawCircle } from '@/engine/drawing-primitives';

describe('drawing primitives', () => {
  let ctx: MockCanvasRenderingContext2D;

  beforeEach(() => {
    const canvas = createMockCanvas();
    ctx = canvas.getContext('2d') as unknown as MockCanvasRenderingContext2D;
  });

  describe('drawPixel', () => {
    it('draws a single pixel at the given coordinates', () => {
      drawPixel(ctx as any, 10, 20, '#ff0000');
      expect(ctx.getPixel(10, 20)).toBe('#ff0000');
    });

    it('rounds fractional coordinates', () => {
      drawPixel(ctx as any, 10.7, 20.3, '#00ff00');
      expect(ctx.getPixel(11, 20)).toBe('#00ff00');
    });
  });

  describe('drawLine', () => {
    it('draws a horizontal line', () => {
      drawLine(ctx as any, 5, 10, 10, 10, '#0000ff');
      for (let x = 5; x <= 10; x++) {
        expect(ctx.getPixel(x, 10)).toBe('#0000ff');
      }
    });

    it('draws a vertical line', () => {
      drawLine(ctx as any, 10, 5, 10, 10, '#ff0000');
      for (let y = 5; y <= 10; y++) {
        expect(ctx.getPixel(10, y)).toBe('#ff0000');
      }
    });

    it('draws a single point when start equals end', () => {
      drawLine(ctx as any, 5, 5, 5, 5, '#aabbcc');
      expect(ctx.getPixel(5, 5)).toBe('#aabbcc');
      expect(ctx.getPixelCount()).toBe(1);
    });
  });

  describe('drawCircle', () => {
    it('draws a filled circle', () => {
      drawCircle(ctx as any, 50, 50, 3, '#ff0000');
      // Center should be filled
      expect(ctx.getPixel(50, 50)).toBe('#ff0000');
      // Points on axes at radius
      expect(ctx.getPixel(53, 50)).toBe('#ff0000');
      expect(ctx.getPixel(47, 50)).toBe('#ff0000');
      // Points outside radius should be empty
      expect(ctx.getPixel(54, 50)).toBeUndefined();
    });

    it('handles radius 0 as a single pixel', () => {
      drawCircle(ctx as any, 10, 10, 0, '#abcdef');
      expect(ctx.getPixel(10, 10)).toBe('#abcdef');
      expect(ctx.getPixelCount()).toBe(1);
    });
  });
});
