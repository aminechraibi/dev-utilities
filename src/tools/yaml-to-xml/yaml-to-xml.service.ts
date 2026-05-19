import { parse } from 'yaml';
import { js2xml } from 'xml-js';

export function yamlToXml(yamlStr: string, includeDeclaration = true): string {
  if (!yamlStr.trim()) return '';
  const parsed = parse(yamlStr);
  const jsObj = typeof parsed === 'object' && parsed !== null ? parsed : { value: parsed };
  const xmlStr = js2xml({ root: jsObj }, { compact: true, spaces: 2 });
  if (includeDeclaration) {
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + xmlStr;
  }
  return xmlStr;
}
