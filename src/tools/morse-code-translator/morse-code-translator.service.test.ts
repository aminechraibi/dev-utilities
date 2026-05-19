import { expect, describe, it } from 'vitest';
import { textToMorse, morseToText } from './morse-code-translator.service';

describe('morse-code-translator', () => {
  describe('textToMorse', () => {
    it('converts a single letter', () => {
      expect(textToMorse('A')).toBe('.-');
    });

    it('converts lowercase to uppercase', () => {
      expect(textToMorse('a')).toBe('.-');
    });

    it('converts a word', () => {
      expect(textToMorse('SOS')).toBe('... --- ...');
    });

    it('uses / as word separator', () => {
      expect(textToMorse('HI OM')).toBe('.... .. / --- --');
    });

    it('converts digits', () => {
      expect(textToMorse('1')).toBe('.----');
    });
  });

  describe('morseToText', () => {
    it('decodes a single morse code', () => {
      expect(morseToText('.-')).toBe('A');
    });

    it('decodes a word', () => {
      expect(morseToText('... --- ...')).toBe('SOS');
    });

    it('decodes multiple words separated by /', () => {
      expect(morseToText('.... .. / --- --')).toBe('HI OM');
    });

    it('round-trips text through morse and back', () => {
      const original = 'HELLO WORLD';
      expect(morseToText(textToMorse(original))).toBe(original);
    });
  });
});
