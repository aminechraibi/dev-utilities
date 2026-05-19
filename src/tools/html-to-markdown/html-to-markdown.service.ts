export function htmlToMarkdown(html: string): string {
  if (!html.trim()) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return nodeToMarkdown(doc.body).trim();
}

function nodeToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
  if (node.nodeType !== Node.ELEMENT_NODE) return '';
  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  const children = Array.from(el.childNodes).map(nodeToMarkdown).join('');

  switch (tag) {
    case 'h1': return `\n# ${children}\n`;
    case 'h2': return `\n## ${children}\n`;
    case 'h3': return `\n### ${children}\n`;
    case 'h4': return `\n#### ${children}\n`;
    case 'h5': return `\n##### ${children}\n`;
    case 'h6': return `\n###### ${children}\n`;
    case 'p': return `\n${children}\n`;
    case 'strong':
    case 'b': return `**${children}**`;
    case 'em':
    case 'i': return `*${children}*`;
    case 'code': return `\`${children}\``;
    case 'pre': return `\n\`\`\`\n${el.textContent}\n\`\`\`\n`;
    case 'blockquote': return children.split('\n').map(l => `> ${l}`).join('\n');
    case 'hr': return '\n---\n';
    case 'br': return '\n';
    case 'a': return `[${children}](${el.getAttribute('href') ?? ''})`;
    case 'img': return `![${el.getAttribute('alt') ?? ''}](${el.getAttribute('src') ?? ''})`;
    case 'ul': return '\n' + Array.from(el.children).map(li => `- ${nodeToMarkdown(li).trim()}`).join('\n') + '\n';
    case 'ol': return '\n' + Array.from(el.children).map((li, i) => `${i + 1}. ${nodeToMarkdown(li).trim()}`).join('\n') + '\n';
    case 'li': return children;
    case 'del':
    case 's': return `~~${children}~~`;
    default: return children;
  }
}
