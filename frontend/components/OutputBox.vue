<template>
  <div class="output-box box">
    <h2>Output</h2>
    <div class="header-flex">
      <p> ${{ (store.generatedCode.inputCost + store.generatedCode.outputCost).toFixed(2) }}
        <span> (input {{ store.generatedCode.inputCost.toFixed(2) }} + output {{ store.generatedCode.outputCost.toFixed(2) }}) </span>
      </p>
      <p style="text-align: right;"> {{ store.generatedCode.status }} </p>
    </div>
    <div v-if="store.integrationMessage" class="result-message">{{ store.integrationMessage }}</div>
    <div v-if="store.loading" class="loading-indicator">Loading...</div>

    <textarea v-model="store.generatedCode.text" class="output-textarea"></textarea>

    <button @click="integrateCode"> INTEGRATE </button>
  </div>
</template>

<script>
import api from '../api.js';
import { store } from '../store.js';


export default {
  setup() {
    async function integrateCode() {
      store.loading = true;
      const response = await api.integrateCode(store.projectTree, store.generatedCode);
      store.integrationMessage = response.message;
      store.loading = false;
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
  margin-top: 20px;
}

.header-flex {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.output-box button {
  color: white;
  background-color: var(--darkAccent);
  font-weight: bold;
  font-size: 1.1em;
  border: 3px solid black;
  width: 100%;
  height: 80px;
  margin-top: 10px;
  cursor: cell;
}

.output-box button:active {
  background-color: white;
  color: black;
}

.header-flex th {
  padding-right: 1em;
}

.output-textarea {
  width: 100%;
  height: 60vh;
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