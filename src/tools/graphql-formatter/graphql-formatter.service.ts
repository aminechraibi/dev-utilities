/**
 * Basic GraphQL formatter that re-indents queries/mutations/fragments.
 * Works by tokenizing braces and keywords, then re-building with proper indentation.
 */
export function formatGraphql(query: string): string {
  if (!query.trim()) {
    return '';
  }

  // Normalize line endings and strip leading/trailing whitespace
  const input = query.replace(/\r\n/g, '\n').trim();

  const tokens = tokenize(input);
  return buildFormatted(tokens);
}

type Token =
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'word'; value: string }
  | { type: 'colon' }
  | { type: 'at'; value: string }
  | { type: 'paren_open' }
  | { type: 'paren_close' }
  | { type: 'bracket_open' }
  | { type: 'bracket_close' }
  | { type: 'comma' }
  | { type: 'newline' }
  | { type: 'string'; value: string }
  | { type: 'spread' };

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    // Skip whitespace (we re-emit newlines selectively)
    if (ch === ' ' || ch === '\t' || ch === '\r') {
      i++;
      continue;
    }

    if (ch === '\n') {
      tokens.push({ type: 'newline' });
      i++;
      continue;
    }

    // Comments — keep as word tokens to preserve them
    if (ch === '#') {
      let comment = '';
      while (i < input.length && input[i] !== '\n') {
        comment += input[i];
        i++;
      }
      tokens.push({ type: 'word', value: comment });
      tokens.push({ type: 'newline' });
      continue;
    }

    if (ch === '{') {
      tokens.push({ type: 'open' });
      i++;
      continue;
    }
    if (ch === '}') {
      tokens.push({ type: 'close' });
      i++;
      continue;
    }
    if (ch === '(') {
      tokens.push({ type: 'paren_open' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'paren_close' });
      i++;
      continue;
    }
    if (ch === '[') {
      tokens.push({ type: 'bracket_open' });
      i++;
      continue;
    }
    if (ch === ']') {
      tokens.push({ type: 'bracket_close' });
      i++;
      continue;
    }
    if (ch === ':') {
      tokens.push({ type: 'colon' });
      i++;
      continue;
    }
    if (ch === ',') {
      tokens.push({ type: 'comma' });
      i++;
      continue;
    }

    // Spread operator ...
    if (ch === '.' && input[i + 1] === '.' && input[i + 2] === '.') {
      tokens.push({ type: 'spread' });
      i += 3;
      continue;
    }

    // @ directives
    if (ch === '@') {
      let word = '@';
      i++;
      while (i < input.length && /[\w]/.test(input[i])) {
        word += input[i];
        i++;
      }
      tokens.push({ type: 'at', value: word });
      continue;
    }

    // Strings (double-quoted or triple-quoted block strings)
    if (ch === '"') {
      if (input[i + 1] === '"' && input[i + 2] === '"') {
        // Block string
        let str = '"""';
        i += 3;
        while (i < input.length) {
          if (input[i] === '"' && input[i + 1] === '"' && input[i + 2] === '"') {
            str += '"""';
            i += 3;
            break;
          }
          str += input[i];
          i++;
        }
        tokens.push({ type: 'string', value: str });
      }
      else {
        let str = '"';
        i++;
        while (i < input.length && input[i] !== '"') {
          if (input[i] === '\\') {
            str += input[i] + input[i + 1];
            i += 2;
          }
          else {
            str += input[i];
            i++;
          }
        }
        str += '"';
        i++;
        tokens.push({ type: 'string', value: str });
      }
      continue;
    }

    // Words (identifiers, keywords, numbers, variables $var)
    if (/[\w$!]/.test(ch)) {
      let word = '';
      while (i < input.length && /[\w$!.]/.test(input[i]) && !(input[i] === '.' && input[i + 1] === '.')) {
        word += input[i];
        i++;
      }
      tokens.push({ type: 'word', value: word });
      continue;
    }

    // Unknown char — skip
    i++;
  }

  return tokens;
}

function buildFormatted(tokens: Token[]): string {
  const INDENT = '  ';
  let depth = 0;
  let result = '';
  let lineBuffer = '';
  let parenDepth = 0;
  let bracketDepth = 0;

  function flush() {
    const trimmed = lineBuffer.trimEnd();
    if (trimmed) {
      result += `${INDENT.repeat(depth) + trimmed}\n`;
    }
    lineBuffer = '';
  }

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    const next = tokens[i + 1];

    if (tok.type === 'newline') {
      // Only flush on real newlines (outside parens/brackets at top level)
      if (parenDepth === 0 && bracketDepth === 0) {
        flush();
      }
      continue;
    }

    if (tok.type === 'open') {
      if (parenDepth > 0 || bracketDepth > 0) {
        lineBuffer += ' {';
      }
      else {
        lineBuffer += ' {';
        flush();
        depth++;
      }
      continue;
    }

    if (tok.type === 'close') {
      if (parenDepth > 0 || bracketDepth > 0) {
        lineBuffer += '}';
      }
      else {
        flush();
        depth = Math.max(0, depth - 1);
        lineBuffer = '}';
        flush();
      }
      continue;
    }

    if (tok.type === 'paren_open') {
      parenDepth++;
      lineBuffer += '(';
      continue;
    }

    if (tok.type === 'paren_close') {
      parenDepth = Math.max(0, parenDepth - 1);
      lineBuffer += ')';
      continue;
    }

    if (tok.type === 'bracket_open') {
      bracketDepth++;
      lineBuffer += '[';
      continue;
    }

    if (tok.type === 'bracket_close') {
      bracketDepth = Math.max(0, bracketDepth - 1);
      lineBuffer += ']';
      continue;
    }

    if (tok.type === 'comma') {
      if (parenDepth > 0 || bracketDepth > 0) {
        lineBuffer += ', ';
      }
      else {
        flush();
      }
      continue;
    }

    if (tok.type === 'colon') {
      lineBuffer += ': ';
      continue;
    }

    if (tok.type === 'at') {
      if (lineBuffer && !lineBuffer.endsWith(' ')) {
        lineBuffer += ' ';
      }
      lineBuffer += tok.value;
      continue;
    }

    if (tok.type === 'spread') {
      lineBuffer += '...';
      continue;
    }

    if (tok.type === 'string') {
      if (lineBuffer && !lineBuffer.endsWith(' ') && !lineBuffer.endsWith('(') && !lineBuffer.endsWith('[') && !lineBuffer.endsWith(': ')) {
        lineBuffer += ' ';
      }
      lineBuffer += tok.value;
      continue;
    }

    if (tok.type === 'word') {
      // If line is non-empty and doesn't end with separator, add space
      if (lineBuffer && !lineBuffer.endsWith(' ') && !lineBuffer.endsWith('(') && !lineBuffer.endsWith('[') && !lineBuffer.endsWith('...')) {
        lineBuffer += ' ';
      }
      lineBuffer += tok.value;

      // If the word ends with ! (non-null), no extra space
      // If next token is { (open block), we'll handle spacing there
      // If next token is ( — arguments follow inline
      if (next && next.type === 'open' && parenDepth === 0 && bracketDepth === 0) {
        // don't add space; the open brace handler adds ' {'
      }
      continue;
    }
  }

  // flush anything remaining
  flush();

  return result.trimEnd();
}
