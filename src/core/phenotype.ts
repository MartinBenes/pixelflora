import type {
  BgMode,
  FlowerColor,
  FlowerPattern,
  FlowerSex,
  FlowerShape,
  FlowerSize,
  FoliageColor,
  FruitShape,
  LeafEdge,
  LeafShape,
  LeafSize,
  Phenotype,
  StemShape,
  StemTexture,
  StemThickness,
} from './types';

export const STEM_SHAPES = ['straight', 'vine'] as const satisfies readonly StemShape[];
export const STEM_THICKNESSES = ['thin', 'thick'] as const satisfies readonly StemThickness[];
export const STEM_TEXTURES = ['smooth', 'hairy'] as const satisfies readonly StemTexture[];
export const LEAF_SHAPES = ['narrow', 'wide'] as const satisfies readonly LeafShape[];
export const LEAF_SIZES = ['small', 'medium', 'large'] as const satisfies readonly LeafSize[];
export const LEAF_EDGES = ['smooth', 'serrated'] as const satisfies readonly LeafEdge[];
export const FOLIAGE_COLORS = [
  'green',
  'teal',
  'autumn',
  'dark',
] as const satisfies readonly FoliageColor[];
export const FLOWER_COLORS = [
  'red',
  'blue',
  'purple',
  'white',
  'yellow',
] as const satisfies readonly FlowerColor[];
export const FLOWER_SHAPES = [
  'round',
  'pointy',
  'tulip',
  'bell',
  'daisy',
] as const satisfies readonly FlowerShape[];
export const FLOWER_SIZES = ['small', 'medium', 'large'] as const satisfies readonly FlowerSize[];
export const FLOWER_PATTERNS = [
  'plain',
  'stripes',
  'dots',
] as const satisfies readonly FlowerPattern[];
export const FLOWER_SEXES = [
  'hermaphrodite',
  'female',
  'male',
] as const satisfies readonly FlowerSex[];
export const FRUIT_SHAPES = ['round', 'oval'] as const satisfies readonly FruitShape[];
export const BG_MODES = ['transparent', 'white', 'dark'] as const satisfies readonly BgMode[];

export const DEFAULT_PHENOTYPE: Phenotype = {
  stem: 'straight',
  stemThickness: 'thin',
  stemTexture: 'smooth',
  leaf: 'narrow',
  leafSize: 'medium',
  leafEdge: 'smooth',
  foliageColor: 'green',
  flowerColor: 'red',
  flowerColorSecondary: 'blue',
  flowerShape: 'round',
  flowerSize: 'medium',
  flowerPattern: 'plain',
  sex: 'hermaphrodite',
  fruitShape: 'round',
  thorns: false,
  fruit: false,
  glow: false,
};

export function createPhenotype(overrides: Partial<Phenotype> = {}): Phenotype {
  return { ...DEFAULT_PHENOTYPE, ...overrides };
}
