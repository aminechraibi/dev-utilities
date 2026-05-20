<script setup lang="ts">
import { morseToText, textToMorse } from './morse-code-translator.service';
import { useCopy } from '@/composable/copy';

const textInput = ref('');
const morseInput = ref('');

const morseOutput = computed(() => textInput.value ? textToMorse(textInput.value) : '');
const textOutput = computed(() => morseInput.value ? morseToText(morseInput.value) : '');

const { copy: copyMorse } = useCopy({ source: morseOutput, text: 'Morse code copied to clipboard' });
const { copy: copyText } = useCopy({ source: textOutput, text: 'Text copied to clipboard' });
</script>

<template>
  <div flex flex-col gap-3>
    <c-card title="Text to Morse">
      <c-input-text
        v-model:value="textInput"
        multiline
        placeholder="Type your text here..."
        label="Text input"
        autofocus
        raw-text
        mb-3
      />
      <c-input-text
        :value="morseOutput"
        multiline
        readonly
        placeholder="Morse code output..."
        label="Morse code"
        mb-3
        font-mono
      />
      <div flex justify-center>
        <c-button :disabled="morseOutput.length === 0" @click="copyMorse()">
          Copy morse code
        </c-button>
      </div>
    </c-card>

    <c-card title="Morse to Text">
      <c-input-text
        v-model:value="morseInput"
        multiline
        placeholder="Type morse code here (use / for word separator)..."
        label="Morse code input"
        raw-text
        mb-3
        font-mono
      />
      <c-input-text
        :value="textOutput"
        multiline
        readonly
        placeholder="Text output..."
        label="Text"
        mb-3
      />
      <div flex justify-center>
        <c-button :disabled="textOutput.length === 0" @click="copyText()">
          Copy text
        </c-button>
      </div>
    </c-card>
  </div>
</template>
