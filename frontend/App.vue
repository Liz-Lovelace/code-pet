<template>
  <div class="app">
    <p> Repos in home dir: </p>
    <div class="project-picker">
      <span v-for="project in projectList" :key="project">
        <a :href="`/?project=${project}`"> {{ project }} </a>
      </span>
    </div>
    <h1> {{projectName && projectName.toUpperCase()}}</h1>
    <div class="box-container">
      <project-tree-box :project-tree="projectTree" />
      <div class="prompt-box">
        <h2>Task</h2>
        <textarea v-model="prompt" class="prompt-textarea"></textarea>
      </div>
    </div>
    <output-box :generated-code={} :loading="loading" :project-tree="projectTree" :result-message="resultMessage" />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import api from './api.js';
import ProjectTreeBox from './components/ProjectTreeBox.vue';
import OutputBox from './components/OutputBox.vue';

export default {
  components: {
    ProjectTreeBox,
    OutputBox,
  },
  setup() {
    const projectList = ref([]);
    const projectTree = ref(null);
    const projectName = ref(null);
    const prompt = ref('');
    const output = ref('');
    const loading = ref(false);


    const handleKeyDown = async (event) => {
      if (event.ctrlKey && event.key === 'Enter') {
        loading.value = true;
        const response = await api.generateCode(projectTree.value, prompt.value);
        output.value = response;
        loading.value = false;
      }
    };

    onMounted(async () => {
      projectList.value = await api.getProjectList();
      const urlParams = new URLSearchParams(window.location.search);
      projectName.value = urlParams.get('project');
      if (projectName.value) {
        let project = await api.getProjectTree(projectName.value);
        projectTree.value = project;
      }
      document.addEventListener('keydown', handleKeyDown);
    });

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeyDown);
    });

    return {
      projectTree,
      projectList,
      projectName,
      prompt,
      output,
      loading,
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

  .prompt-box {
    background-color: var(--box);
    padding: 10px 30px 30px;
  }

  .prompt-textarea {
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