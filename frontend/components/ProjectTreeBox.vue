<template>
  <div class="project-tree-box">
    <h2> Input code </h2>
    <project-tree v-if="store.projectTree" :tree-branch="store.projectTree" />
  </div>
</template>

<script>
import ProjectTree from './ProjectTree.vue';
import { store } from '../store.js';

export default {
  components: {
    ProjectTree,
  },
  setup() {
    return {
      store,
    };
  },
};
</script>

<style scoped>
.project-tree-box {
  padding: 10px 30px 30px;
}
</style>