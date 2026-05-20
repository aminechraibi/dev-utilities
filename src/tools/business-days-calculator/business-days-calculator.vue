<script setup lang="ts">
import { addBusinessDays, countBusinessDays } from './business-days-calculator.service';

const today = new Date().toISOString().split('T')[0];

// Count mode
const countStart = ref(today);
const countEnd = ref(today);
const holidaysText = ref('');

const holidays = computed(() =>
  holidaysText.value
    .split('\n')
    .map(l => l.trim())
    .filter(l => /^\d{4}-\d{2}-\d{2}$/.test(l)),
);

const businessDayCount = computed(() => {
  if (!countStart.value || !countEnd.value) {
    return null;
  }
  try {
    return countBusinessDays(countStart.value, countEnd.value, holidays.value);
  }
  catch {
    return null;
  }
});

// Add mode
const addDate = ref(today);
const daysToAdd = ref(10);

const resultDate = computed(() => {
  if (!addDate.value || daysToAdd.value === null) {
    return null;
  }
  try {
    return addBusinessDays(addDate.value, daysToAdd.value, holidays.value);
  }
  catch {
    return null;
  }
});
</script>

<template>
  <div flex flex-col gap-3>
    <c-card>
      <div mb-3 text-lg font-bold>
        Count business days between two dates
      </div>
      <div mb-3 flex flex-wrap gap-3>
        <div flex flex-col gap-1>
          <label text-sm op-70>Start date</label>
          <input v-model="countStart" type="date" class="border rounded border-solid px-3 py-2">
        </div>
        <div flex flex-col gap-1>
          <label text-sm op-70>End date</label>
          <input v-model="countEnd" type="date" class="border rounded border-solid px-3 py-2">
        </div>
      </div>
      <c-alert v-if="businessDayCount !== null">
        Business days: <strong>{{ businessDayCount }}</strong>
      </c-alert>
    </c-card>

    <c-card>
      <div mb-3 text-lg font-bold>
        Add business days to a date
      </div>
      <div mb-3 flex flex-wrap gap-3>
        <div flex flex-col gap-1>
          <label text-sm op-70>Start date</label>
          <input v-model="addDate" type="date" class="border rounded border-solid px-3 py-2">
        </div>
        <div flex flex-col gap-1>
          <label text-sm op-70>Business days to add</label>
          <n-input-number v-model:value="daysToAdd" style="width:180px" />
        </div>
      </div>
      <c-alert v-if="resultDate">
        Result date: <strong>{{ resultDate }}</strong>
      </c-alert>
    </c-card>

    <c-card>
      <div mb-3 text-lg font-bold>
        Holidays (optional)
      </div>
      <div mb-2 text-sm op-70>
        Enter holiday dates (one per line, format: YYYY-MM-DD). These apply to both calculators above.
      </div>
      <textarea
        v-model="holidaysText"
        placeholder="e.g. 2026-01-01&#10;2026-12-25"
        class="w-full border rounded border-solid px-3 py-2 text-sm font-mono"
        rows="4"
      />
      <div v-if="holidays.length > 0" mt-2 text-sm op-70>
        {{ holidays.length }} holiday{{ holidays.length !== 1 ? 's' : '' }} recognized
      </div>
    </c-card>
  </div>
</template>
