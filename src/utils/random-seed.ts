const SEED_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const DEFAULT_RANDOM_SEED_LENGTH = 12;

function fallbackSeed(): string {
  const timestamp = Date.now().toString(36);
  const perfNow =
    typeof performance !== 'undefined' && typeof performance.now === 'function'
      ? Math.floor(performance.now()).toString(36)
      : '0';

  return `${timestamp}${perfNow}`;
}

export function generateSecureSeed(length = DEFAULT_RANDOM_SEED_LENGTH): string {
  const normalizedLength =
    Number.isInteger(length) && length > 0 ? length : DEFAULT_RANDOM_SEED_LENGTH;

  if (typeof crypto === 'undefined' || typeof crypto.getRandomValues !== 'function') {
    return fallbackSeed().slice(0, normalizedLength);
  }

  const bytes = new Uint8Array(normalizedLength);
  crypto.getRandomValues(bytes);

  let output = '';
  for (const byte of bytes) {
    output += SEED_ALPHABET[byte % SEED_ALPHABET.length];
  }

  return output;
}
