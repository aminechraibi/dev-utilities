export function bitwiseOp(a: number, b: number, op: string): number {
  switch (op) {
    case 'AND': return (a & b) >>> 0;
    case 'OR': return (a | b) >>> 0;
    case 'XOR': return (a ^ b) >>> 0;
    case 'NOT_A': return (~a) >>> 0;
    case 'NOT_B': return (~b) >>> 0;
    case 'LSHIFT': return (a << b) >>> 0;
    case 'RSHIFT': return (a >>> b);
    default: return 0;
  }
}

export function toBinary(n: number, bits: number): string {
  const unsigned = n >>> 0;
  return (unsigned >>> 0).toString(2).padStart(bits, '0').slice(-bits);
}

export function toHex(n: number): string {
  return (n >>> 0).toString(16).toUpperCase().padStart(8, '0');
}
