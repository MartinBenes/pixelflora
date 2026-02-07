export type StemShape = 'straight' | 'vine';
export type StemThickness = 'thin' | 'thick';
export type StemTexture = 'smooth' | 'hairy';
export type LeafShape = 'narrow' | 'wide';
export type LeafSize = 'small' | 'medium' | 'large';
export type LeafEdge = 'smooth' | 'serrated';
export type FoliageColor = 'green' | 'teal' | 'autumn' | 'dark';
export type FlowerColor = 'red' | 'blue' | 'purple' | 'white' | 'yellow';
export type FlowerShape = 'round' | 'pointy' | 'tulip' | 'bell' | 'daisy';
export type FlowerSize = 'small' | 'medium' | 'large';
export type FlowerPattern = 'plain' | 'stripes' | 'dots';
export type FlowerSex = 'hermaphrodite' | 'female' | 'male';
export type FruitShape = 'round' | 'oval';
export type BgMode = 'transparent' | 'white' | 'dark';

export interface Phenotype {
  stem: StemShape;
  stemThickness: StemThickness;
  stemTexture: StemTexture;
  leaf: LeafShape;
  leafSize: LeafSize;
  leafEdge: LeafEdge;
  foliageColor: FoliageColor;
  flowerColor: FlowerColor;
  flowerColorSecondary: FlowerColor;
  flowerShape: FlowerShape;
  flowerSize: FlowerSize;
  flowerPattern: FlowerPattern;
  sex: FlowerSex;
  fruitShape: FruitShape;
  thorns: boolean;
  fruit: boolean;
  glow: boolean;
}

export interface StemNode {
  x: number;
  y: number;
  angle: number;
  halfWidth: number;
}

export interface PlantData {
  stemNodes: StemNode[];
  topX: number;
  topY: number;
}

export interface ColorPalette {
  highlight: string;
  light: string;
  main: string;
  dark: string;
  shadow?: string;
}

export interface PotPalette {
  highlight: string;
  light: string;
  main: string;
  dark: string;
  shadow: string;
  rim: string;
  soil: string;
  soilLight: string;
  soilDark: string;
}

export interface ThornPalette {
  highlight: string;
  main: string;
  dark: string;
}

export interface StamenPalette {
  stem: string;
  tip: string;
  tipLight: string;
}

export interface GlowPalette {
  bright: string;
  mid: string;
  dim: string;
}

export interface SepalPalette {
  highlight: string;
  light: string;
  main: string;
  dark: string;
}

export interface Palettes {
  foliage: Record<FoliageColor, ColorPalette>;
  pot: PotPalette;
  thorns: ThornPalette;
  fruits: ColorPalette[];
  flowers: Record<FlowerColor, ColorPalette>;
  stamens: StamenPalette;
  sepals: SepalPalette;
  glow: GlowPalette;
}

export interface AppConfiguration {
  phenotype: Phenotype;
  seed: string;
  animate: boolean;
  bgMode: BgMode;
}

export interface ShadedEllipseOptions {
  isSerrated?: boolean;
  pattern?: FlowerPattern;
  patternColor?: string | null;
  outline?: boolean;
}

export interface ShadedRhombusOptions {
  pattern?: FlowerPattern;
  patternColor?: string | null;
}

export interface LightDirection {
  x: number;
  y: number;
}

export type CanvasContext = CanvasRenderingContext2D;
export type CanvasLike = HTMLCanvasElement | { getContext(type: '2d'): CanvasContext | null };
