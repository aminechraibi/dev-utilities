export function evaluateJsonPath(jsonStr: string, path: string): unknown[] {
  const obj = JSON.parse(jsonStr);
  if (!path.startsWith('$')) {
    throw new Error('Path must start with $');
  }
  return queryPath(obj, path.slice(1));
}

function queryPath(obj: unknown, path: string): unknown[] {
  if (path === '' || path === '.') {
    return [obj];
  }

  // Recursive descent ..key
  if (path.startsWith('..')) {
    const rest = path.slice(2);
    const key = rest.match(/^([^.[]*)/)?.[1] ?? '';
    const results: unknown[] = [];
    collectRecursive(obj, key, results);
    if (key && rest.length > key.length) {
      return results.flatMap(r => queryPath(r, rest.slice(key.length)));
    }
    return results;
  }

  // Child .key or ['key'] or [n] or [*]
  const dotMatch = path.match(/^\.([^.[*\]]+)(.*)/s);
  if (dotMatch) {
    const [, key, rest] = dotMatch;
    const val = (obj as Record<string, unknown>)?.[key];
    return val !== undefined ? queryPath(val, rest) : [];
  }

  const bracketMatch = path.match(/^\[([^\]]*)\](.*)/s);
  if (bracketMatch) {
    const [, expr, rest] = bracketMatch;
    if (expr === '*') {
      const items = Array.isArray(obj) ? obj : Object.values(obj as object);
      return items.flatMap(item => queryPath(item, rest));
    }
    const idx = Number.parseInt(expr);
    if (!Number.isNaN(idx)) {
      const arr = obj as unknown[];
      const item = arr[idx < 0 ? arr.length + idx : idx];
      return item !== undefined
        ? queryPath(item, rest)
        : [];
    }
    // String key in brackets
    const strKey = expr.replace(/^['"]|['"]$/g, '');
    const val = (obj as Record<string, unknown>)?.[strKey];
    return val !== undefined ? queryPath(val, rest) : [];
  }

  return [];
}

function collectRecursive(obj: unknown, key: string, results: unknown[]) {
  if (typeof obj !== 'object' || obj === null) {
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach(item => collectRecursive(item, key, results));
  }
  else {
    const o = obj as Record<string, unknown>;
    if (!key || key in o) {
      results.push(key ? o[key] : obj);
    }
    Object.values(o).forEach(v => collectRecursive(v, key, results));
  }
}
