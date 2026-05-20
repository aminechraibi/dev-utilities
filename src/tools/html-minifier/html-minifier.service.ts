export interface MinifyOptions {
  removeComments: boolean
  collapseWhitespace: boolean
}

export function minifyHtml(html: string, options: MinifyOptions): string {
  let result = html;

  if (options.removeComments) {
    result = result.replace(/<!--[\s\S]*?-->/g, '');
  }

  if (options.collapseWhitespace) {
    // Collapse whitespace between tags
    result = result.replace(/>\s+</g, '><');

    // Collapse multiple whitespace characters into one
    result = result.replace(/\s{2,}/g, ' ');

    // Trim each line and remove empty lines
    result = result
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('');
  }

  return result.trim();
}
