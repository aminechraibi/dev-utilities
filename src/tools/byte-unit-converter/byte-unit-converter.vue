<script setup lang="ts">
import _ from 'lodash';
import {
  bytesToKB, bytesToMB, bytesToGB, bytesToTB, bytesToPB,
  kbToBytes, mbToBytes, gbToBytes, tbToBytes, pbToBytes,
  bytesToKiB, bytesToMiB, bytesToGiB, bytesToTiB, bytesToPiB,
  kibToBytes, mibToBytes, gibToBytes, tibToBytes, pibToBytes,
} from './byte-unit-converter.service';

type UnitKey = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'KiB' | 'MiB' | 'GiB' | 'TiB' | 'PiB';

const units = reactive<Record<UnitKey, { label: string; ref: number | null; toBytes: (v: number) => number; fromBytes: (v: number) => number }>>({
  B: { label: 'Byte (B)', ref: 0, toBytes: v => v, fromBytes: v => v },
  KB: { label: 'Kilobyte (KB)', ref: 0, toBytes: kbToBytes, fromBytes: bytesToKB },
  MB: { label: 'Megabyte (MB)', ref: 0, toBytes: mbToBytes, fromBytes: bytesToMB },
  GB: { label: 'Gigabyte (GB)', ref: 0, toBytes: gbToBytes, fromBytes: bytesToGB },
  TB: { label: 'Terabyte (TB)', ref: 0, toBytes: tbToBytes, fromBytes: bytesToTB },
  PB: { label: 'Petabyte (PB)', ref: 0, toBytes: pbToBytes, fromBytes: bytesToPB },
  KiB: { label: 'Kibibyte (KiB)', ref: 0, toBytes: kibToBytes, fromBytes: bytesToKiB },
  MiB: { label: 'Mebibyte (MiB)', ref: 0, toBytes: mibToBytes, fromBytes: bytesToMiB },
  GiB: { label: 'Gibibyte (GiB)', ref: 0, toBytes: gibToBytes, fromBytes: bytesToGiB },
  TiB: { label: 'Tebibyte (TiB)', ref: 0, toBytes: tibToBytes, fromBytes: bytesToTiB },
  PiB: { label: 'Pebibyte (PiB)', ref: 0, toBytes: pibToBytes, fromBytes: bytesToPiB },
});

const decimalKeys: UnitKey[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
const binaryKeys: UnitKey[] = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB'];

function update(key: UnitKey) {
  const value = units[key].ref;
  if (value === null || value === undefined) {
    return;
  }
  const bytes = units[key].toBytes(value);

  _.chain(units)
    .omit(key)
    .forEach(({ fromBytes }, k) => {
      units[k as UnitKey].ref = fromBytes(bytes);
    })
    .value();
}

update('B');
</script>

<template>
  <div>
    <div mb-2 text-sm font-semibold op-60>
      Decimal (SI) — powers of 1000
    </div>
    <n-input-group v-for="key in decimalKeys" :key="key" mb-3 w-full>
      <n-input-group-label style="width: 160px">
        {{ units[key].label }}
      </n-input-group-label>
      <n-input-number
        v-model:value="units[key].ref"
        style="flex: 1"
        :min="0"
        :show-button="false"
        @update:value="() => update(key)"
      />
    </n-input-group>

    <n-divider />

    <div mb-2 text-sm font-semibold op-60>
      Binary (IEC) — powers of 1024
    </div>
    <n-input-group v-for="key in binaryKeys" :key="key" mb-3 w-full>
      <n-input-group-label style="width: 160px">
        {{ units[key].label }}
      </n-input-group-label>
      <n-input-number
        v-model:value="units[key].ref"
        style="flex: 1"
        :min="0"
        :show-button="false"
        @update:value="() => update(key)"
      />
    </n-input-group>
  </div>
</template>
