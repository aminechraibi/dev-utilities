export interface UuidInspectResult {
  version: number | null;
  variant: string;
  info: Record<string, string>;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getVariant(byte: number): string {
  if ((byte & 0x80) === 0x00) return 'NCS backward compatibility (0xx)';
  if ((byte & 0xc0) === 0x80) return 'RFC 4122 / DCE 1.1 (10x)';
  if ((byte & 0xe0) === 0xc0) return 'Microsoft backward compatibility (110)';
  return 'Reserved (111)';
}

function getVersion(hex: string): number | null {
  // version nibble is the first character of the 3rd group (index 14 in clean hex)
  const clean = hex.replace(/-/g, '');
  const versionNibble = Number.parseInt(clean[12], 16);
  if (versionNibble >= 1 && versionNibble <= 8) return versionNibble;
  return null;
}

function decodeV1Timestamp(hex: string): string {
  // UUID v1 timestamp: 60-bit value, 100-nanosecond intervals since Oct 15, 1582
  // Layout: time_low (32 bits) - time_mid (16 bits) - time_hi_and_version (16 bits)
  const clean = hex.replace(/-/g, '');
  const timeLow = clean.slice(0, 8);
  const timeMid = clean.slice(8, 12);
  const timeHiAndVersion = clean.slice(12, 16);

  // Strip version nibble from timeHi
  const timeHi = (Number.parseInt(timeHiAndVersion, 16) & 0x0fff).toString(16).padStart(3, '0');
  const fullTimestamp = timeHi + timeMid + timeLow;
  const intervalsBig = BigInt(`0x${fullTimestamp}`);

  // Gregorian epoch offset: Oct 15, 1582 to Jan 1, 1970 in 100ns intervals
  const gregorianEpochOffset = BigInt('122192928000000000');
  const unixHundredNanos = intervalsBig - gregorianEpochOffset;
  const unixMs = unixHundredNanos / BigInt(10000);

  return new Date(Number(unixMs)).toUTCString();
}

function decodeV7Timestamp(hex: string): string {
  // UUID v7: first 48 bits are Unix timestamp in milliseconds
  const clean = hex.replace(/-/g, '');
  const msBits = clean.slice(0, 12);
  const ms = Number.parseInt(msBits, 16);
  return new Date(ms).toUTCString();
}

export function inspectUuid(uuid: string): UuidInspectResult {
  if (!UUID_REGEX.test(uuid)) {
    throw new Error('Invalid UUID format');
  }

  const clean = uuid.toLowerCase().replace(/-/g, '');
  const version = getVersion(uuid);
  const variantByte = Number.parseInt(clean[16], 16) * 16 + Number.parseInt(clean[17], 16);
  const variant = getVariant(variantByte);

  const info: Record<string, string> = {
    'Raw UUID': uuid.toLowerCase(),
    'Version': version !== null ? String(version) : 'Unknown',
    'Variant': variant,
  };

  if (version === 1) {
    try {
      const timestamp = decodeV1Timestamp(uuid);
      info['Timestamp'] = timestamp;
    }
    catch {
      info['Timestamp'] = 'Could not decode';
    }

    // Clock sequence: bits 62-79 excluding variant bits
    const clockSeqHi = Number.parseInt(clean[16], 16) & 0x3f;
    const clockSeqLow = Number.parseInt(clean[17], 16) * 16 + Number.parseInt(clean[18], 16);
    // Actually clock seq is 14 bits: clkseq_hi_res (6 bits) | clkseq_low (8 bits)
    const clockSeqHiRes = (variantByte & 0x3f) >> 0;
    const clockSeqLowByte = Number.parseInt(clean[18], 16) * 16 + Number.parseInt(clean[19], 16);
    const clockSeq = ((variantByte & 0x3f) << 8) | clockSeqLowByte;
    info['Clock Sequence'] = String(clockSeq);

    // Node: last 6 bytes (12 hex chars)
    const node = clean.slice(20).match(/.{2}/g)?.join(':').toUpperCase() ?? clean.slice(20);
    info['Node (MAC-like)'] = node;

    const isMulticast = (Number.parseInt(clean[20], 16) & 0x01) === 1;
    info['Node Type'] = isMulticast ? 'Random/Multicast' : 'Unicast (real MAC)';
  }
  else if (version === 4) {
    info['Generation'] = 'Random';
    info['Random bits'] = '122 bits of randomness';
  }
  else if (version === 7) {
    try {
      const timestamp = decodeV7Timestamp(uuid);
      info['Timestamp (Unix ms)'] = timestamp;
      const ms = Number.parseInt(clean.slice(0, 12), 16);
      info['Unix Milliseconds'] = String(ms);
    }
    catch {
      info['Timestamp'] = 'Could not decode';
    }
    info['Random bits'] = '74 bits of randomness';
  }
  else if (version === 3) {
    info['Hashing'] = 'MD5 of namespace + name';
  }
  else if (version === 5) {
    info['Hashing'] = 'SHA-1 of namespace + name';
  }

  return { version, variant, info };
}
