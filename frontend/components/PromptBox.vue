<template>
  <div class="prompt-box box">
    <div>
      <h2> Input code </h2>
      <project-tree v-if="store.projectTree" :tree-branch="store.projectTree" />
    </div>
    <div class="task-subbox">
      <h2>Task</h2>
      <textarea v-model="store.task" class="task-textarea"></textarea>
    </div>
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

<style>
  .prompt-box {
    background-color: var(--box);
    display: flex;
    width: 100%;
  }

  .prompt-box > * {
    width: 100%;
  }

  .task-subbox {
    min-height: 500px;
    margin-left: 20px;
  }

  .task-textarea {
    width: 100%;
    height: calc(100% - 40px);
  }
</style>