<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { categories } from './unit-converter.service';

const selectedCategory = ref('Length');

const category = computed(() => categories.find(c => c.name === selectedCategory.value)!);

const categoryOptions = categories.map(c => ({ label: c.name, value: c.name }));

const values = reactive<Record<string, number>>({});

watch(
  selectedCategory,
  () => {
    Object.keys(values).forEach(k => delete values[k]);
    category.value.units.forEach((u) => { values[u.symbol] = 0; });
  },
  { immediate: true },
);

function update(changedSymbol: string) {
  const unit = category.value.units.find(u => u.symbol === changedSymbol)!;
  const baseValue = (values[changedSymbol] ?? 0) * unit.toBase;
  category.value.units.forEach((u) => {
    if (u.symbol !== changedSymbol) {
      values[u.symbol] = Math.round((baseValue / u.toBase) * 1e10) / 1e10;
    }
  });
}
</script>

<template>
  <c-card>
    <c-select v-model:value="selectedCategory" :options="categoryOptions" label="Category" mb-4 />
    <n-input-group v-for="unit in category.units" :key="unit.symbol" mb-3 w-full>
      <n-input-group-label style="width: 140px">
        {{ unit.name }}
      </n-input-group-label>
      <n-input-number
        v-model:value="values[unit.symbol]"
        style="flex: 1"
        @update:value="() => update(unit.symbol)"
      />
      <n-input-group-label style="width: 70px">
        {{ unit.symbol }}
      </n-input-group-label>
    </n-input-group>
  </c-card>
</template>
