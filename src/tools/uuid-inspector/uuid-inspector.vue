<script setup lang="ts">
import { type UuidInspectResult, inspectUuid } from './uuid-inspector.service';
import { withDefaultOnError } from '@/utils/defaults';
import { useValidation } from '@/composable/validation';

const uuidInput = ref('');

const result = computed<UuidInspectResult | null>(() =>
  withDefaultOnError(() => (uuidInput.value.trim() ? inspectUuid(uuidInput.value.trim()) : null), null),
);

const validation = useValidation({
  source: uuidInput,
  rules: [
    {
      validator: (value) => {
        if (!value.trim()) {
          return true;
        }
        try {
          inspectUuid(value.trim());
          return true;
        }
        catch {
          return false;
        }
      },
      message: 'Invalid UUID format (expected xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)',
    },
  ],
});
</script>

<template>
  <div flex flex-col gap-3>
    <c-card>
      <c-input-text
        v-model:value="uuidInput"
        label="UUID to inspect"
        :validation="validation"
        placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"

        autofocus font-mono
      />
    </c-card>

    <c-card v-if="result" title="UUID Details">
      <c-key-value-list
        :items="Object.entries(result.info).map(([label, value]) => ({ label, value }))"
      />
    </c-card>
  </div>
</template>
