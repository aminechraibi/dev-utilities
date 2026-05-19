<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { generateLicense, getLicenseList } from './license-generator.service';

const licenseOptions = getLicenseList().map(({ key, name }) => ({ label: name, value: key }));
const selectedLicense = ref('MIT');
const year = ref(String(new Date().getFullYear()));
const author = ref('');

const licenseText = computed(() => {
  try {
    return generateLicense(selectedLicense.value, year.value, author.value || 'Your Name');
  }
  catch {
    return '';
  }
});

const { copy } = useCopy({ source: licenseText, text: 'License text copied to clipboard' });

function download() {
  const blob = new Blob([licenseText.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'LICENSE';
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div flex flex-col gap-3>
    <c-select
      v-model:value="selectedLicense"
      :options="licenseOptions"
      label="License"
      searchable
    />
    <div flex gap-3>
      <c-input-text v-model:value="year" label="Year" placeholder="2024" style="flex:0 0 120px" />
      <c-input-text v-model:value="author" label="Author / Organization" placeholder="Your Name" style="flex:1" />
    </div>
    <c-input-text
      :value="licenseText"
      label="License text"
      multiline
      readonly
      :rows="16"
      font-mono
    />
    <div flex justify-center gap-3>
      <c-button @click="copy()">
        Copy license
      </c-button>
      <c-button @click="download()">
        Download LICENSE file
      </c-button>
    </div>
  </div>
</template>
