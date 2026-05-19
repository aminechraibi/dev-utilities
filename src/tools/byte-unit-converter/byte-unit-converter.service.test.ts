import { expect, describe, it } from 'vitest';
import { bytesToKB, bytesToMB, bytesToGB, kbToBytes, bytesToKiB, bytesToMiB, kibToBytes } from './byte-unit-converter.service';

describe('byte-unit-converter', () => {
  describe('decimal conversions', () => {
    it('converts bytes to KB', () => {
      expect(bytesToKB(1000)).toBe(1);
    });

    it('converts bytes to MB', () => {
      expect(bytesToMB(1_000_000)).toBe(1);
    });

    it('converts bytes to GB', () => {
      expect(bytesToGB(1_000_000_000)).toBe(1);
    });

    it('converts KB to bytes', () => {
      expect(kbToBytes(1)).toBe(1000);
    });
  });

  describe('binary conversions', () => {
    it('converts bytes to KiB', () => {
      expect(bytesToKiB(1024)).toBe(1);
    });

    it('converts bytes to MiB', () => {
      expect(bytesToMiB(1024 * 1024)).toBe(1);
    });

    it('converts KiB to bytes', () => {
      expect(kibToBytes(1)).toBe(1024);
    });
  });
});
