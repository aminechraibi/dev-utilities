const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const scales = [
  '', 'thousand', 'million', 'billion', 'trillion', 'quadrillion',
];

function convertHundreds(n: number): string {
  if (n === 0) {
    return '';
  }
  let result = '';
  if (n >= 100) {
    result += `${ones[Math.floor(n / 100)]} hundred`;
    n %= 100;
    if (n > 0) {
      result += ' ';
    }
  }
  if (n >= 20) {
    result += tens[Math.floor(n / 10)];
    if (n % 10 > 0) {
      result += `-${ones[n % 10]}`;
    }
  }
  else {
    result += ones[n];
  }
  return result;
}

export function numberToWords(n: number): string {
  if (!Number.isFinite(n)) {
    return 'not a number';
  }

  if (n === 0) {
    return 'zero';
  }

  const negative = n < 0;
  const absN = Math.abs(n);

  // Handle decimals
  const intPart = Math.floor(absN);
  const decStr = absN.toString().split('.')[1];

  let result = integerToWords(intPart);

  if (decStr) {
    result += ` point ${decStr.split('').map(d => ones[+d] || 'zero').join(' ')}`;
  }

  return negative ? `negative ${result}` : result;
}

function integerToWords(n: number): string {
  if (n === 0) {
    return 'zero';
  }

  const parts: string[] = [];
  let scaleIndex = 0;

  while (n > 0) {
    const chunk = n % 1000;
    if (chunk !== 0) {
      const chunkWords = convertHundreds(chunk);
      parts.unshift(scales[scaleIndex] ? `${chunkWords} ${scales[scaleIndex]}` : chunkWords);
    }
    n = Math.floor(n / 1000);
    scaleIndex++;
  }

  return parts.join(', ');
}

const ordinalExceptions: Record<string, string> = {
  one: 'first',
  two: 'second',
  three: 'third',
  four: 'fourth',
  five: 'fifth',
  six: 'sixth',
  seven: 'seventh',
  eight: 'eighth',
  nine: 'ninth',
  ten: 'tenth',
  eleven: 'eleventh',
  twelve: 'twelfth',
  thirteen: 'thirteenth',
  fourteen: 'fourteenth',
  fifteen: 'fifteenth',
  sixteen: 'sixteenth',
  seventeen: 'seventeenth',
  eighteen: 'eighteenth',
  nineteen: 'nineteenth',
  twenty: 'twentieth',
  thirty: 'thirtieth',
  forty: 'fortieth',
  fifty: 'fiftieth',
  sixty: 'sixtieth',
  seventy: 'seventieth',
  eighty: 'eightieth',
  ninety: 'ninetieth',
};

export function numberToOrdinal(n: number): string {
  if (!Number.isFinite(n) || n !== Math.floor(n) || n < 0) {
    return 'not applicable';
  }

  if (n === 0) {
    return 'zeroth';
  }

  const words = numberToWords(n);
  // Find the last word to apply ordinal suffix
  const lastWord = words.split(/[\s-]/).pop() ?? '';
  const ordinal = ordinalExceptions[lastWord];

  if (ordinal) {
    // Replace the last occurrence of lastWord with ordinal form
    const lastIdx = words.lastIndexOf(lastWord);
    return words.slice(0, lastIdx) + ordinal;
  }

  // Default: add 'th'
  return `${words}th`;
}
