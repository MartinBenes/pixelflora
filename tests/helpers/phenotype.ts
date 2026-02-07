import type { Phenotype } from '@/core/types';
import { createPhenotype } from '@/core/phenotype';

export function makePhenotype(overrides: Partial<Phenotype> = {}): Phenotype {
  return createPhenotype(overrides);
}
