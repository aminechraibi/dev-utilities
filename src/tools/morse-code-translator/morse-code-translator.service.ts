const MORSE_MAP: Record<string, string> = {
  'A': '.-',
  'B': '-...',
  'C': '-.-.',
  'D': '-..',
  'E': '.',
  'F': '..-.',
  'G': '--.',
  'H': '....',
  'I': '..',
  'J': '.---',
  'K': '-.-',
  'L': '.-..',
  'M': '--',
  'N': '-.',
  'O': '---',
  'P': '.--.',
  'Q': '--.-',
  'R': '.-.',
  'S': '...',
  'T': '-',
  'U': '..-',
  'V': '...-',
  'W': '.--',
  'X': '-..-',
  'Y': '-.--',
  'Z': '--..',
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  '\'': '.----.',
  '!': '-.-.--',
  '/': '-..-.',
  '(': '-.--.',
  ')': '-.--.-',
  '&': '.-...',
  ':': '---...',
  ';': '-.-.-.',
  '=': '-...-',
  '+': '.-.-.',
  '-': '-....-',
  '_': '..--.-',
  '"': '.-..-.',
  '$': '...-..-',
  '@': '.--.-.',
};

const REVERSE_MORSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([char, code]) => [code, char]),
);

export function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split('')
    .map((char) => {
      if (char === ' ') {
        return '/';
      }
      return MORSE_MAP[char] ?? '?';
    })
    .join(' ');
}

export function morseToText(morse: string): string {
  return morse
    .trim()
    .split(' / ')
    .map(word =>
      word
        .trim()
        .split(' ')
        .map((code) => {
          if (code === '') {
            return '';
          }
          return REVERSE_MORSE_MAP[code] ?? '?';
        })
        .join(''),
    )
    .join(' ');
}
