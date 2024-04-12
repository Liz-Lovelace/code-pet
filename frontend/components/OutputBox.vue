<template>
  <div class="output-box box">
    <textarea v-model="store.generatedCode.text" class="output-textarea"></textarea>

    <div class="header-flex">
      <p> ${{ (store.generatedCode.inputCost + store.generatedCode.outputCost).toFixed(2) }}
        <span> (input {{ store.generatedCode.inputCost.toFixed(2) }} + output {{ store.generatedCode.outputCost.toFixed(2) }}) </span>
      </p>
      <p style="text-align: right;"> {{ store.generatedCode.status }} </p>
    </div>

    <button @click="generateDiff"> GET DIFF </button>
  </div>
</template>

<script>
import api from '../api.js';
import { store } from '../store.js';


export default {
  setup() {
    async function generateDiff() {
      let result = await api.generateDiff(store.projectTree, store.generatedCode.text);
      if (result.status == 'ok') {
        store.diff = result.diff;
      }
    }

    return {
      generateDiff,
      store,
    };
  },
};
</script>


<style>
.header-flex {
  display: flex;
  justify-content: space-between;
  margin: 20px 5px;
}

.output-box button {
  font-size: 1.1em;
  border: 3px solid black;
  width: 100%;
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
}

.result-message {
  margin-top: 20px;
  font-size: 1.2rem;
  text-align: center;
  color: #8beb55;
}
</style>