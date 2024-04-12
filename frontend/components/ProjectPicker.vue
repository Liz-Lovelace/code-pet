<template>
  <div class="project-picker">
    <p> Repos in home dir: </p>
    <div class="projects">
      <span v-for="project in store.projectList" :key="project">
        <a :href="`/?project=${project}`"> {{ project }} </a>
      </span>
    </div>
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
    margin-top: 20px;
  }

  .projects {
    display: grid;
    grid-template-columns: repeat(auto-fit, 200px);
    font-weight: bold;
  }
</style>