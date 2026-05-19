// Decimal (SI) - powers of 1000
export const bytesToKB = (b: number) => b / 1_000;
export const bytesToMB = (b: number) => b / 1_000_000;
export const bytesToGB = (b: number) => b / 1_000_000_000;
export const bytesToTB = (b: number) => b / 1_000_000_000_000;
export const bytesToPB = (b: number) => b / 1_000_000_000_000_000;

export const kbToBytes = (kb: number) => kb * 1_000;
export const mbToBytes = (mb: number) => mb * 1_000_000;
export const gbToBytes = (gb: number) => gb * 1_000_000_000;
export const tbToBytes = (tb: number) => tb * 1_000_000_000_000;
export const pbToBytes = (pb: number) => pb * 1_000_000_000_000_000;

// Binary (IEC) - powers of 1024
export const bytesToKiB = (b: number) => b / 1_024;
export const bytesToMiB = (b: number) => b / (1_024 ** 2);
export const bytesToGiB = (b: number) => b / (1_024 ** 3);
export const bytesToTiB = (b: number) => b / (1_024 ** 4);
export const bytesToPiB = (b: number) => b / (1_024 ** 5);

export const kibToBytes = (kib: number) => kib * 1_024;
export const mibToBytes = (mib: number) => mib * (1_024 ** 2);
export const gibToBytes = (gib: number) => gib * (1_024 ** 3);
export const tibToBytes = (tib: number) => tib * (1_024 ** 4);
export const pibToBytes = (pib: number) => pib * (1_024 ** 5);
