<template>
  <ul class="project-tree">
    <li v-for="item in treeBranch" :key="item.name + item.size" >
      <div v-if="item.type === 'dir'">
        <strong>{{ item.name }}/</strong>
        <project-tree :tree-branch="item.children" :tree-root="treeRoot"></project-tree>
      </div>
      <div v-else :class="{ 'included': item.include }" @click="toggleIncludeFile(item)"class="file-line">
        <span >{{ item.name }} </span>
        <span >{{ item.size }} </span>
      </div>
    </li>
  </ul>
</template>

<script>
import { sortProjectTree } from '../frontendUtils.js'

export default {
  props: {
    treeBranch: {
      type: Array,
      required: true,
    },
    treeRoot: {
      type: Array,
      required: true,
    },
  },
  methods: {
    toggleIncludeFile(item) {
      item.include = !item.include;
      sortProjectTree(this.treeRoot);
    },
  },
};
</script>

<style scoped>
ul.project-tree {
  list-style-type: none;
  user-select: none;
}

ul.project-tree  ul.project-tree {
  padding-left: 1.5em;
}

.project-tree strong {
  color: var(--blue);
  display: block;
}

.project-tree .file-line{
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.project-tree .file-line:not(.included) {
  opacity: 50%;
  list-style-type: none;
}
</style>