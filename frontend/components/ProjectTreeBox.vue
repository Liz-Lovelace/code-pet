<template>
  <div class="project-tree-box">
    <h2> Input code </h2>
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
    projectTree: Object,
  },
};
</script>

<style scoped>
.project-tree-box {
  padding: 10px 30px 30px;
}
</style>