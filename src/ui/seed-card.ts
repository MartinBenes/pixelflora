import { parseConfiguration } from '@/core/configuration';
import type { AppConfiguration } from '@/core/types';

export const SEED_CARD_SCHEMA_VERSION = 1 as const;

interface SeedCardV1 {
  schemaVersion: typeof SEED_CARD_SCHEMA_VERSION;
  config: AppConfiguration;
}

type SeedCardRecord = Record<string, unknown>;

function toRecord(value: unknown): SeedCardRecord | null {
  return typeof value === 'object' && value !== null ? (value as SeedCardRecord) : null;
}

function parseSeedCardPayload(payload: unknown): AppConfiguration {
  const record = toRecord(payload);
  if (!record) {
    throw new Error('Seed card payload must be an object.');
  }

  if (record.schemaVersion === SEED_CARD_SCHEMA_VERSION) {
    return parseConfiguration(record.config);
  }

  // Legacy v0 format: AppConfiguration object without schemaVersion.
  if ('phenotype' in record) {
    return parseConfiguration(record);
  }

  throw new Error('Unsupported seed card schema.');
}

export function serializeSeedCard(config: AppConfiguration): string {
  const payload: SeedCardV1 = {
    schemaVersion: SEED_CARD_SCHEMA_VERSION,
    config: parseConfiguration(config),
  };

  return JSON.stringify(payload);
}

export function deserializeSeedCard(serialized: string): AppConfiguration {
  let payload: unknown;
  try {
    payload = JSON.parse(serialized);
  } catch {
    throw new Error('Invalid seed card JSON.');
  }

  return parseSeedCardPayload(payload);
}
