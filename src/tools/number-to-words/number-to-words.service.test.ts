import { expect, describe, it } from 'vitest';
import { numberToWords, numberToOrdinal } from './number-to-words.service';

describe('number-to-words', () => {
  describe('numberToWords', () => {
    it('converts zero', () => {
      expect(numberToWords(0)).toBe('zero');
    });

    it('converts single digits', () => {
      expect(numberToWords(1)).toBe('one');
      expect(numberToWords(9)).toBe('nine');
    });

    it('converts teens', () => {
      expect(numberToWords(11)).toBe('eleven');
      expect(numberToWords(15)).toBe('fifteen');
    });

    it('converts tens', () => {
      expect(numberToWords(20)).toBe('twenty');
      expect(numberToWords(42)).toBe('forty-two');
    });

    it('converts hundreds', () => {
      expect(numberToWords(100)).toBe('one hundred');
      expect(numberToWords(123)).toBe('one hundred twenty-three');
    });

    it('converts thousands', () => {
      expect(numberToWords(1000)).toBe('one thousand');
      expect(numberToWords(1001)).toBe('one thousand, one');
    });

    it('converts millions', () => {
      expect(numberToWords(1_000_000)).toBe('one million');
    });

    it('converts negative numbers', () => {
      expect(numberToWords(-5)).toBe('negative five');
    });

    it('converts decimal numbers', () => {
      expect(numberToWords(3.14)).toContain('three');
      expect(numberToWords(3.14)).toContain('point');
    });
  });

  describe('numberToOrdinal', () => {
    it('converts 1 to first', () => {
      expect(numberToOrdinal(1)).toBe('first');
    });

    it('converts 2 to second', () => {
      expect(numberToOrdinal(2)).toBe('second');
    });

    it('converts 3 to third', () => {
      expect(numberToOrdinal(3)).toBe('third');
    });

    it('converts 42 to forty-second', () => {
      expect(numberToOrdinal(42)).toBe('forty-second');
    });

    it('converts 100 to one hundredth', () => {
      expect(numberToOrdinal(100)).toBe('one hundredth');
    });

    it('returns not applicable for negative numbers', () => {
      expect(numberToOrdinal(-1)).toBe('not applicable');
    });
  });
});
