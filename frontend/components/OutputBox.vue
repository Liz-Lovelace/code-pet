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
    <div v-if="store.integrationMessage" class="result-message">{{ store.integrationMessage }}</div>
    <div v-if="store.loading"  class="loading-indicator">Loading...</div>
    <textarea v-model="store.generatedCode" class="output-textarea"></textarea>
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