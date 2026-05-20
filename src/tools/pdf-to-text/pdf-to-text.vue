<script setup lang="ts">
import { ref } from 'vue';
import { extractTextFromPdfBuffer } from './pdf-to-text.service';
import { useCopy } from '@/composable/copy';
import { formatBytes } from '@/utils/convert';

const status = ref<'idle' | 'loading' | 'done' | 'error'>('idle');
const file = ref<File | null>(null);
const extractedText = ref('');
const errorMessage = ref('');

const { copy } = useCopy({ source: extractedText, createToast: true });

async function onFileUpload(uploadedFile: File) {
  file.value = uploadedFile;
  status.value = 'loading';
  extractedText.value = '';
  errorMessage.value = '';

  try {
    const buffer = await uploadedFile.arrayBuffer();
    const text = await extractTextFromPdfBuffer(buffer);
    if (text.trim().length === 0) {
      extractedText.value = '';
      errorMessage.value = 'No extractable text found. This PDF may use embedded fonts, images, or encryption that prevents text extraction.';
      status.value = 'error';
    }
    else {
      extractedText.value = text;
      status.value = 'done';
    }
  }
  catch {
    errorMessage.value = 'Failed to read the PDF file.';
    status.value = 'error';
  }
}

function downloadText() {
  const blob = new Blob([extractedText.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${file.value?.name.replace(/\.pdf$/i, '') ?? 'extracted'}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div>
    <c-card mb-3>
      <c-file-upload
        accept=".pdf,application/pdf"
        title="Drag and drop a PDF file here, or click to select"
        @file-upload="onFileUpload"
      />
    </c-card>

    <c-card v-if="file" mb-3>
      <div flex items-center gap-3>
        <div font-bold>
          {{ file.name }}
        </div>
        <div style="opacity:0.6">
          {{ formatBytes(file.size) }}
        </div>
        <n-tag v-if="status === 'loading'" type="info">
          Processing...
        </n-tag>
        <n-tag v-else-if="status === 'done'" type="success">
          Done
        </n-tag>
        <n-tag v-else-if="status === 'error'" type="error">
          Error
        </n-tag>
      </div>
    </c-card>

    <c-alert v-if="status === 'error'" type="error" mb-3>
      {{ errorMessage }}
    </c-alert>

    <c-card v-if="status === 'done' && extractedText">
      <div mb-3 flex items-center justify-between>
        <div font-bold>
          Extracted text ({{ extractedText.length }} characters)
        </div>
        <div flex gap-2>
          <c-button @click="copy()">
            Copy text
          </c-button>
          <c-button @click="downloadText">
            Download .txt
          </c-button>
        </div>
      </div>
      <textarea
        :value="extractedText"
        readonly
        style="width:100%;min-height:300px;font-family:monospace;font-size:13px;padding:8px;border:1px solid #e0e0e0;border-radius:4px;resize:vertical;box-sizing:border-box"
      />
    </c-card>

    <c-alert v-if="status === 'idle'" type="info">
      Upload a PDF file to extract its text content. Works best with text-based PDFs (not scanned images).
    </c-alert>
  </div>
</template>
