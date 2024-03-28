<template>
  <div class="project-tree-box">
    <h2> Input code </h2>
    <strong class="project-name"> {{projectName}}/</strong>
    <project-tree v-if="projectTree" :tree-root="projectTree" :tree-branch="projectTree" />
  </div>
</template>

<script>
import ProjectTree from './ProjectTree.vue';

export default {
  components: {
    ProjectTree,
  },
  props: {
    projectName: String,
    projectTree: Object,
  },
};
</script>

<style scoped>
.project-tree-box {
  padding: 10px 30px 30px;
}

.project-name {
  font-size: 1em;
  display: block;
  color: var(--blue);
}
</style>