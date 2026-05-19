export interface ParsedSemver {
  major: number;
  minor: number;
  patch: number;
  prerelease: string;
  build: string;
  raw: string;
}

const SEMVER_REGEX
  = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export function parseSemver(version: string): ParsedSemver {
  const v = version.trim().replace(/^v/, '');
  const match = SEMVER_REGEX.exec(v);
  if (!match) {
    throw new Error(`Invalid semver: "${version}"`);
  }
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ?? '',
    build: match[5] ?? '',
    raw: version.trim(),
  };
}

function comparePrerelease(a: string, b: string): number {
  // No prerelease > has prerelease (1.0.0 > 1.0.0-alpha)
  if (!a && !b) return 0;
  if (!a && b) return 1;
  if (a && !b) return -1;

  const aParts = a.split('.');
  const bParts = b.split('.');
  const len = Math.max(aParts.length, bParts.length);

  for (let i = 0; i < len; i++) {
    const aPart = aParts[i];
    const bPart = bParts[i];

    if (aPart === undefined) return -1;
    if (bPart === undefined) return 1;

    const aNum = /^\d+$/.test(aPart) ? Number(aPart) : null;
    const bNum = /^\d+$/.test(bPart) ? Number(bPart) : null;

    if (aNum !== null && bNum !== null) {
      if (aNum < bNum) return -1;
      if (aNum > bNum) return 1;
    }
    else if (aNum !== null) {
      return -1; // numeric < string
    }
    else if (bNum !== null) {
      return 1;
    }
    else {
      if (aPart < bPart) return -1;
      if (aPart > bPart) return 1;
    }
  }
  return 0;
}

export function compareSemver(a: string, b: string): -1 | 0 | 1 {
  const pa = parseSemver(a);
  const pb = parseSemver(b);

  if (pa.major !== pb.major) return pa.major < pb.major ? -1 : 1;
  if (pa.minor !== pb.minor) return pa.minor < pb.minor ? -1 : 1;
  if (pa.patch !== pb.patch) return pa.patch < pb.patch ? -1 : 1;

  const preResult = comparePrerelease(pa.prerelease, pb.prerelease);
  if (preResult !== 0) return preResult as -1 | 1;
  return 0;
}

export function satisfiesRange(version: string, range: string): boolean {
  const trimmedRange = range.trim();

  // Handle comma/space-separated AND conditions
  // e.g. ">=1.0.0 <2.0.0"
  const andParts = trimmedRange.split(/\s+(?=[><=^~])/).filter(Boolean);
  if (andParts.length > 1) {
    return andParts.every(part => satisfiesRange(version, part));
  }

  // Caret range: ^1.2.3 means >=1.2.3 <2.0.0
  const caretMatch = /^\^(.+)$/.exec(trimmedRange);
  if (caretMatch) {
    const base = parseSemver(caretMatch[1]);
    const lower = `${base.major}.${base.minor}.${base.patch}${base.prerelease ? `-${base.prerelease}` : ''}`;
    let upper: string;
    if (base.major > 0) {
      upper = `${base.major + 1}.0.0`;
    }
    else if (base.minor > 0) {
      upper = `0.${base.minor + 1}.0`;
    }
    else {
      upper = `0.0.${base.patch + 1}`;
    }
    return compareSemver(version, lower) >= 0 && compareSemver(version, upper) < 0;
  }

  // Tilde range: ~1.2.3 means >=1.2.3 <1.3.0
  const tildeMatch = /^~(.+)$/.exec(trimmedRange);
  if (tildeMatch) {
    const base = parseSemver(tildeMatch[1]);
    const lower = `${base.major}.${base.minor}.${base.patch}${base.prerelease ? `-${base.prerelease}` : ''}`;
    const upper = `${base.major}.${base.minor + 1}.0`;
    return compareSemver(version, lower) >= 0 && compareSemver(version, upper) < 0;
  }

  // Comparison operators
  const opMatch = /^(>=|<=|>|<|=|!=)(.+)$/.exec(trimmedRange);
  if (opMatch) {
    const [, op, v] = opMatch;
    const cmp = compareSemver(version, v);
    switch (op) {
      case '>=': return cmp >= 0;
      case '<=': return cmp <= 0;
      case '>': return cmp > 0;
      case '<': return cmp < 0;
      case '=': return cmp === 0;
      case '!=': return cmp !== 0;
    }
  }

  // Exact match (no operator)
  try {
    return compareSemver(version, trimmedRange) === 0;
  }
  catch {
    return false;
  }
}
