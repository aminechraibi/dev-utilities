import { marked } from 'marked';

export function mdToHtml(md: string): string {
  return marked.parse(md) as string;
}

export function htmlToMd(html: string): string {
  const el = document.createElement('div');
  el.innerHTML = html;
  return nodeToMd(el).trim();
}

function nodeToMd(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? '';
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();
  const children = () => Array.from(el.childNodes).map(nodeToMd).join('');

  switch (tag) {
    case 'h1': return `# ${children()}\n\n`;
    case 'h2': return `## ${children()}\n\n`;
    case 'h3': return `### ${children()}\n\n`;
    case 'h4': return `#### ${children()}\n\n`;
    case 'h5': return `##### ${children()}\n\n`;
    case 'h6': return `###### ${children()}\n\n`;
    case 'p': return `${children()}\n\n`;
    case 'br': return '\n';
    case 'strong':
    case 'b': return `**${children()}**`;
    case 'em':
    case 'i': return `*${children()}*`;
    case 's':
    case 'del': return `~~${children()}~~`;
    case 'code': {
      const parent = el.parentElement?.tagName.toLowerCase();
      if (parent === 'pre') {
        return el.textContent ?? '';
      }
      return `\`${el.textContent}\``;
    }
    case 'pre': {
      const code = el.querySelector('code');
      const lang = code?.className.replace('language-', '') ?? '';
      const text = code ? (code.textContent ?? '') : (el.textContent ?? '');
      return `\`\`\`${lang}\n${text}\n\`\`\`\n\n`;
    }
    case 'blockquote':
      return `${children().split('\n').map(l => `> ${l}`).join('\n')}\n\n`;
    case 'a': {
      const href = el.getAttribute('href') ?? '';
      const title = el.getAttribute('title');
      return `[${children()}](${href}${title ? ` "${title}"` : ''})`;
    }
    case 'img': {
      const src = el.getAttribute('src') ?? '';
      const alt = el.getAttribute('alt') ?? '';
      return `![${alt}](${src})`;
    }
    case 'ul':
      return `${Array.from(el.children).map(li => `- ${nodeToMd(li).trim()}`).join('\n')}\n\n`;
    case 'ol':
      return `${Array.from(el.children).map((li, i) => `${i + 1}. ${nodeToMd(li).trim()}`).join('\n')}\n\n`;
    case 'li': return children();
    case 'hr': return '---\n\n';
    case 'table': {
      const rows = Array.from(el.querySelectorAll('tr'));
      if (!rows.length) {
        return '';
      }
      const toRow = (r: Element) =>
        `| ${Array.from(r.querySelectorAll('th,td')).map(c => c.textContent?.trim() ?? '').join(' | ')} |`;
      const header = toRow(rows[0]!);
      const cols = rows[0]!.querySelectorAll('th,td').length;
      const sep = `| ${Array.from({ length: cols }, () => '---').join(' | ')} |`;
      const body = rows.slice(1).map(toRow).join('\n');
      return `${header}\n${sep}${body ? `\n${body}` : ''}\n\n`;
    }
    default:
      return children();
  }
}
