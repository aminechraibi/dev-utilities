<script setup lang="ts">
import { calculateDateDiff } from './date-difference-calculator.service';

function nowLocal() {
  const d = new Date();
  d.setSeconds(0, 0);
  return d.toISOString().slice(0, 16);
}

const dateA = ref(nowLocal());
const dateB = ref('2020-01-01T00:00');

const diff = computed(() => {
  if (!dateA.value || !dateB.value) return null;
  try { return calculateDateDiff(dateA.value, dateB.value); }
  catch { return null; }
});

const rows = computed(() => {
  if (!diff.value) return [];
  const d = diff.value;
  return [
    { label: 'Breakdown', value: d.breakdown, highlight: true },
    { label: 'Total years', value: d.totalYears.toLocaleString() },
    { label: 'Total months', value: d.totalMonths.toLocaleString() },
    { label: 'Total weeks', value: d.totalWeeks.toLocaleString() },
    { label: 'Total days', value: d.totalDays.toLocaleString() },
    { label: 'Total hours', value: d.totalHours.toLocaleString() },
    { label: 'Total minutes', value: d.totalMinutes.toLocaleString() },
    { label: 'Total seconds', value: d.totalSeconds.toLocaleString() },
  ];
});
</script>

<template>
  <c-card>
    <div class="inputs-row">
      <div class="dt-field">
        <label class="dt-label">Date & Time A</label>
        <input v-model="dateA" type="datetime-local" class="dt-input">
      </div>
      <div class="dt-sep">
        →
      </div>
      <div class="dt-field">
        <label class="dt-label">Date & Time B</label>
        <input v-model="dateB" type="datetime-local" class="dt-input">
      </div>
    </div>

    <template v-if="diff">
      <table class="diff-table">
        <thead>
          <tr>
            <th>Unit</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.label" :class="{ highlight: row.highlight }">
            <td class="diff-label">
              {{ row.label }}
            </td>
            <td class="diff-value">
              {{ row.value }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <c-alert v-else type="warning" mt-3>
      Enter two dates above
    </c-alert>
  </c-card>
</template>

<style lang="less" scoped>
.inputs-row {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.dt-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  min-width: 200px;
}

.dt-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  opacity: 0.45;
}

.dt-input {
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid rgba(128, 128, 128, 0.25);
  background: rgba(128, 128, 128, 0.04);
  color: inherit;
  font-size: 13px;
  font-family: monospace;
  outline: none;
  transition: border-color 0.15s;
  &:focus { border-color: #3b82f6; }
}

.dt-sep {
  font-size: 20px;
  opacity: 0.35;
  padding-bottom: 6px;
  flex-shrink: 0;
}

.diff-table {
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
    opacity: 0.4;
    border-bottom: 2px solid rgba(128, 128, 128, 0.15);
  }

  tr:not(:last-child) td {
    border-bottom: 1px solid rgba(128, 128, 128, 0.08);
  }

  tr:hover td { background: rgba(128, 128, 128, 0.04); }

  tr.highlight td {
    background: rgba(59, 130, 246, 0.06);
    border-bottom: 2px solid rgba(128, 128, 128, 0.15) !important;
  }
}

.diff-label {
  padding: 9px 12px;
  opacity: 0.7;
  width: 160px;
}

.diff-value {
  padding: 9px 12px;
  font-family: monospace;
  font-weight: 600;
  text-align: right;
}
</style>
