<script setup lang="ts">
import { computed } from 'vue';
import { useStorage } from '@vueuse/core';
import { calculateStatistics, parseNumbers } from './statistics-calculator.service';

const input = useStorage('statistics-calculator:input', '4, 7, 13, 2, 1, 7, 9, 15, 3, 7');

const stats = computed(() => {
  try {
    const nums = parseNumbers(input.value);
    if (nums.length === 0) return null;
    return calculateStatistics(nums);
  }
  catch {
    return null;
  }
});

const fmt = (n: number) => Number.isInteger(n) ? String(n) : n.toFixed(4);

const items = computed(() => {
  if (!stats.value) return [];
  const s = stats.value;
  return [
    { label: 'Count', value: String(s.count) },
    { label: 'Sum', value: fmt(s.sum) },
    { label: 'Minimum', value: fmt(s.min) },
    { label: 'Maximum', value: fmt(s.max) },
    { label: 'Range', value: fmt(s.range) },
    { label: 'Mean (Average)', value: fmt(s.mean) },
    { label: 'Median', value: fmt(s.median) },
    { label: 'Mode', value: s.mode.map(fmt).join(', ') },
    { label: 'Variance', value: fmt(s.variance) },
    { label: 'Std Deviation', value: fmt(s.stdDev) },
    { label: 'Q1 (25th percentile)', value: fmt(s.q1) },
    { label: 'Q3 (75th percentile)', value: fmt(s.q3) },
    { label: 'IQR', value: fmt(s.iqr) },
  ];
});
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="input"
      multiline
      :rows="4"
      label="Numbers (comma, space or newline separated)"
      placeholder="4, 7, 13, 2, 1, 7, 9..."
      autofocus
      mb-3
    />

    <c-alert v-if="!stats" type="warning">
      Enter numbers above to calculate statistics
    </c-alert>

    <table v-else class="stats-table">
      <thead>
        <tr>
          <th>Statistic</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.label">
          <td class="stat-label">
            {{ item.label }}
          </td>
          <td class="stat-value">
            {{ item.value }}
          </td>
        </tr>
      </tbody>
    </table>
  </c-card>
</template>

<style lang="less" scoped>
.stats-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th {
    text-align: left;
    padding: 7px 12px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    opacity: 0.45;
    border-bottom: 2px solid rgba(128, 128, 128, 0.15);
  }

  tr:not(:last-child) td {
    border-bottom: 1px solid rgba(128, 128, 128, 0.08);
  }

  tr:hover td {
    background: rgba(128, 128, 128, 0.04);
  }
}

.stat-label {
  padding: 8px 12px;
  opacity: 0.75;
}

.stat-value {
  padding: 8px 12px;
  font-family: monospace;
  font-weight: 600;
  text-align: right;
}
</style>
