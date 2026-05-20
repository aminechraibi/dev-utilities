import { describe, expect, it } from 'vitest';
import { xmlToYaml } from './xml-to-yaml.service';

describe('xml-to-yaml', () => {
  it('converts simple XML to YAML', () => {
    const xml = '<root><name>Alice</name></root>';
    const result = xmlToYaml(xml);
    expect(result).toContain('name');
    expect(result).toContain('Alice');
  });

  it('converts XML with attributes', () => {
    const xml = '<person id="1"><name>Bob</name></person>';
    const result = xmlToYaml(xml);
    expect(result).toContain('id');
    expect(result).toContain('1');
    expect(result).toContain('Bob');
  });

  it('returns a string for valid XML', () => {
    const xml = '<root><item>value</item></root>';
    const result = xmlToYaml(xml);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
