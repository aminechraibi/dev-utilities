export interface FormatOptions {
  indentSize: number
}

export function formatJavaScript(code: string, options: FormatOptions): string {
  const { indentSize } = options;
  const indent = ' '.repeat(indentSize);

  const lines: string[] = [];
  let indentLevel = 0;
  let currentLine = '';

  // Normalize line endings and split
  const normalized = code.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const chars = normalized;
  let i = 0;

  function flushLine() {
    const trimmed = currentLine.trim();
    if (trimmed.length > 0) {
      lines.push(indent.repeat(Math.max(0, indentLevel)) + trimmed);
    }
    currentLine = '';
  }

  let inString = false;
  let stringChar = '';
  let inLineComment = false;
  let inBlockComment = false;

  while (i < chars.length) {
    const ch = chars[i];
    const next = chars[i + 1];

    // Handle line comment end
    if (inLineComment) {
      if (ch === '\n') {
        inLineComment = false;
        flushLine();
      }
      else {
        currentLine += ch;
      }
      i++;
      continue;
    }

    // Handle block comment end
    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        currentLine += '*/';
        i += 2;
        inBlockComment = false;
      }
      else if (ch === '\n') {
        flushLine();
        i++;
      }
      else {
        currentLine += ch;
        i++;
      }
      continue;
    }

    // Handle string
    if (inString) {
      currentLine += ch;
      if (ch === '\\') {
        // Escape sequence
        if (next) {
          currentLine += next;
          i += 2;
        }
        else {
          i++;
        }
        continue;
      }
      if (ch === stringChar) {
        inString = false;
      }
      i++;
      continue;
    }

    // Start of line comment
    if (ch === '/' && next === '/') {
      currentLine += '//';
      i += 2;
      inLineComment = true;
      continue;
    }

    // Start of block comment
    if (ch === '/' && next === '*') {
      currentLine += '/*';
      i += 2;
      inBlockComment = true;
      continue;
    }

    // String start
    if (ch === '"' || ch === '\'' || ch === '`') {
      inString = true;
      stringChar = ch;
      currentLine += ch;
      i++;
      continue;
    }

    // Opening brace
    if (ch === '{') {
      currentLine += ' {';
      flushLine();
      indentLevel++;
      i++;
      continue;
    }

    // Closing brace
    if (ch === '}') {
      flushLine();
      indentLevel = Math.max(0, indentLevel - 1);
      currentLine = '}';
      // Check if followed by ; or else
      let j = i + 1;
      while (j < chars.length && (chars[j] === ' ' || chars[j] === '\t')) {
        j++;
      }
      if (chars[j] === ';') {
        currentLine += ';';
        i = j + 1;
      }
      else if (chars.slice(j, j + 4) === 'else') {
        currentLine += ' else';
        i = j + 4;
      }
      else {
        i++;
      }
      flushLine();
      continue;
    }

    // Semicolon - ends the statement
    if (ch === ';') {
      currentLine += ';';
      flushLine();
      i++;
      continue;
    }

    // Newlines - ignore (we're reformatting)
    if (ch === '\n') {
      // If current line has content, flush it
      if (currentLine.trim().length > 0) {
        // Don't auto-flush for multi-line constructs, but do for declarations
        // that don't end with , { or operator
        const t = currentLine.trim();
        const endsWithContinuation = /[,\(\[\&\|\?\:\+\-\*\/\\]$/.test(t)
          || t.endsWith('{')
          || t.endsWith('(');
        if (!endsWithContinuation) {
          flushLine();
        }
        else {
          currentLine += ' ';
        }
      }
      i++;
      continue;
    }

    // Collapse multiple spaces/tabs
    if (ch === ' ' || ch === '\t') {
      if (currentLine.length > 0 && currentLine[currentLine.length - 1] !== ' ') {
        currentLine += ' ';
      }
      i++;
      continue;
    }

    currentLine += ch;
    i++;
  }

  // Flush remaining
  if (currentLine.trim().length > 0) {
    flushLine();
  }

  return lines.join('\n');
}
