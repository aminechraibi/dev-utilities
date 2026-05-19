<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { useRafFn } from '@vueuse/core';
import { defaultTimezones, allTimezones, getTimeInZone, type TimezoneEntry } from './world-clock.service';

const zones = useStorage<TimezoneEntry[]>('world-clock:zones', defaultTimezones);
const now = ref(new Date());
useRafFn(() => { now.value = new Date(); }, { fpsLimit: 1 });

const addZone = ref('');
const timezoneOptions = allTimezones.map(z => ({ label: z.replace(/_/g, ' '), value: z }));

function add() {
  if (addZone.value && !zones.value.find(z => z.zone === addZone.value)) {
    zones.value.push({ zone: addZone.value, label: addZone.value.split('/').pop()?.replace(/_/g, ' ') ?? addZone.value });
    addZone.value = '';
  }
}
function remove(zone: string) {
  zones.value = zones.value.filter(z => z.zone !== zone);
}
</script>

<template>
  <div flex flex-col gap-3>
    <div flex gap-2 flex-wrap>
      <n-select v-model:value="addZone" :options="timezoneOptions" placeholder="Add timezone..." filterable style="width:260px" />
      <c-button :disabled="!addZone" @click="add()">Add</c-button>
    </div>
    <div flex flex-wrap gap-3>
      <c-card v-for="tz in zones" :key="tz.zone" style="min-width:180px;flex:1">
        <div flex justify-between items-start mb-1>
          <span font-bold>{{ tz.label }}</span>
          <span cursor-pointer op-50 hover:op-100 @click="remove(tz.zone)">✕</span>
        </div>
        <div font-mono text-2xl>{{ getTimeInZone(tz.zone, now).time }}</div>
        <div text-sm op-70>{{ getTimeInZone(tz.zone, now).date }}</div>
        <div text-xs op-50>{{ getTimeInZone(tz.zone, now).offset }}</div>
      </c-card>
    </div>
  </div>
</template>
