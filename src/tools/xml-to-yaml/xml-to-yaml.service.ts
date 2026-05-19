import convert from 'xml-js';
import { stringify } from 'yaml';

export function xmlToYaml(xml: string): string {
  const js = convert.xml2js(xml.trim(), { compact: false, ignoreDeclaration: true, ignoreInstruction: true });
  return stringify(js, { indent: 2 });
}
