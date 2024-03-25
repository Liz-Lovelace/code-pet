<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const message = ref('Hello, Vue!');
    const items = ref([]);

    onMounted(async () => {
      const response = await fetch('http://localhost:3000/api/data');
      items.value = await response.json();
    });

    return {
      message,
      items,
    };
  },
};
</script>

<template>
  <div class="test">
    <h1>{{ message }}</h1>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item }}</li>
    </ul>
  </div>
</template>

<style>
.test {
}
</style>
