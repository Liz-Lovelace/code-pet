<template>
  <div class="output-box">
    <h2>Output</h2>
    <div class="header-flex">
      <button @click="integrateCode"> INTEGRATE </button>
      <div>
        <p style="text-align: right;"> {{ generatedCode?.inputCost }} -> {{ generatedCode?.outputCost }} = ¢{{ generatedCode?.totalCost }}</p>
        <p style="text-align: right;"> {{ generatedCode.stop_reason }} </p>
      </div>
    </div>
    <div v-if="resultMessage" class="result-message">{{ resultMessage }}</div>
    <textarea v-if="!loading" v-model="outputText" class="output-textarea"></textarea>
    <div v-else class="loading-indicator">Loading...</div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import api from '../api.js';

export default {
  props: {
    generatedCode: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    projectTree: {
      type: Object,
      required: true,
    },
    resultMessage: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const outputText = ref('');

    watch(() => props.generatedCode, (newValue) => {
      outputText.value = newValue.content ? newValue.content[0].text : '';
      emit('update:resultMessage', '');
    });

    async function integrateCode() {
      emit('update:loading', true);
      const response = await api.integrateCode(props.projectTree, outputText.value);
      emit('update:resultMessage', response.message);
      emit('update:loading', false);
    }

    return {
      outputText,
      integrateCode,
    };
  },
};
</script>

<style>
.output-box {
  background-color: var(--box);
  padding: 10px 30px 30px;
  margin-top: 20px;
}

.header-flex {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.header-flex button {
  color: white;
  background-color: var(--darkAccent);
  font-weight: bold;
  border: 3px solid black;
  width: 70%;
  cursor: cell;
}

.header-flex button:active {
  background-color: white;
  color: black;
}

.header-flex p {
  margin: 1em 0;
}

.output-textarea {
  width: 100%;
  height: 80vh;
  background-color: black;
  color: white;
  border: none;
  padding: 10px;
  font-family: 'iosevka', monospace;
  font-size: 1rem;
}

.loading-indicator {
  text-align: center;
  font-size: 1.2rem;
  padding: 20px;
}

.result-message {
  margin-top: 20px;
  font-size: 1.2rem;
  text-align: center;
  color: green;
}
</style>