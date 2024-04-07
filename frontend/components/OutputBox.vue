<template>
  <div class="output-box">
    <h2>Output</h2>
    <div class="header-flex">
      <button @click="integrateCode"> INTEGRATE </button>
      <div>
        <p style="text-align: right;"> {{ store.inputCost }} -> {{ store.outputCost }} = ¢{{ store.totalCost }}</p>
        <p style="text-align: right;"> {{ store.stop_reason }} </p>
      </div>
    </div>
    <div v-if="resultMessage" class="result-message">{{ resultMessage }}</div>
    <textarea v-if="!loading" v-model="store.generatedCode" class="output-textarea"></textarea>
    <div v-else class="loading-indicator">Loading...</div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import api from '../api.js';
import { store } from '../store.js';


export default {
  props: {
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
    async function integrateCode() {
      emit('update:loading', true);
      const response = await api.integrateCode(props.projectTree, store.outputText);
      emit('update:resultMessage', response.message);
      emit('update:loading', false);
    }

    return {
      integrateCode,
      store,
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