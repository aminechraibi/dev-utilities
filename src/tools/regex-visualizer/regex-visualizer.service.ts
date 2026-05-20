export interface RegexToken {
  type: 'literal' | 'charClass' | 'group' | 'quantifier' | 'anchor' | 'alternation' | 'dot' | 'escape'
  value: string
  label: string
}

export function tokenizeRegex(pattern: string): RegexToken[] {
  const tokens: RegexToken[] = [];
  let i = 0;

  while (i < pattern.length) {
    const ch = pattern[i];

    if (ch === '^' || ch === '$') {
      tokens.push({ type: 'anchor', value: ch, label: ch === '^' ? 'Start' : 'End' });
      i++;
    }
    else if (ch === '|') {
      tokens.push({ type: 'alternation', value: '|', label: 'OR' });
      i++;
    }
    else if (ch === '.') {
      tokens.push({ type: 'dot', value: '.', label: 'Any char' });
      i++;
    }
    else if (ch === '\\') {
      const next = pattern[i + 1] ?? '';
      const escLabels: Record<string, string> = {
        d: 'Digit',
        D: 'Non-digit',
        w: 'Word',
        W: 'Non-word',
        s: 'Space',
        S: 'Non-space',
        n: 'Newline',
        t: 'Tab',
      };
      tokens.push({ type: 'escape', value: `\\${next}`, label: escLabels[next] ?? `\\${next}` });
      i += 2;
    }
    else if (ch === '[') {
      let j = i + 1;
      if (pattern[j] === '^') {
        j++;
      }
      while (j < pattern.length && pattern[j] !== ']') {
        if (pattern[j] === '\\') {
          j++;
        }
        j++;
      }
      const raw = pattern.slice(i, j + 1);
      tokens.push({ type: 'charClass', value: raw, label: 'Char class' });
      i = j + 1;
    }
    else if (ch === '(') {
      let depth = 1;
      let j = i + 1;
      while (j < pattern.length && depth > 0) {
        if (pattern[j] === '\\') {
          j++;
        }
        else if (pattern[j] === '(') {
          depth++;
        }
        else if (pattern[j] === ')') {
          depth--;
        }
        j++;
      }
      const raw = pattern.slice(i, j);
      const isNonCapturing = raw.startsWith('(?:');
      const isLookahead = raw.startsWith('(?=') || raw.startsWith('(?!');
      tokens.push({
        type: 'group',
        value: raw,
        label: isNonCapturing ? 'Non-capturing group' : isLookahead ? 'Lookahead' : 'Group',
      });
      i = j;
    }
    else if (ch === '*' || ch === '+' || ch === '?') {
      const last = tokens[tokens.length - 1];
      const labels: Record<string, string> = { '*': '0 or more', '+': '1 or more', '?': '0 or 1' };
      if (last) {
        last.label = `${last.label} (${labels[ch]})`;
        last.value += ch;
      }
      i++;
    }
    else if (ch === '{') {
      const j = pattern.indexOf('}', i);
      if (j !== -1) {
        const quantifier = pattern.slice(i, j + 1);
        const last = tokens[tokens.length - 1];
        if (last) {
          last.label = `${last.label} (${quantifier})`;
          last.value += quantifier;
        }
        i = j + 1;
      }
      else {
        tokens.push({ type: 'literal', value: ch, label: ch });
        i++;
      }
    }
    else {
      tokens.push({ type: 'literal', value: ch, label: ch });
      i++;
    }
  }

  return tokens;
}

export function isValidRegex(pattern: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new RegExp(pattern);
    return true;
  }
  catch {
    return false;
  }
}
