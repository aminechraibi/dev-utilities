<script setup lang="ts">
import { withDefaultOnError } from '@/utils/defaults';
import { parseCronExpression, isCronValid } from './cron-expression-parser.service';

const cronInput = ref('0 9 * * 1-5');

const examples = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Every day at 9am', value: '0 9 * * *' },
  { label: 'Weekdays at 9am', value: '0 9 * * 1-5' },
  { label: 'Every Sunday midnight', value: '0 0 * * 0' },
  { label: 'First of month', value: '0 0 1 * *' },
  { label: 'Every 15 minutes', value: '*/15 * * * *' },
  { label: 'Twice a day', value: '0 8,18 * * *' },
];

const isValid = computed(() => isCronValid(cronInput.value));

const parseResult = computed(() =>
  withDefaultOnError(() => {
    if (!isValid.value) return null;
    return parseCronExpression(cronInput.value);
  }, null),
);

const parseError = computed(() => {
  if (!cronInput.value.trim()) return null;
  if (isValid.value) return null;
  try {
    parseCronExpression(cronInput.value);
    return null;
  }
  catch (e: unknown) {
    return (e as Error).message;
  }
});

const validationRules = [
  {
    validator: (value: string) => !value.trim() || isCronValid(value),
    message: 'Invalid cron expression',
  },
];

function formatDate(date: Date): string {
  return date.toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}
</script>

<template>
  <c-card title="Cron Expression">
    <div flex gap-2 mb-3 style="flex-wrap: wrap">
      <span text-sm op-70 self-center>Examples:</span>
      <c-button
        v-for="ex in examples"
        :key="ex.value"
        size="small"
        @click="cronInput = ex.value"
      >
        {{ ex.label }}
      </c-button>
    </div>

    <c-input-text
      v-model:value="cronInput"
      placeholder="* * * * *"
      :validation-rules="validationRules"
      font-mono
      mb-3
    />

    <pre op-50 text-xs style="overflow: auto; padding: 8px 0; line-height: 1.6">
┌─────────── minute (0 - 59)
│ ┌─────────── hour (0 - 23)
│ │ ┌─────────── day of month (1 - 31)
│ │ │ ┌─────────── month (1 - 12)
│ │ │ │ ┌─────────── day of week (0 - 6, 0=Sunday)
│ │ │ │ │
* * * * *</pre>
  </c-card>

  <c-card v-if="parseResult" title="Human-readable Description">
    <div text-xl text-center py-2 style="font-weight: 500">
      {{ parseResult.description }}
    </div>
  </c-card>

  <c-alert v-else-if="parseError" type="error" mt-3>
    {{ parseError }}
  </c-alert>

  <c-card v-if="parseResult && parseResult.nextRuns.length > 0" title="Next 5 Scheduled Runs">
    <div
      v-for="(run, index) in parseResult.nextRuns"
      :key="index"
      flex
      items-center
      gap-3
      mb-2
      p-2
      style="border-radius: 6px; background: rgba(128,128,128,0.05)"
    >
      <n-tag type="info" size="small" style="min-width: 28px; justify-content: center">
        {{ index + 1 }}
      </n-tag>
      <span font-mono>{{ formatDate(run) }}</span>
    </div>
  </c-card>
</template>
