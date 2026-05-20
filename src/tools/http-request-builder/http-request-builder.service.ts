export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
export type BodyType = 'none' | 'json' | 'form' | 'text';

export interface KV { key: string; value: string; enabled: boolean }

export interface RequestConfig {
  method: HttpMethod
  url: string
  params: KV[]
  headers: KV[]
  bodyType: BodyType
  bodyJson: string
  bodyText: string
  bodyForm: KV[]
}

function activeKV(kvs: KV[]): [string, string][] {
  return kvs.filter(kv => kv.enabled && kv.key.trim()).map(kv => [kv.key, kv.value]);
}

export function buildUrl(url: string, params: KV[]): string {
  const active = activeKV(params);
  if (!active.length) {
    return url;
  }
  const qs = active.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
  return `${url}${url.includes('?') ? '&' : '?'}${qs}`;
}

function headersRecord(kvs: KV[]): Record<string, string> {
  return Object.fromEntries(activeKV(kvs));
}

function _hLines(kvs: KV[], indent: string): string {
  return activeKV(kvs).map(([k, v]) => `${indent}'${k}': '${v}'`).join(',\n');
}

function bodyValue(cfg: RequestConfig): string | null {
  if (cfg.bodyType === 'none') {
    return null;
  }
  if (cfg.bodyType === 'json') {
    return cfg.bodyJson.trim() || null;
  }
  if (cfg.bodyType === 'text') {
    return cfg.bodyText || null;
  }
  if (cfg.bodyType === 'form') {
    const pairs = activeKV(cfg.bodyForm);
    return pairs.length ? pairs.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&') : null;
  }
  return null;
}

export function toCurl(cfg: RequestConfig): string {
  const url = buildUrl(cfg.url, cfg.params);
  const lines: string[] = [`curl -X ${cfg.method} '${url}'`];

  const hEntries = activeKV(cfg.headers);
  for (const [k, v] of hEntries) {
    lines.push(`  -H '${k}: ${v}'`);
  }

  if (cfg.bodyType === 'json' && cfg.bodyJson.trim()) {
    lines.push('  -H \'Content-Type: application/json\'');
    lines.push(`  -d '${cfg.bodyJson.trim()}'`);
  }
  else if (cfg.bodyType === 'form') {
    const pairs = activeKV(cfg.bodyForm);
    for (const [k, v] of pairs) {
      lines.push(`  -F '${k}=${v}'`);
    }
  }
  else if (cfg.bodyType === 'text' && cfg.bodyText) {
    lines.push(`  -d '${cfg.bodyText}'`);
  }

  return lines.join(' \\\n');
}

