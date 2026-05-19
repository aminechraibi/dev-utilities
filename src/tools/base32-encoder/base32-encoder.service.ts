const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const BASE32HEX_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUV';

function encodeWithAlphabet(input: string, alphabet: string): string {
  const bytes = new TextEncoder().encode(input);
  let bits = 0;
  let value = 0;
  let output = '';

  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }

  // Pad to multiple of 8
  while (output.length % 8 !== 0) {
    output += '=';
  }

  return output;
}

function decodeWithAlphabet(input: string, alphabet: string): string {
  const cleanInput = input.toUpperCase().replace(/=+$/, '');
  const lookup: Record<string, number> = {};
  for (let i = 0; i < alphabet.length; i++) {
    lookup[alphabet[i]] = i;
  }

  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (const char of cleanInput) {
    if (!(char in lookup)) {
      throw new Error(`Invalid Base32 character: ${char}`);
    }
    value = (value << 5) | lookup[char];
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return new TextDecoder().decode(new Uint8Array(bytes));
}

export function encodeBase32(input: string): string {
  return encodeWithAlphabet(input, BASE32_ALPHABET);
}

export function decodeBase32(input: string): string {
  return decodeWithAlphabet(input, BASE32_ALPHABET);
}

export function encodeBase32Hex(input: string): string {
  return encodeWithAlphabet(input, BASE32HEX_ALPHABET);
}

export function decodeBase32Hex(input: string): string {
  return decodeWithAlphabet(input, BASE32HEX_ALPHABET);
}
