<template>
  <h1> {{store.projectName?.toUpperCase()}}</h1>
  <div class="tabs">
    <button :class="{currentTab: store.currentTab == 'task'}" @click="store.currentTab='task'">TASK</button>
    <button :class="{currentTab: store.currentTab == 'output'}" @click="store.currentTab='output'">CODE</button>
    <button :class="{currentTab: store.currentTab == 'diff'}" @click="store.currentTab='diff'">DIFF</button>
  </div>
  <prompt-box v-show="store.currentTab == 'task'"/>
  <output-box v-show="store.currentTab == 'output'"/>
  <diff-box v-show="store.currentTab == 'diff'"/>

  <project-picker />
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import api from './api.js';
import PromptBox from './components/PromptBox.vue';
import OutputBox from './components/OutputBox.vue';
import DiffBox from './components/DiffBox.vue';
import ProjectPicker from './components/ProjectPicker.vue';
import { store } from './store.js';


export default {
  components: {
    PromptBox,
    OutputBox,
    DiffBox,
    ProjectPicker,
  },
  setup() {
    const handleKeyDown = async (event) => {
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault()
        store.generatedCode.text = '';
        await api.generateCode(store.projectTree, store.task);
      }
    };

    onMounted(async () => {
      store.projectList = await api.getProjectList();
      const urlParams = new URLSearchParams(window.location.search);
      store.projectName = urlParams.get('project');
      if (store.projectName) {
        let project = await api.getProjectTree(store.projectName);
        store.projectTree = project;
      }
      document.addEventListener('keydown', handleKeyDown);
    });

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeyDown);
    });

    return {
      store,
    };
  },
};
</script>


<style>
  h1 {
    margin: 10px 0 10px;
    text-align: center;
  }
  
  .box {
    padding: 25px 20px;
    background-color: var(--box);
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .project-name {
    font-size: 1em;
    display: block;
    color: var(--blue);
  }

  .tabs * {
    opacity: 0.6;
    background-color: var(--box);
    width: 120px;
    height: 40px;
  }

  .currentTab {
    opacity: 1;
  }
</style>