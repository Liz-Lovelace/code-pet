<template>
  <div class="app">
    <p> Repos in home dir: </p>
    <project-picker />
    <h1> {{store.projectName?.toUpperCase()}}</h1>
    <div class="box-container">
      <project-tree-box />
      <div class="task-box">
        <h2>Task</h2>
        <textarea v-model="store.task" class="task-textarea"></textarea>
      </div>
    </div>
    <output-box/>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import api from './api.js';
import ProjectTreeBox from './components/ProjectTreeBox.vue';
import OutputBox from './components/OutputBox.vue';
import ProjectPicker from './components/ProjectPicker.vue';
import { store } from './store.js';


export default {
  components: {
    ProjectTreeBox,
    OutputBox,
    ProjectPicker,
  },
  setup() {
    const handleKeyDown = async (event) => {
      if (event.ctrlKey && event.key === 'Enter') {
        store.loading = true;
        const response = await api.generateCode(store.projectTree, store.task);
        store.generatedCode = response.content[0].text;
        store.inputCost = response.inputCost;
        store.outputCost = response.outputCost;
        store.totalCost = response.totalCost;
        store.stop_reason = response.stop_reason;
        store.loading = false;
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
    margin: 40px 0 20px;
    padding: 10px 0;
    text-align: center;
    background-color: var(--box);
  }

  .box-container {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin: 20px 0;
    gap: 20px;
  }

  .box-container > * {
    background-color: var(--box);
    width: 100%;
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

  .project-tree-box {
    padding: 10px 30px 30px;
  }

  .task-box {
    background-color: var(--box);
    padding: 10px 30px 30px;
  }

  .task-textarea {
    width: 100%;
    height: 500px;
    background-color: #0006;
    color: white;
    border: none;
    padding: 10px 0 10px 10px;
    font-size: 1rem;
    font-family: 'iosevka', monospace;
  }
</style>