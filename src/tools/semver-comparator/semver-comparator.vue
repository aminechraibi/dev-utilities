<script setup lang="ts">
import { type ParsedSemver, compareSemver, parseSemver, satisfiesRange } from './semver-comparator.service';
import { withDefaultOnError } from '@/utils/defaults';

const versionA = ref('1.2.3');
const versionB = ref('1.3.0-alpha.1');
const rangeVersion = ref('1.5.2');
const rangeInput = ref('^1.0.0');

const parsedA = computed<ParsedSemver | null>(() =>
  withDefaultOnError(() => parseSemver(versionA.value), null),
);

const parsedB = computed<ParsedSemver | null>(() =>
  withDefaultOnError(() => parseSemver(versionB.value), null),
);

const compareResult = computed(() => {
  if (!parsedA.value || !parsedB.value) {
    return null;
  }
  return withDefaultOnError(() => compareSemver(versionA.value, versionB.value), null);
});

const compareLabel = computed(() => {
  if (compareResult.value === null) {
    return '';
  }
  if (compareResult.value === 0) {
    return `${versionA.value} == ${versionB.value}`;
  }
  if (compareResult.value < 0) {
    return `${versionA.value} < ${versionB.value}`;
  }
  return `${versionA.value} > ${versionB.value}`;
});

const compareType = computed<'success' | 'warning' | 'info'>(() => {
  if (compareResult.value === null) {
    return 'info';
  }
  if (compareResult.value === 0) {
    return 'success';
  }
  return 'warning';
});

const rangeResult = computed(() => {
  if (!rangeVersion.value.trim() || !rangeInput.value.trim()) {
    return null;
  }
  return withDefaultOnError(() => satisfiesRange(rangeVersion.value, rangeInput.value), null);
});

function parsedToItems(p: ParsedSemver | null) {
  if (!p) {
    return [];
  }
  return [
    { label: 'Major', value: String(p.major) },
    { label: 'Minor', value: String(p.minor) },
    { label: 'Patch', value: String(p.patch) },
    { label: 'Pre-release', value: p.prerelease || '(none)', hideOnNil: false },
    { label: 'Build metadata', value: p.build || '(none)', hideOnNil: false },
  ];
}
</script>

<template>
  <div flex flex-col gap-3>
    <c-card title="Parse Version">
      <div flex gap-3>
        <div flex-1>
          <c-input-text
            v-model:value="versionA"
            label="Version A"
            placeholder="e.g. 1.2.3"

            autofocus font-mono
          />
          <c-key-value-list v-if="parsedA" mt-3 :items="parsedToItems(parsedA)" />
          <c-alert v-else-if="versionA" type="error" mt-2>
            Invalid semver
          </c-alert>
        </div>
        <div flex-1>
          <c-input-text
            v-model:value="versionB"
            label="Version B"
            placeholder="e.g. 2.0.0-beta.1"
            font-mono
          />
          <c-key-value-list v-if="parsedB" mt-3 :items="parsedToItems(parsedB)" />
          <c-alert v-else-if="versionB" type="error" mt-2>
            Invalid semver
          </c-alert>
        </div>
      </div>
    </c-card>

    <c-card title="Compare Versions">
      <div v-if="compareResult !== null" flex justify-center>
        <n-tag :type="compareType" size="large" font-mono>
          {{ compareLabel }}
        </n-tag>
      </div>
      <c-alert v-else type="info">
        Enter two valid semver versions above to compare them.
      </c-alert>
    </c-card>

    <c-card title="Range Check">
      <div mb-3 flex gap-3>
        <c-input-text
          v-model:value="rangeVersion"
          label="Version"
          placeholder="e.g. 1.5.2"

          flex-1 font-mono
        />
        <c-input-text
          v-model:value="rangeInput"
          label="Range"
          placeholder="e.g. ^1.0.0, ~2.1.0, >=1.0.0"

          flex-1 font-mono
        />
      </div>
      <div v-if="rangeResult !== null" flex justify-center>
        <n-tag :type="rangeResult ? 'success' : 'error'" size="large">
          {{ rangeVersion }} {{ rangeResult ? 'satisfies' : 'does NOT satisfy' }} {{ rangeInput }}
        </n-tag>
      </div>
    </c-card>
  </div>
</template>
