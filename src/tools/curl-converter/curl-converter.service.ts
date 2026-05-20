export interface ParsedCurl {
  url: string
  method: string
  headers: Record<string, string>
  body: string | null
}

function tokenize(cmd: string): string[] {
  // Normalize: Unix `\<newline>`, Windows cmd `^<newline>`, PowerShell backtick `` `<newline> ``
  const cleaned = cmd
    .replace(/\\\r?\n[ \t]*/g, ' ')
    .replace(/\^\r?\n[ \t]*/g, ' ')
    .replace(/`\r?\n[ \t]*/g, ' ')
    .trim();
  const tokens: string[] = [];
  let i = 0;
  while (i < cleaned.length) {
    while (i < cleaned.length && /\s/.test(cleaned[i]!)) {
      i++;
    }
    if (i >= cleaned.length) {
      break;
    }
    if (cleaned[i] === '"') {
      let s = '';
      i++;
      while (i < cleaned.length && cleaned[i] !== '"') {
        if (cleaned[i] === '\\') {
          i++;
          s += cleaned[i] ?? '';
        }
        else {
          s += cleaned[i];
        }
        i++;
      }
      i++;
      tokens.push(s);
    }
    else if (cleaned[i] === '\'') {
      let s = '';
      i++;
      while (i < cleaned.length && cleaned[i] !== '\'') {
        s += cleaned[i];
        i++;
      }
      i++;
      tokens.push(s);
    }
    else {
      let s = '';
      while (i < cleaned.length && !/\s/.test(cleaned[i]!)) {
        s += cleaned[i];
        i++;
      }
      tokens.push(s);
    }
  }
  return tokens;
}

export function parseCurl(cmd: string): ParsedCurl {
  const tokens = tokenize(cmd.trim());
  let i = /^curl(\.exe)?$/i.test(tokens[0] ?? '') ? 1 : 0;

  let url = '';
  let method = 'GET';
  const headers: Record<string, string> = {};
  let body: string | null = null;
  let username = '';
  let password = '';

  while (i < tokens.length) {
    const tok = tokens[i]!;
    if (tok === '-X' || tok === '--request') {
      method = tokens[++i] ?? method;
    }
    else if (tok === '-H' || tok === '--header') {
      const h = tokens[++i] ?? '';
      const sep = h.indexOf(':');
      if (sep !== -1) {
        headers[h.slice(0, sep).trim()] = h.slice(sep + 1).trim();
      }
    }
    else if (['-d', '--data', '--data-raw', '--data-binary', '--data-urlencode'].includes(tok)) {
      body = tokens[++i] ?? null;
      if (method === 'GET') {
        method = 'POST';
      }
    }
    else if (tok === '-u' || tok === '--user') {
      const creds = tokens[++i] ?? '';
      const sep = creds.indexOf(':');
      username = sep !== -1 ? creds.slice(0, sep) : creds;
      password = sep !== -1 ? creds.slice(sep + 1) : '';
    }
    else if (tok === '--url') {
      url = tokens[++i] ?? '';
    }
    else if (!tok.startsWith('-') && !url) {
      url = tok;
    }
    i++;
  }

  if (username) {
    headers.Authorization = `Basic ${btoa(`${username}:${password}`)}`;
  }

  return { url, method, headers, body };
}

function hLines(headers: Record<string, string>, indent: string): string {
  return Object.entries(headers).map(([k, v]) => `${indent}'${k}': '${v}'`).join(',\n');
}

export function toFetch(p: ParsedCurl): string {
  const parts: string[] = [];
  if (p.method !== 'GET') {
    parts.push(`  method: '${p.method}'`);
  }
  const hs = hLines(p.headers, '    ');
  if (hs) {
    parts.push(`  headers: {\n${hs}\n  }`);
  }
  if (p.body != null) {
    parts.push(`  body: ${JSON.stringify(p.body)}`);
  }
  const opts = parts.length ? `, {\n${parts.join(',\n')}\n}` : '';
  return `const response = await fetch(${JSON.stringify(p.url)}${opts});\nconst data = await response.json();`;
}

export function toAxios(p: ParsedCurl): string {
  const method = p.method.toLowerCase();
  const url = JSON.stringify(p.url);
  const _hEntries = Object.entries(p.headers);
  const hStr = hLines(p.headers, '    ');
  const headersPart = hStr ? `  headers: {\n${hStr}\n  }` : '';

  let bodyVal = '';
  if (p.body != null) {
    try {
      JSON.parse(p.body);
      bodyVal = p.body;
    }
    catch {
      bodyVal = JSON.stringify(p.body);
    }
  }

  if (['get', 'delete', 'head', 'options'].includes(method)) {
    const cfg = headersPart ? `, { ${headersPart} }` : '';
    return `const { data } = await axios.${method}(${url}${cfg});`;
  }

  const cfgParts = headersPart ? [`\n${headersPart}\n`] : [];
  const cfg = cfgParts.length ? `, {${cfgParts.join(',')}}` : '';
  return `const { data } = await axios.${method}(${url}, ${bodyVal || 'null'}${cfg});`;
}

export function toPython(p: ParsedCurl): string {
  const lines = ['import requests', ''];
  const entries = Object.entries(p.headers);
  if (entries.length) {
    lines.push('headers = {');
    for (const [k, v] of entries) {
      lines.push(`    '${k}': '${v}',`);
    }
    lines.push('}', '');
  }
  const method = p.method.toLowerCase();
  const args: string[] = [JSON.stringify(p.url)];
  if (entries.length) {
    args.push('headers=headers');
  }
  if (p.body != null) {
    try {
      JSON.parse(p.body);
      lines.push(`json_data = ${p.body}`, '');
      args.push('json=json_data');
    }
    catch {
      lines.push(`data = ${JSON.stringify(p.body)}`, '');
      args.push('data=data');
    }
  }
  lines.push(`response = requests.${method}(${args.join(', ')})`, 'print(response.json())');
  return lines.join('\n');
}

export function toNodeFetch(p: ParsedCurl): string {
  const parts: string[] = [];
  if (p.method !== 'GET') {
    parts.push(`  method: '${p.method}'`);
  }
  const hs = hLines(p.headers, '    ');
  if (hs) {
    parts.push(`  headers: {\n${hs}\n  }`);
  }
  if (p.body != null) {
    parts.push(`  body: ${JSON.stringify(p.body)}`);
  }
  const opts = parts.length ? `, {\n${parts.join(',\n')}\n}` : '';
  return [
    '// Node 18+ built-in fetch',
    `const response = await fetch(${JSON.stringify(p.url)}${opts});`,
    'const data = await response.json();',
  ].join('\n');
}
