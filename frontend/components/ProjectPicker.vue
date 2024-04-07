<template>
  <div class="project-picker">
    <span v-for="project in store.projectList" :key="project">
      <a :href="`/?project=${project}`"> {{ project }} </a>
    </span>
  </div>
</template>

<script>
import { store } from '../store.js';

export default {
  setup() {
    return {
      store,
    };
  },
};
</script>

<style>
  .project-picker {
    display: grid;
    grid-template-columns: repeat(auto-fit, 200px);
    font-weight: bold;
  }
</style>