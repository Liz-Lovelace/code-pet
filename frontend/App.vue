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
      <project-tree-box :project-name="projectName" :project-tree="projectTree" />
      <div class="prompt-box">
        <h2>Task</h2>
        <textarea v-model="prompt" class="prompt-textarea"></textarea>
      </div>
    </div>
    <div class="output-box">
      <h2> Output </h2>
      <p style="user-select: none; text-align:right;">{{ outputLength }} B</p>
      <pre>{{ output }}</pre>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import api from './api.js';
import ProjectTreeBox from './components/ProjectTreeBox.vue';

export default {
  components: {
    ProjectTreeBox,
  },
  setup() {
    const projectList = ref([]);
    const projectTree = ref(null);
    const projectName = ref(null);
    const prompt = ref('');
    const output = ref('');

    const outputLength = computed(() => output.value.length);

    const handleKeyDown = async (event) => {
      if (event.ctrlKey && event.key === 'Enter') {
        const response = await api.composePrompt(projectName.value, projectTree.value, prompt.value);
        output.value = response;
        navigator.clipboard.writeText(response);
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
      outputLength,
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

  .output-box {
    background-color: var(--box);
    padding: 10px 30px 30px;
    margin-top: 20px;
  }

  .output-box pre {
    background-color: black;
    padding: 10px;
  }
</style>