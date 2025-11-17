<script setup>
import { ref, computed } from "vue";

import CategoryA from "../components/CategoryA.vue";
import CategoryB from "../components/CategoryB.vue";
import CategoryC from "../components/CategoryC.vue";

const categories = [
  { id: "a", title: "Category A", name: "CategoryA", desc: "Description for Category A" },
  { id: "b", title: "Category B", name: "CategoryB", desc: "Description for Category B" },
  { id: "c", title: "Category C", name: "CategoryC", desc: "Description for Category C" },
];

// map string names to actual component objects
const componentMap = {
  CategoryA,
  CategoryB,
  CategoryC,
}
// currently selected card/category
const selectedCategory = ref(null);

// computed current category object to reuse in template
const currentCategory = computed(() => {
  return categories.find(c => c.id === selectedCategory.value) ?? null
})




function openCategory(id) {
  selectedCategory.value = id;
}
</script>

<template>
  <div class="max-w-5xl mx-auto py-10">
    <!-- 3 CARDS -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="openCategory(cat.id)"
        class="p-6 bg-white rounded-xl shadow hover:shadow-lg transition text-left border border-gray-200"
      >
        <h3 class="text-xl font-bold mb-1">{{ cat.title }}</h3>
        <p class="text-gray-600 text-sm">{{ cat.desc }}</p>
      </button>
    </div>
    <!-- CATEGORY PANEL -->
     <div v-if="selectedCategory">
      <component :is="componentMap[currentCategory.name]"
                  :component="categories.find(c => c.id === selectedCategory)" />
     </div>

  </div>
</template>

<style scoped>
</style>
