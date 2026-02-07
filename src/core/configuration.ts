import {
  BG_MODES,
  DEFAULT_PHENOTYPE,
  FOLIAGE_COLORS,
  FLOWER_COLORS,
  FLOWER_PATTERNS,
  FLOWER_SEXES,
  FLOWER_SHAPES,
  FLOWER_SIZES,
  FRUIT_SHAPES,
  LEAF_EDGES,
  LEAF_SHAPES,
  LEAF_SIZES,
  STEM_SHAPES,
  STEM_TEXTURES,
  STEM_THICKNESSES,
} from './phenotype';
import type { AppConfiguration, Phenotype } from './types';

const SEED_ALLOWED_CHARS = /[A-Za-z0-9_-]/;
export const DEFAULT_SEED = 'rostlina1';
export const MAX_SEED_LENGTH = 64;

type StringRecord = Record<string, unknown>;

function toRecord(value: unknown): StringRecord | null {
  return typeof value === 'object' && value !== null ? (value as StringRecord) : null;
}

function parseEnumValue<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
  fallback: T,
): T {
  return typeof value === 'string' && (allowedValues as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

function parseBooleanValue(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    if (value === 'true') return true;
    if (value === 'false') return false;
  }

  return fallback;
}

export function sanitizeSeed(value: unknown, fallback = DEFAULT_SEED): string {
  const raw = typeof value === 'string' ? value : '';
  const trimmed = raw.trim();

  if (trimmed.length === 0) {
    return fallback;
  }

  let normalized = '';
  for (const char of trimmed) {
    if (!SEED_ALLOWED_CHARS.test(char)) {
      continue;
    }

    normalized += char;
    if (normalized.length >= MAX_SEED_LENGTH) {
      break;
    }
  }

  return normalized.length > 0 ? normalized : fallback;
}

function parsePhenotype(rawPhenotype: unknown): Phenotype {
  const source = toRecord(rawPhenotype) ?? {};

  return {
    stem: parseEnumValue(source.stem, STEM_SHAPES, DEFAULT_PHENOTYPE.stem),
    stemThickness: parseEnumValue(
      source.stemThickness,
      STEM_THICKNESSES,
      DEFAULT_PHENOTYPE.stemThickness,
    ),
    stemTexture: parseEnumValue(source.stemTexture, STEM_TEXTURES, DEFAULT_PHENOTYPE.stemTexture),
    leaf: parseEnumValue(source.leaf, LEAF_SHAPES, DEFAULT_PHENOTYPE.leaf),
    leafSize: parseEnumValue(source.leafSize, LEAF_SIZES, DEFAULT_PHENOTYPE.leafSize),
    leafEdge: parseEnumValue(source.leafEdge, LEAF_EDGES, DEFAULT_PHENOTYPE.leafEdge),
    foliageColor: parseEnumValue(
      source.foliageColor,
      FOLIAGE_COLORS,
      DEFAULT_PHENOTYPE.foliageColor,
    ),
    flowerColor: parseEnumValue(source.flowerColor, FLOWER_COLORS, DEFAULT_PHENOTYPE.flowerColor),
    flowerColorSecondary: parseEnumValue(
      source.flowerColorSecondary,
      FLOWER_COLORS,
      DEFAULT_PHENOTYPE.flowerColorSecondary,
    ),
    flowerShape: parseEnumValue(source.flowerShape, FLOWER_SHAPES, DEFAULT_PHENOTYPE.flowerShape),
    flowerSize: parseEnumValue(source.flowerSize, FLOWER_SIZES, DEFAULT_PHENOTYPE.flowerSize),
    flowerPattern: parseEnumValue(
      source.flowerPattern,
      FLOWER_PATTERNS,
      DEFAULT_PHENOTYPE.flowerPattern,
    ),
    sex: parseEnumValue(source.sex, FLOWER_SEXES, DEFAULT_PHENOTYPE.sex),
    fruitShape: parseEnumValue(source.fruitShape, FRUIT_SHAPES, DEFAULT_PHENOTYPE.fruitShape),
    thorns: parseBooleanValue(source.thorns, DEFAULT_PHENOTYPE.thorns),
    fruit: parseBooleanValue(source.fruit, DEFAULT_PHENOTYPE.fruit),
    glow: parseBooleanValue(source.glow, DEFAULT_PHENOTYPE.glow),
  };
}

export function parseConfiguration(rawConfiguration: unknown): AppConfiguration {
  const source = toRecord(rawConfiguration) ?? {};

  return {
    phenotype: parsePhenotype(source.phenotype),
    seed: sanitizeSeed(source.seed),
    animate: parseBooleanValue(source.animate, false),
    bgMode: parseEnumValue(source.bgMode, BG_MODES, BG_MODES[0]),
  };
}
