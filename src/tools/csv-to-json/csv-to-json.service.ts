export function csvToJson(csv: string, delimiter: string, hasHeader: boolean): string {
  if (!csv.trim()) {
    return '';
  }

  const lines = csv.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) {
    return '[]';
  }

  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    while (i < line.length) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i += 2;
          continue;
        }
        inQuotes = !inQuotes;
      }
      else if (char === delimiter && !inQuotes) {
        result.push(current);
        current = '';
      }
      else {
        current += char;
      }
      i++;
    }
    result.push(current);
    return result;
  };

  let headers: string[];
  let dataLines: string[];

  if (hasHeader) {
    headers = parseCsvLine(lines[0]);
    dataLines = lines.slice(1);
  }
  else {
    const firstRow = parseCsvLine(lines[0]);
    headers = firstRow.map((_, idx) => `col${idx}`);
    dataLines = lines;
  }

  const result = dataLines.map((line) => {
    const values = parseCsvLine(line);
    const obj: Record<string, string> = {};
    headers.forEach((header, idx) => {
      obj[header] = values[idx] ?? '';
    });
    return obj;
  });

  return JSON.stringify(result, null, 2);
}
