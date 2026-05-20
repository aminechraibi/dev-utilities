export type SqlDialect = 'mysql' | 'postgresql' | 'sqlite' | 'mssql';

function inferType(value: unknown, dialect: SqlDialect): string {
  if (value === null || value === undefined) {
    return 'TEXT';
  }
  if (typeof value === 'boolean') {
    if (dialect === 'mysql') {
      return 'TINYINT(1)';
    }
    if (dialect === 'mssql') {
      return 'BIT';
    }
    return 'BOOLEAN';
  }
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      return dialect === 'mssql' ? 'INT' : 'INTEGER';
    }
    return dialect === 'postgresql' ? 'DOUBLE PRECISION' : 'REAL';
  }
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}(T|\s)\d{2}:\d{2}/.test(value)) {
      return dialect === 'mssql' ? 'DATETIME2' : 'DATETIME';
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return 'DATE';
    }
    return 'TEXT';
  }
  return 'TEXT';
}

function quoteIdentifier(name: string, dialect: SqlDialect): string {
  if (dialect === 'mysql') {
    return `\`${name}\``;
  }
  if (dialect === 'mssql') {
    return `[${name}]`;
  }
  return `"${name}"`;
}

function formatValue(value: unknown, dialect: SqlDialect): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (typeof value === 'boolean') {
    if (dialect === 'mysql' || dialect === 'mssql') {
      return value ? '1' : '0';
    }
    return value ? 'TRUE' : 'FALSE';
  }
  if (typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'string') {
    const escaped = value.replace(/'/g, '\'\'');
    return `'${escaped}'`;
  }
  return `'${JSON.stringify(value).replace(/'/g, '\'\'')}'`;
}

export function jsonToSql(json: string, tableName: string, dialect: SqlDialect): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  }
  catch {
    throw new Error('Invalid JSON input');
  }

  if (!Array.isArray(parsed)) {
    throw new TypeError('JSON must be an array of objects');
  }

  if (parsed.length === 0) {
    throw new Error('JSON array must not be empty');
  }

  const rows = parsed as Record<string, unknown>[];
  const firstRow = rows[0];

  if (typeof firstRow !== 'object' || firstRow === null || Array.isArray(firstRow)) {
    throw new Error('Each item in JSON array must be an object');
  }

  const allKeys = Array.from(new Set(rows.flatMap(r => Object.keys(r))));

  const columnTypes: Record<string, string> = {};
  for (const key of allKeys) {
    const firstNonNull = rows.find(r => r[key] !== null && r[key] !== undefined);
    columnTypes[key] = inferType(firstNonNull ? firstNonNull[key] : null, dialect);
  }

  const tbl = quoteIdentifier(tableName || 'table_name', dialect);
  const lines: string[] = [];

  const colDefs = allKeys.map(k => `  ${quoteIdentifier(k, dialect)} ${columnTypes[k]}`).join(',\n');

  if (dialect === 'mssql') {
    lines.push(`IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='${tableName}' AND xtype='U')`);
    lines.push(`CREATE TABLE ${tbl} (`);
  }
  else {
    lines.push(`CREATE TABLE IF NOT EXISTS ${tbl} (`);
  }
  lines.push(colDefs);
  lines.push(');');
  lines.push('');

  const colList = allKeys.map(k => quoteIdentifier(k, dialect)).join(', ');
  for (const row of rows) {
    const values = allKeys.map(k => formatValue(row[k], dialect)).join(', ');
    lines.push(`INSERT INTO ${tbl} (${colList}) VALUES (${values});`);
  }

  return lines.join('\n');
}
