<script setup lang="ts">
import { bitwiseOp, toBinary, toHex } from './binary-calculator.service';

const inputA = ref(0b10110100);
const inputB = ref(0b00111010);
const operation = ref('AND');
const bitWidth = ref(8);

const operations = [
  { label: 'AND', value: 'AND' },
  { label: 'OR', value: 'OR' },
  { label: 'XOR', value: 'XOR' },
  { label: 'NOT A', value: 'NOT_A' },
  { label: 'NOT B', value: 'NOT_B' },
  { label: 'Left Shift (A << B)', value: 'LSHIFT' },
  { label: 'Right Shift (A >> B)', value: 'RSHIFT' },
];

const bitWidthOptions = [
  { label: '8-bit', value: 8 },
  { label: '16-bit', value: 16 },
  { label: '32-bit', value: 32 },
];

const result = computed(() => bitwiseOp(inputA.value, inputB.value, operation.value));

const resultBinary = computed(() => toBinary(result.value, bitWidth.value));
const resultHex = computed(() => toHex(result.value));
const resultDecimal = computed(() => (result.value >>> 0).toString(10));

const aBinary = computed(() => toBinary(inputA.value, bitWidth.value));
const bBinary = computed(() => toBinary(inputB.value, bitWidth.value));

function parseBinaryInput(val: string): number {
  const clean = val.replace(/[^01]/g, '').slice(0, bitWidth.value);
  return clean ? Number.parseInt(clean, 2) : 0;
}

const inputABin = ref(toBinary(inputA.value, 8));
const inputBBin = ref(toBinary(inputB.value, 8));

watch(inputA, (v) => {
  inputABin.value = toBinary(v, bitWidth.value);
});
watch(inputB, (v) => {
  inputBBin.value = toBinary(v, bitWidth.value);
});
watch(bitWidth, () => {
  inputABin.value = toBinary(inputA.value, bitWidth.value);
  inputBBin.value = toBinary(inputB.value, bitWidth.value);
});

function onABinInput(val: string) {
  inputABin.value = val;
  inputA.value = parseBinaryInput(val);
}

function onBBinInput(val: string) {
  inputBBin.value = val;
  inputB.value = parseBinaryInput(val);
}

const singleOperand = computed(() => operation.value === 'NOT_A' || operation.value === 'NOT_B');

const bitGroups = computed(() => {
  const bits = resultBinary.value;
  const groups: Array<{ bit: string; index: number }[]> = [];
  for (let i = 0; i < bits.length; i += 8) {
    const group = [];
    for (let j = i; j < i + 8 && j < bits.length; j++) {
      group.push({ bit: bits[j], index: j });
    }
    groups.push(group);
  }
  return groups;
});
</script>

<template>
  <div flex flex-col gap-3>
    <c-card title="Inputs">
      <div mb-3 flex gap-3>
        <div flex-1>
          <div mb-1 text-sm font-semibold>
            Value A
          </div>
          <n-input-number v-model:value="inputA" :min="0" :max="4294967295" w-full />
          <c-input-text
            :value="inputABin"
            placeholder="Binary (e.g. 10110100)"
            mt-2
            font-mono
            @update:value="onABinInput"
          />
          <div mt-1 text-xs op-60>
            Hex: 0x{{ toHex(inputA) }} | Dec: {{ inputA }}
          </div>
        </div>

        <div flex-1 :class="{ 'op-40 pointer-events-none': operation === 'NOT_A' }">
          <div mb-1 text-sm font-semibold>
            Value B
          </div>
          <n-input-number v-model:value="inputB" :min="0" :max="4294967295" w-full />
          <c-input-text
            :value="inputBBin"
            placeholder="Binary (e.g. 00111010)"
            mt-2
            font-mono
            @update:value="onBBinInput"
          />
          <div mt-1 text-xs op-60>
            Hex: 0x{{ toHex(inputB) }} | Dec: {{ inputB }}
          </div>
        </div>
      </div>

      <div flex items-center gap-3>
        <div flex-1>
          <div mb-1 text-sm font-semibold>
            Operation
          </div>
          <c-select v-model:value="operation" :options="operations" w-full />
        </div>
        <div flex-1>
          <div mb-1 text-sm font-semibold>
            Bit width
          </div>
          <c-select v-model:value="bitWidth" :options="bitWidthOptions" w-full />
        </div>
      </div>
    </c-card>

    <c-card title="Result">
      <table class="result-table">
        <tbody>
          <tr>
            <td class="res-label">
              Decimal
            </td>
            <td class="res-value">
              {{ resultDecimal }}
            </td>
          </tr>
          <tr>
            <td class="res-label">
              Hexadecimal
            </td>
            <td class="res-value">
              0x{{ resultHex }}
            </td>
          </tr>
          <tr>
            <td class="res-label">
              Binary
            </td>
            <td class="res-value">
              {{ resultBinary }}
            </td>
          </tr>
        </tbody>
      </table>
    </c-card>

    <c-card title="Bit representation">
      <div mb-2 text-xs op-60>
        Bit visualization ({{ bitWidth }}-bit) — 1 = active, 0 = inactive
      </div>
      <div flex flex-wrap gap-2>
        <div
          v-for="(group, gi) in bitGroups"
          :key="gi"
          flex gap-1
        >
          <div
            v-for="cell in group"
            :key="cell.index"

            h-8 w-8 flex items-center justify-center rounded text-sm font-bold font-mono
            :class="cell.bit === '1' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 op-50'"
          >
            {{ cell.bit }}
          </div>
          <div v-if="gi < bitGroups.length - 1" mx-1 w-px self-stretch bg-gray-300 />
        </div>
      </div>
      <div mt-1 flex flex-wrap gap-2>
        <div
          v-for="i in bitWidth"
          :key="i"
          w-8 text-center text-xs op-40
        >
          {{ bitWidth - i }}
        </div>
      </div>
    </c-card>

    <c-card title="Operation breakdown">
      <div text-sm font-mono>
        <div v-if="!singleOperand" mb-1 flex items-center gap-2>
          <span w-12 op-60>A</span>
          <span>{{ aBinary }}</span>
        </div>
        <div v-if="!singleOperand" mb-1 flex items-center gap-2>
          <span w-12 op-60>B</span>
          <span>{{ bBinary }}</span>
        </div>
        <n-divider v-if="!singleOperand" style="margin: 6px 0" />
        <div flex items-center gap-2>
          <span w-12 text-primary font-bold>= </span>
          <span>{{ resultBinary }}</span>
        </div>
      </div>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.bg-primary {
  background-color: #3b82f6 !important;
}
.text-primary {
  color: #3b82f6;
}

.result-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  tr:not(:last-child) td {
    border-bottom: 1px solid rgba(128, 128, 128, 0.08);
  }

  tr:hover td {
    background: rgba(128, 128, 128, 0.04);
  }
}

.res-label {
  padding: 8px 12px;
  opacity: 0.65;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: 140px;
}

.res-value {
  padding: 8px 12px;
  font-family: monospace;
  font-weight: 600;
  word-break: break-all;
}
</style>
