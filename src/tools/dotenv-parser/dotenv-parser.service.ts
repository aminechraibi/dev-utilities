export interface DotenvEntry {
  key: string
  value: string
  type: 'string' | 'number' | 'boolean' | 'empty'
  line: number
}

function detectType(value: string): DotenvEntry['type'] {
  if (value === '') {
    return 'empty';
  }
  if (value === 'true' || value === 'false' || value === 'True' || value === 'False' || value === 'TRUE' || value === 'FALSE') {
    return 'boolean';
  }
  if (!Number.isNaN(Number(value)) && value.trim() !== '') {
    return 'number';
  }
  return 'string';
}

function unquote(value: string): string {
  // Double-quoted
  if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
    return value
      .slice(1, -1)
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }
  // Single-quoted
  if (value.startsWith('\'') && value.endsWith('\'') && value.length >= 2) {
    return value.slice(1, -1);
  }
  // Backtick-quoted
  if (value.startsWith('`') && value.endsWith('`') && value.length >= 2) {
    return value.slice(1, -1);
  }
  return value;
}

export function parseDotenv(content: string): DotenvEntry[] {
  if (!content.trim()) {
    return [];
  }

  const rawLines = content.split('\n');
  const entries: DotenvEntry[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const lineNum = i + 1;
    let line = rawLines[i];

    // Handle line continuation with backslash
    while (line.endsWith('\\') && i + 1 < rawLines.length) {
      line = line.slice(0, -1) + rawLines[i + 1].trimStart();
      i++;
    }

    i++;

    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Parse KEY=VALUE
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) {
      // No equals sign — treat as key with empty value (export KEY style)
      const key = trimmed.replace(/^export\s+/, '').trim();
      if (key && /^[\w.]+$/.test(key)) {
        entries.push({ key, value: '', type: 'empty', line: lineNum });
      }
      continue;
    }

    let key = trimmed.slice(0, eqIndex).trim();
    const rawValue = trimmed.slice(eqIndex + 1).trim();

    // Strip 'export' prefix
    key = key.replace(/^export\s+/, '').trim();

    if (!key) {
      continue;
    }

    const value = unquote(rawValue);
    const type = detectType(value);

    entries.push({ key, value, type, line: lineNum });
  }

  return entries;
}

export function findDuplicateKeys(entries: DotenvEntry[]): Set<string> {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const entry of entries) {
    if (seen.has(entry.key)) {
      duplicates.add(entry.key);
    }
    seen.add(entry.key);
  }
  return duplicates;
}

export function entriesToJson(entries: DotenvEntry[]): string {
  const obj: Record<string, string> = {};
  for (const entry of entries) {
    obj[entry.key] = entry.value;
  }
  return JSON.stringify(obj, null, 2);
}

export function entriesToShellExports(entries: DotenvEntry[]): string {
  return entries
    .map(e => `export ${e.key}="${e.value.replace(/"/g, '\\"')}"`)
    .join('\n');
}
