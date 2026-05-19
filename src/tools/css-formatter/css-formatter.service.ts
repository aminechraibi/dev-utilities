export function formatCss(css: string): string {
  // Remove existing extra whitespace
  let result = css.trim();

  // Remove CSS comments first, then reformat
  // Actually keep comments - just reformat
  const lines: string[] = [];
  let indentLevel = 0;
  const indentStr = '  ';

  // Tokenize: split on { } ;
  const tokens = result
    .replace(/\/\*[\s\S]*?\*\//g, match => match) // preserve comments
    .split(/([\{\};])/)
    .map(t => t.trim())
    .filter(t => t.length > 0);

  for (const token of tokens) {
    if (token === '{') {
      // Opening brace stays on same line as selector
      const lastLine = lines[lines.length - 1];
      if (lastLine !== undefined) {
        lines[lines.length - 1] = lastLine + ' {';
      }
      else {
        lines.push('{');
      }
      indentLevel++;
    }
    else if (token === '}') {
      indentLevel = Math.max(0, indentLevel - 1);
      lines.push(`${indentStr.repeat(indentLevel)}}`);
    }
    else if (token === ';') {
      // Semicolon: append to last property line
      const lastLine = lines[lines.length - 1];
      if (lastLine !== undefined && !lastLine.trim().endsWith('{') && !lastLine.trim().endsWith('}')) {
        lines[lines.length - 1] = `${lastLine};`;
      }
    }
    else {
      // Could be selector, property:value, or multiple declarations
      const parts = token.split(';').map(p => p.trim()).filter(p => p.length > 0);
      for (const part of parts) {
        lines.push(`${indentStr.repeat(indentLevel)}${part}`);
      }
    }
  }

  return lines
    .filter((line, i, arr) => {
      // Remove consecutive empty lines
      if (line.trim() === '' && arr[i - 1]?.trim() === '') return false;
      return true;
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function minifyCss(css: string): string {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove newlines and extra spaces
    .replace(/\s+/g, ' ')
    // Remove spaces around specific chars
    .replace(/\s*\{\s*/g, '{')
    .replace(/\s*\}\s*/g, '}')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*,\s*/g, ',')
    // Remove trailing semicolons before closing braces
    .replace(/;}/g, '}')
    .trim();
}
