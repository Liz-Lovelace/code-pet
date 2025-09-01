<template>
  <div class="diff-box box">
    <h3> Changed files: </h3>
    <div class="diff-container" ref="diffContainer"></div>
    <button @click="applyDiff">Apply Changes</button>
  </div>
</template>

<script>
import api from '../api.js';
import { store } from '../store.js';
import { Diff2HtmlUI } from 'diff2html/lib/ui/js/diff2html-ui.js';
import 'highlight.js/styles/vs2015.css';
import 'diff2html/bundles/css/diff2html.min.css';
import { onMounted, ref, watch } from 'vue';
import { createPatch } from 'diff';

export default {
  setup() {
    const diffContainer = ref(null);

    watch(() => store.diff,  (diff) => {
      if (!diff.length) {
        return;
      }

      let patch = diff.reduce((acc, delta) => {
        return acc += createPatch(delta.path, delta.oldCode, delta.newCode);
      }, "");

      const diffHtml = new Diff2HtmlUI(diffContainer.value, patch, {
        colorScheme: 'dark',
        highlight: true,
        fileListStartVisible: true,
        matchingMaxComparisons: 0,
      });

      diffHtml.draw();
    }, {deep: true});

    async function applyDiff() {
      await api.applyDiff(store.diff);
    }

    return {
      store,
      diffContainer,
      applyDiff,
    };
  },
};
</script>


<style>
.diff-box {
  --d2h-dark-bg-color: #0e0c0b;
  --d2h-dark-file-header-bg-color: var(--surface);
  --d2h-moved-label-color: var(--blue);
}

.diff-box h3 {
  margin-bottom: 1em;
}

.hljs {
  background-color: inherit;
}

.d2h-wrapper ins,
del {
  background-color: inherit !important;
}

.d2h-ins.d2h-change,
.d2h-ins.d2h-change {
  background-color: var(--d2h-dark-ins-bg-color) !important;
}

.d2h-del {
  background-color: #ad222233 !important;
}

.d2h-code-line-ctn {
  vertical-align: bottom;
}

.d2h-code-line {
  padding: 0 10px;
}

.d2h-diff-table, .d2h-file-header {
  font-family: inherit;
  font-size: inherit;
}

.d2h-file-header {
  padding: 20px 10px 2.6em;
}

.d2h-file-list-wrapper {
  background-color: inherit;
  margin-bottom: 2em;
}

.d2h-file-list-line {
  padding: 0 !important;
  border-bottom: none !important;
  margin-bottom: 0.6em !important;
}

.d2h-file-name-wrapper {
  flex-direction: row-reverse;
  gap: 10px;
  justify-content: left;
}

.d2h-file-name {
  font-size: 1rem !important;
}

.d2h-file-stats {
  margin-left: 0;
  min-width: 4.5em;
}

.d2h-wrapper {
  background-color: unset !important;
}

.d2h-file-wrapper {
  background-color: var(--d2h-dark-bg-color);
  border: 20px solid var(--d2h-dark-file-header-bg-color) !important;
  outline: 1px solid #fff3;
  margin-bottom: 3em;
}

.d2h-code-linenumber, .d2h-icon, .d2h-tag, .d2h-code-line-prefix, .d2h-file-list-header {
  display: none;
}

.d2h-info {
  background-color: var(--d2h-dark-file-header-bg-color) !important;

  mask: linear-gradient(
    to bottom, #0000 0, #000f 35%, #000f 65%, #0000 100%
  ) ;


  text-align: center;
  padding-top: 15px;
  padding-bottom: 15px;
  opacity: 70%;
}

.diff-box button {
  font-size: 1.1em;
  border: 3px solid black;
  width: 100%;
  cursor: cell;
  margin-top: 1em;
}

.diff-box button:active {
  background-color: white;
  color: black;
}
</style>
