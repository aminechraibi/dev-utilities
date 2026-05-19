export interface CsvParseResult {
  headers: string[];
  rows: string[][];
}

export function detectDelimiter(text: string): string {
  const firstLine = text.split('\n')[0] ?? '';
  const counts = {
    ',': (firstLine.match(/,/g) ?? []).length,
    ';': (firstLine.match(/;/g) ?? []).length,
    '\t': (firstLine.match(/\t/g) ?? []).length,
  };
  if (counts['\t'] >= counts[','] && counts['\t'] >= counts[';']) return '\t';
  if (counts[';'] >= counts[',']) return ';';
  return ',';
}

function parseLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i += 2;
        }
        else {
          inQuotes = false;
          i++;
        }
      }
      else {
        current += char;
        i++;
      }
    }
    else if (char === '"') {
      inQuotes = true;
      i++;
    }
    else if (line.startsWith(delimiter, i)) {
      result.push(current);
      current = '';
      i += delimiter.length;
    }
    else {
      current += char;
      i++;
    }
  }

  result.push(current);
  return result;
}

export function parseCsv(text: string, delimiter: string, hasHeader: boolean): CsvParseResult {
  if (!text.trim()) {
    return { headers: [], rows: [] };
  }

  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const allRows = lines.map(line => parseLine(line.trimEnd(), delimiter));

  if (hasHeader) {
    const [headerRow, ...dataRows] = allRows;
    return {
      headers: headerRow ?? [],
      rows: dataRows,
    };
  }
  else {
    const maxCols = Math.max(...allRows.map(r => r.length));
    const headers = Array.from({ length: maxCols }, (_, i) => `Column ${i + 1}`);
    return { headers, rows: allRows };
  }
}
