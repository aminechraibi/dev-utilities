export interface CleanOptions {
  removeTagAttributes: boolean
  removeInlineStyles: boolean
  removeClassesAndIds: boolean
  removeAllTags: boolean
  removeSuccessiveNbsp: boolean
  convertBoldItalic: boolean
  removeEmptyTags: boolean
  removeNbspOnlyTags: boolean
  removeSpanTags: boolean
  removeImages: boolean
  removeLinks: boolean
  removeTables: boolean
  replaceTablesWithDivs: boolean
  removeComments: boolean
  setNewLinesAndIndent: boolean
}

export const defaultOptions: CleanOptions = {
  removeTagAttributes: false,
  removeInlineStyles: true,
  removeClassesAndIds: true,
  removeAllTags: false,
  removeSuccessiveNbsp: false,
  convertBoldItalic: false,
  removeEmptyTags: false,
  removeNbspOnlyTags: false,
  removeSpanTags: false,
  removeImages: false,
  removeLinks: false,
  removeTables: false,
  replaceTablesWithDivs: false,
  removeComments: true,
  setNewLinesAndIndent: true,
};

export function cleanHtml(html: string, opts: CleanOptions): string {
  let out = html;

  if (opts.removeComments) {
    out = out.replace(/<!--[\s\S]*?-->/g, '');
  }

  if (opts.removeImages) {
    out = out.replace(/<img[^>]*\/?>/gi, '');
  }

  if (opts.removeLinks) {
    out = out.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1');
  }

  if (opts.removeTables) {
    out = out.replace(/<table[\s\S]*?<\/table>/gi, '');
  }
  else if (opts.replaceTablesWithDivs) {
    out = out
      .replace(/<table[^>]*>/gi, '<div>')
      .replace(/<\/table>/gi, '</div>')
      .replace(/<thead[^>]*>/gi, '<div>')
      .replace(/<\/thead>/gi, '</div>')
      .replace(/<tbody[^>]*>/gi, '<div>')
      .replace(/<\/tbody>/gi, '</div>')
      .replace(/<tfoot[^>]*>/gi, '<div>')
      .replace(/<\/tfoot>/gi, '</div>')
      .replace(/<tr[^>]*>/gi, '<div>')
      .replace(/<\/tr>/gi, '</div>')
      .replace(/<t[dh][^>]*>/gi, '<div>')
      .replace(/<\/t[dh]>/gi, '</div>');
  }

  if (opts.removeSpanTags) {
    out = out.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1');
  }

  if (opts.convertBoldItalic) {
    out = out
      .replace(/<b\b([^>]*)>/gi, '<strong$1>')
      .replace(/<\/b>/gi, '</strong>')
      .replace(/<i\b([^>]*)>/gi, '<em$1>')
      .replace(/<\/i>/gi, '</em>');
  }

  if (opts.removeAllTags) {
    out = out.replace(/<[^>]+>/g, '');
    out = out.replace(/&nbsp;/g, ' ').trim();
    return out;
  }

  if (opts.removeInlineStyles) {
    out = out.replace(/\s*style\s*=\s*"[^"]*"/gi, '');
    out = out.replace(/\s*style\s*=\s*'[^']*'/gi, '');
  }

  if (opts.removeClassesAndIds) {
    out = out.replace(/\s*class\s*=\s*"[^"]*"/gi, '');
    out = out.replace(/\s*class\s*=\s*'[^']*'/gi, '');
    out = out.replace(/\s*id\s*=\s*"[^"]*"/gi, '');
    out = out.replace(/\s*id\s*=\s*'[^']*'/gi, '');
  }

  if (opts.removeTagAttributes) {
    out = out.replace(/<(\w+)[^>]*>/g, '<$1>');
  }

  if (opts.removeNbspOnlyTags) {
    out = out.replace(/<(\w+)[^>]*>\s*&nbsp;\s*<\/\1>/gi, '');
  }

  if (opts.removeEmptyTags) {
    let prev = '';
    while (prev !== out) {
      prev = out;
      out = out.replace(/<(\w+)[^>]*>\s*<\/\1>/gi, '');
    }
  }

  if (opts.removeSuccessiveNbsp) {
    out = out.replace(/(&nbsp;\s*){2,}/g, '&nbsp;');
  }

  if (opts.setNewLinesAndIndent) {
    const BLOCK = /^(div|p|h[1-6]|ul|ol|li|table|thead|tbody|tfoot|tr|td|th|blockquote|pre|section|article|header|footer|main|nav|aside|figure|figcaption|form|fieldset)$/i;
    out = out
      .replace(/>\s+</g, '><')
      .replace(/(<\/?([\w]+)[^>]*>)/g, (match, _full, tag) => {
        if (BLOCK.test(tag)) {
          return match.startsWith('</') ? `${match}\n` : `\n${match}`;
        }
        return match;
      });

    const lines = out.split('\n').filter(l => l.trim());
    let indent = 0;
    const indented: string[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      const isClose = /^<\//.test(trimmed);
      const isSelfClose = /\/>$/.test(trimmed) || /^<(br|hr|img|input|meta|link)\b/i.test(trimmed);
      const isOpen = /^<[^/]/.test(trimmed) && !isSelfClose;
      if (isClose) {
        indent = Math.max(0, indent - 1);
      }
      indented.push('  '.repeat(indent) + trimmed);
      if (isOpen && !isClose) {
        indent++;
      }
    }
    out = indented.join('\n');
  }

  return out.trim();
}
