<script setup lang="ts">
import {
  addDurations,
  formatDuration,
  fromTotalSeconds,
  subtractDurations,
  toTotalSeconds,
} from './duration-calculator.service';

const durationA = reactive({ hours: 1, minutes: 30, seconds: 0 });
const durationB = reactive({ hours: 0, minutes: 45, seconds: 30 });

const sum = computed(() => addDurations(durationA, durationB));
const diff = computed(() => subtractDurations(durationA, durationB));

const sumSeconds = computed(() => toTotalSeconds(sum.value));
const diffSeconds = computed(() => toTotalSeconds(diff.value));

function secondsToMinutes(s: number) {
  return (s / 60).toFixed(4);
}
function secondsToHours(s: number) {
  return (s / 3600).toFixed(6);
}
function secondsToDays(s: number) {
  return (s / 86400).toFixed(8);
}

const sumConversions = computed(() => {
  const s = Math.abs(sumSeconds.value);
  return [
    { label: 'Total seconds', value: sumSeconds.value },
    { label: 'Total minutes', value: secondsToMinutes(sumSeconds.value) },
    { label: 'Total hours', value: secondsToHours(sumSeconds.value) },
    { label: 'Total days', value: secondsToDays(sumSeconds.value) },
  ];
});

const diffConversions = computed(() => {
  return [
    { label: 'Total seconds', value: diffSeconds.value },
    { label: 'Total minutes', value: secondsToMinutes(diffSeconds.value) },
    { label: 'Total hours', value: secondsToHours(diffSeconds.value) },
    { label: 'Total days', value: secondsToDays(diffSeconds.value) },
  ];
});
</script>

<template>
  <div>
    <div flex gap-3 mb-3>
      <c-card title="Duration A" style="flex: 1">
        <div flex gap-2>
          <n-form-item label="Hours" style="flex: 1">
            <n-input-number v-model:value="durationA.hours" :min="-999" :max="999" w-full />
          </n-form-item>
          <n-form-item label="Minutes" style="flex: 1">
            <n-input-number v-model:value="durationA.minutes" :min="-59" :max="59" w-full />
          </n-form-item>
          <n-form-item label="Seconds" style="flex: 1">
            <n-input-number v-model:value="durationA.seconds" :min="-59" :max="59" w-full />
          </n-form-item>
        </div>
        <div text-center font-mono text-lg op-80>
          {{ formatDuration(durationA) }}
        </div>
      </c-card>

      <c-card title="Duration B" style="flex: 1">
        <div flex gap-2>
          <n-form-item label="Hours" style="flex: 1">
            <n-input-number v-model:value="durationB.hours" :min="-999" :max="999" w-full />
          </n-form-item>
          <n-form-item label="Minutes" style="flex: 1">
            <n-input-number v-model:value="durationB.minutes" :min="-59" :max="59" w-full />
          </n-form-item>
          <n-form-item label="Seconds" style="flex: 1">
            <n-input-number v-model:value="durationB.seconds" :min="-59" :max="59" w-full />
          </n-form-item>
        </div>
        <div text-center font-mono text-lg op-80>
          {{ formatDuration(durationB) }}
        </div>
      </c-card>
    </div>

    <div flex gap-3 mb-3>
      <c-card title="A + B (Sum)" style="flex: 1">
        <div text-center font-mono text-2xl mb-3>
          {{ formatDuration(sum) }}
        </div>
        <n-divider />
        <div v-for="item in sumConversions" :key="item.label" flex justify-between mb-1>
          <span op-70>{{ item.label }}</span>
          <span font-mono>{{ item.value }}</span>
        </div>
      </c-card>

      <c-card title="A - B (Difference)" style="flex: 1">
        <div text-center font-mono text-2xl mb-3>
          {{ formatDuration(diff) }}
        </div>
        <n-divider />
        <div v-for="item in diffConversions" :key="item.label" flex justify-between mb-1>
          <span op-70>{{ item.label }}</span>
          <span font-mono>{{ item.value }}</span>
        </div>
      </c-card>
    </div>
  </div>
</template>
