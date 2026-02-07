import { describe, it, expect } from 'vitest';
import { blendHex, shadeColor } from '@/engine/shading';

describe('blendHex', () => {
  it('returns base when t=0', () => {
    expect(blendHex('#ff0000', '#0000ff', 0)).toBe('#ff0000');
  });

  it('returns overlay when t=1', () => {
    expect(blendHex('#ff0000', '#0000ff', 1)).toBe('#0000ff');
  });

  it('blends midpoint correctly', () => {
    const result = blendHex('#ff0000', '#0000ff', 0.5);
    // Red: 255->0 at 0.5 = 128, Blue: 0->255 at 0.5 = 128
    expect(result).toBe('#800080');
  });

  it('handles black and white', () => {
    expect(blendHex('#000000', '#ffffff', 0.5)).toBe('#808080');
  });

  it('produces valid hex strings', () => {
    const result = blendHex('#123456', '#abcdef', 0.3);
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe('shadeColor', () => {
  const palette = {
    highlight: '#ffffff',
    light: '#cccccc',
    main: '#888888',
    dark: '#444444',
    shadow: '#000000',
  };

  it('returns blend toward light for high dot + dither true', () => {
    const result = shadeColor(0.7, true, palette);
    // Should be blendHex(main, light, 0.35)
    expect(result).toBe(blendHex('#888888', '#cccccc', 0.35));
  });

  it('returns blend toward dark for low dot + dither true', () => {
    const result = shadeColor(-0.7, true, palette);
    expect(result).toBe(blendHex('#888888', '#444444', 0.35));
  });

  it('returns main color for neutral dot', () => {
    expect(shadeColor(0.0, true, palette)).toBe('#888888');
    expect(shadeColor(0.3, true, palette)).toBe('#888888');
    expect(shadeColor(-0.3, true, palette)).toBe('#888888');
  });

  it('returns main color when dither is false even with extreme dot', () => {
    expect(shadeColor(0.9, false, palette)).toBe('#888888');
    expect(shadeColor(-0.9, false, palette)).toBe('#888888');
  });
});