export function toFetch(cfg: RequestConfig): string {
  const url = buildUrl(cfg.url, cfg.params);
  const parts: string[] = [];

  if (cfg.method !== 'GET') {
    parts.push(`  method: '${cfg.method}'`);
  }

  const allHeaders: Record<string, string> = { ...headersRecord(cfg.headers) };
  if (cfg.bodyType === 'json' && cfg.bodyJson.trim()) {
    allHeaders['Content-Type'] = 'application/json';
  }
  else if (cfg.bodyType === 'form') {
    allHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  const hEntries = Object.entries(allHeaders);
  if (hEntries.length) {
    const hs = hEntries.map(([k, v]) => `    '${k}': '${v}'`).join(',\n');
    parts.push(`  headers: {\n${hs}\n  }`);
  }

  const body = bodyValue(cfg);
  if (body != null) {
    parts.push(`  body: ${JSON.stringify(body)}`);
  }

  const opts = parts.length ? `, {\n${parts.join(',\n')}\n}` : '';
  return `const response = await fetch(${JSON.stringify(url)}${opts});\nconst data = await response.json();`;
}

export function toAxios(cfg: RequestConfig): string {
  const url = buildUrl(cfg.url, cfg.params);
  const method = cfg.method.toLowerCase();

  const configParts: string[] = [];
  const allHeaders: Record<string, string> = { ...headersRecord(cfg.headers) };
  if (cfg.bodyType === 'json' && cfg.bodyJson.trim()) {
    allHeaders['Content-Type'] = 'application/json';
  }
  else if (cfg.bodyType === 'form') {
    allHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  const hEntries = Object.entries(allHeaders);
  if (hEntries.length) {
    const hs = hEntries.map(([k, v]) => `  '${k}': '${v}'`).join(',\n');
    configParts.push(`headers: {\n${hs}\n}`);
  }

  const body = bodyValue(cfg);
  const urlStr = JSON.stringify(url);

  if (['get', 'delete', 'head', 'options'].includes(method)) {
    const cfg2 = configParts.length ? `, { ${configParts.join(', ')} }` : '';
    return `const { data } = await axios.${method}(${urlStr}${cfg2});`;
  }

  const bodyArg = body != null ? JSON.stringify(body) : 'null';
  const cfg2 = configParts.length ? `, { ${configParts.join(', ')} }` : '';
  return `const { data } = await axios.${method}(${urlStr}, ${bodyArg}${cfg2});`;
}

export function toPython(cfg: RequestConfig): string {
  const url = buildUrl(cfg.url, cfg.params);
  const lines = ['import requests', ''];

  const allHeaders: Record<string, string> = { ...headersRecord(cfg.headers) };
  if (cfg.bodyType === 'json' && cfg.bodyJson.trim()) {
    allHeaders['Content-Type'] = 'application/json';
  }
  else if (cfg.bodyType === 'form') {
    allHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  const hEntries = Object.entries(allHeaders);
  if (hEntries.length) {
    lines.push('headers = {');
    for (const [k, v] of hEntries) {
      lines.push(`    '${k}': '${v}',`);
    }
    lines.push('}', '');
  }

  const method = cfg.method.toLowerCase();
  const args: string[] = [JSON.stringify(url)];
  if (hEntries.length) {
    args.push('headers=headers');
  }

  if (cfg.bodyType === 'json' && cfg.bodyJson.trim()) {
    lines.push(`json_data = ${cfg.bodyJson.trim()}`, '');
    args.push('json=json_data');
  }
  else if (cfg.bodyType === 'form') {
    const pairs = activeKV(cfg.bodyForm);
    if (pairs.length) {
      lines.push('form_data = {');
      for (const [k, v] of pairs) {
        lines.push(`    '${k}': '${v}',`);
      }
      lines.push('}', '');
      args.push('data=form_data');
    }
  }
  else if (cfg.bodyType === 'text' && cfg.bodyText) {
    lines.push(`body = ${JSON.stringify(cfg.bodyText)}`, '');
    args.push('data=body');
  }

  lines.push(`response = requests.${method}(${args.join(', ')})`, 'print(response.json())');
  return lines.join('\n');
}

export function toPhpCurl(cfg: RequestConfig): string {
  const url = buildUrl(cfg.url, cfg.params);
  const allHeaders: Record<string, string> = { ...headersRecord(cfg.headers) };
  const lines = ['<?php', '', '$ch = curl_init();', ''];

  lines.push(`curl_setopt($ch, CURLOPT_URL, ${JSON.stringify(url)});`);
  lines.push('curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);');
  lines.push(`curl_setopt($ch, CURLOPT_CUSTOMREQUEST, '${cfg.method}');`);

  const hEntries = Object.entries(allHeaders);
  if (hEntries.length || cfg.bodyType === 'json') {
    if (cfg.bodyType === 'json') {
      allHeaders['Content-Type'] = 'application/json';
    }
    const allH = Object.entries(allHeaders);
    lines.push('');
    lines.push('$headers = [');
    for (const [k, v] of allH) {
      lines.push(`    '${k}: ${v}',`);
    }
    lines.push('];');
    lines.push('curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);');
  }

  const body = bodyValue(cfg);
  if (body !== null) {
    lines.push('');
    lines.push(`curl_setopt($ch, CURLOPT_POSTFIELDS, ${JSON.stringify(body)});`);
  }

  lines.push('', '$response = curl_exec($ch);', 'curl_close($ch);', 'echo $response;');
  return lines.join('\n');
}

export function toGo(cfg: RequestConfig): string {
  const url = buildUrl(cfg.url, cfg.params);
  const body = bodyValue(cfg);
  const allHeaders: Record<string, string> = { ...headersRecord(cfg.headers) };
  if (cfg.bodyType === 'json' && body) {
    allHeaders['Content-Type'] = 'application/json';
  }

  const lines = [
    'package main',
    '',
    'import (',
    '    "fmt"',
    '    "io"',
    '    "net/http"',
    body ? '    "strings"' : '',
    ')',
    '',
    'func main() {',
  ].filter(l => l !== null);

  if (body) {
    lines.push(`    body := strings.NewReader(${JSON.stringify(body)})`);
    lines.push(`    req, _ := http.NewRequest("${cfg.method}", ${JSON.stringify(url)}, body)`);
  }
  else {
    lines.push(`    req, _ := http.NewRequest("${cfg.method}", ${JSON.stringify(url)}, nil)`);
  }

  for (const [k, v] of Object.entries(allHeaders)) {
    lines.push(`    req.Header.Set("${k}", "${v}")`);
  }

  lines.push(
    '',
    '    client := &http.Client{}',
    '    resp, _ := client.Do(req)',
    '    defer resp.Body.Close()',
    '    data, _ := io.ReadAll(resp.Body)',
    '    fmt.Println(string(data))',
    '}',
  );
  return lines.join('\n');
}
