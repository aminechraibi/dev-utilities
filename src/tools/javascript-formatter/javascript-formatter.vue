<script setup lang="ts">
import { formatJavaScript } from './javascript-formatter.service';
import { useCopy } from '@/composable/copy';

const inputCode = ref(`function greet(name){
const message="Hello, "+name+"!";
console.log(message);
return message;
}

const numbers=[1,2,3,4,5];
const doubled=numbers.map(function(n){return n*2;});
console.log(doubled);`);

const indentSize = ref(2);

const outputCode = computed(() =>
  formatJavaScript(inputCode.value, { indentSize: indentSize.value }),
);

const { copy } = useCopy({ source: outputCode, text: 'Formatted code copied to clipboard' });
</script>

<template>
  <div>
    <c-card mb-3>
      <div flex items-center gap-4>
        <c-select
          v-model:value="indentSize"
          label="Indent size"
          style="width: 180px"
          :options="[
            { label: '2 spaces', value: 2 },
            { label: '4 spaces', value: 4 },
          ]"
        />
      </div>
    </c-card>

    <div mb-3 flex gap-3>
      <c-input-text
        v-model:value="inputCode"
        label="JavaScript / TypeScript input"
        placeholder="Paste your code here..."
        multiline
        rows="16"
        font-mono
        style="flex: 1"
      />
      <c-input-text
        :value="outputCode"
        label="Formatted code"
        placeholder="Formatted output will appear here..."

        rows="16"

        multiline readonly font-mono
        style="flex: 1"
      />
    </div>

    <div flex justify-center>
      <c-button @click="copy()">
        Copy formatted code
      </c-button>
    </div>
  </div>
</template>
