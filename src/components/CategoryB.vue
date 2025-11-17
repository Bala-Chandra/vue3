<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCategoryBStore } from '../stores/categoryB'


const store = useCategoryBStore();

const props = defineProps({
  component: {
    type: Object,
    required: true
  }
})

onMounted(() => {
  console.log("Component mounted!")
  // run your check here
})



// derived uppercase name for display
const componentNameUpper = computed(() => (props.component.title || '').toUpperCase());

// selectedTab with two-way binding
const selectedTab = computed({
  get: () => store.selectedTab,
  set: (val) => store.setTab(val)
})

const tabs = computed(() => store.tabs);
</script>

<template>
  <div class="mt-10 p-6 bg-white rounded-xl shadow border border-gray-200">
    <h2 class="text-2xl font-semibold mb-4">
      {{ props.component.title }}
    </h2>

    <!-- TABS -->
    <div class="border-b mb-4 flex space-x-4">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="selectedTab = tab.key"
        :class="[
          'pb-2 text-sm font-medium',
          selectedTab === tab.key
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-600 hover:text-gray-800'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- TAB CONTENT -->
    <div class="text-gray-700">
      <div v-if="selectedTab === 'sub1'">
        <h3 class="text-lg font-semibold mb-2">Subcategory 1</h3>
        <p>Content for subcategory 1 of {{ componentNameUpper }}.</p>
      </div>

      <div v-else-if="selectedTab === 'sub2'">
        <h3 class="text-lg font-semibold mb-2">Subcategory 2</h3>
        <p>Content for subcategory 2 of {{ componentNameUpper }}.</p>
      </div>

      <div v-else-if="selectedTab === 'sub3'">
        <h3 class="text-lg font-semibold mb-2">Subcategory 3</h3>
        <p>Content for subcategory 3 of {{ componentNameUpper }}.</p>
      </div>

      <div v-else-if="selectedTab === 'sub4'">
        <h3 class="text-lg font-semibold mb-2">Subcategory 4</h3>
        <p>Content for subcategory 4 of {{ componentNameUpper }}.</p>
      </div>
    </div>
  </div>
</template>
