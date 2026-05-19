import { expect, describe, it } from 'vitest';
import { encodeBase32, decodeBase32, encodeBase32Hex, decodeBase32Hex } from './base32-encoder.service';

describe('base32-encoder', () => {
  describe('standard Base32 (RFC 4648)', () => {
    it('encodes empty string', () => {
      expect(encodeBase32('')).toBe('');
    });

    it('encodes "f" to "MY======"', () => {
      expect(encodeBase32('f')).toBe('MY======');
    });

    it('encodes "fo" to "MZXQ===="', () => {
      expect(encodeBase32('fo')).toBe('MZXQ====');
    });

    it('encodes "foo" to "MZXW6==="', () => {
      expect(encodeBase32('foo')).toBe('MZXW6===');
    });

    it('encodes "foobar" correctly', () => {
      expect(encodeBase32('foobar')).toBe('MZXW6YTBOI======');
    });

    it('decodes "MY======" to "f"', () => {
      expect(decodeBase32('MY======')).toBe('f');
    });

    it('decodes "MZXW6===" to "foo"', () => {
      expect(decodeBase32('MZXW6===')).toBe('foo');
    });

    it('round-trips encoding and decoding', () => {
      const input = 'Hello, World!';
      expect(decodeBase32(encodeBase32(input))).toBe(input);
    });

    it('throws on invalid characters', () => {
      expect(() => decodeBase32('1234!@#$')).toThrow();
    });
  });

  describe('Base32 Hex variant', () => {
    it('encodes "f" using hex alphabet', () => {
      expect(encodeBase32Hex('f')).toBe('CO======');
    });

    it('round-trips with hex variant', () => {
      const input = 'test data';
      expect(decodeBase32Hex(encodeBase32Hex(input))).toBe(input);
    });
  });
});
