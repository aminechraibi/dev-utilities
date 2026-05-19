<script setup lang="ts">
import { countBusinessDays, addBusinessDays } from './business-days-calculator.service';

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
  if (!countStart.value || !countEnd.value) return null;
  try { return countBusinessDays(countStart.value, countEnd.value, holidays.value); }
  catch { return null; }
});

// Add mode
const addDate = ref(today);
const daysToAdd = ref(10);

const resultDate = computed(() => {
  if (!addDate.value || daysToAdd.value === null) return null;
  try { return addBusinessDays(addDate.value, daysToAdd.value, holidays.value); }
  catch { return null; }
});
</script>

<template>
  <div flex flex-col gap-3>
    <c-card>
      <div mb-3 font-bold text-lg>Count business days between two dates</div>
      <div flex gap-3 flex-wrap mb-3>
        <div flex flex-col gap-1>
          <label text-sm op-70>Start date</label>
          <input type="date" v-model="countStart" class="px-3 py-2 rounded border border-solid" />
        </div>
        <div flex flex-col gap-1>
          <label text-sm op-70>End date</label>
          <input type="date" v-model="countEnd" class="px-3 py-2 rounded border border-solid" />
        </div>
      </div>
      <c-alert v-if="businessDayCount !== null">
        Business days: <strong>{{ businessDayCount }}</strong>
      </c-alert>
    </c-card>

    <c-card>
      <div mb-3 font-bold text-lg>Add business days to a date</div>
      <div flex gap-3 flex-wrap mb-3>
        <div flex flex-col gap-1>
          <label text-sm op-70>Start date</label>
          <input type="date" v-model="addDate" class="px-3 py-2 rounded border border-solid" />
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
      <div mb-3 font-bold text-lg>Holidays (optional)</div>
      <div mb-2 text-sm op-70>Enter holiday dates (one per line, format: YYYY-MM-DD). These apply to both calculators above.</div>
      <textarea
        v-model="holidaysText"
        placeholder="e.g. 2026-01-01&#10;2026-12-25"
        class="w-full px-3 py-2 rounded border border-solid font-mono text-sm"
        rows="4"
      />
      <div v-if="holidays.length > 0" mt-2 text-sm op-70>
        {{ holidays.length }} holiday{{ holidays.length !== 1 ? 's' : '' }} recognized
      </div>
    </c-card>
  </div>
</template>
