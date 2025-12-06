<script setup>
import { ref, computed } from "vue";
import { useHomeStore } from "../stores/home";

import CategoryA from "../components/CategoryA.vue";
import CategoryB from "../components/CategoryB.vue";
import CategoryC from "../components/CategoryC.vue";

const categories = [
  { id: "a", title: "Category A", name: "CategoryA", desc: "Description for Category A" },
  { id: "b", title: "Category B", name: "CategoryB", desc: "Description for Category B" },
  { id: "c", title: "Category C", name: "CategoryC", desc: "Description for Category C" },
];

const homeStore = useHomeStore();
// map string names to actual component objects
const componentMap = {
  CategoryA,
  CategoryB,
  CategoryC,
}
// currently selected card/category
const selectedCategory = ref(null);

const editRow = ref(null); // to store row data for editing

// computed current category object to reuse in template
const currentCategory = computed(() => {
  return categories.find(c => c.id === selectedCategory.value) ?? null
})




function openCategory(id) {
  selectedCategory.value = id;
}

const onEdit = (row, idx) => {
  console.log("Edit clicked for row:", row, "index:", idx);

  // attempt 1: find by title (exact match)
  let found = categories.find((c) => c.title === row.category);

  // attempt 2: maybe row.category contains id ("a") or name ("CategoryA") — try other matches
  if (!found) {
    found = categories.find((c) => c.id === row.category || c.name === row.category);
  }

  if (found) {
    homeStore.editMode = true; // set edit mode in store
    homeStore.editIndex = idx; // set the index of the row being edited
    selectedCategory.value = found.id;
    // store the row so the category component can pre-fill fields
    editRow.value = row;
  } else {
    // fallback: if nothing matched, you can either pick a default or log an error
    console.warn("Could not map row.category to a known category:", row.category);
  }
};


const rowsUpdatedFn = (updatedRows) => {
  // You can handle the updated rows here, e.g., update the store or local state
};

const rowsSavedFn = (savedRow) => {
  selectedCategory.value = null;
  // You can handle the saved row here, e.g., update the store or local state
};



const expanded = ref({}) // key: index -> boolean

function toggleExpand(index) {
  expanded.value[index] = !expanded.value[index]
}

function isExpanded(index) {
  return !!expanded.value[index]
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
    <!-- Saved Search -->
     <div v-if="homeStore.searchRowdata.length">
      <h2 class="text-2xl font-semibold mt-10 mb-4">Saved Searches</h2>

        <div
        v-for="(row, index) in homeStore.searchRowdata"
        :key="index"
        class="relative mb-2 p-4 bg-white rounded-xl shadow border border-gray-200"
      >
        <!-- Edit button: absolute top-right -->
        <button
          @click="onEdit(row, index)"
          class="absolute top-3 right-3
                bg-blue-600 text-white p-2 rounded-full shadow-lg
                hover:bg-blue-700 transition transform"
          aria-label="Edit"
        >
          <!-- pencil icon -->
          <svg xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M16.862 4.487l1.687 1.687a2.25 2.25 0 010 3.182l-9.546 9.546a1.5 1.5 0
                    01-.53.35l-3.598 1.2a.75.75 0 01-.949-.95l1.2-3.597a1.5 1.5 0
                    01.35-.53l9.546-9.546a2.25 2.25 0 013.182 0z" />
          </svg>
        </button>

        <!-- Operator Row -->
        <div v-if="index > 0" class="flex justify-start mb-2">
          <select
            v-model="row.operator"
            class="px-3 py-1 border text-sm rounded bg-white shadow-sm"
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        </div>

        <!-- Header: Category and Tab on single line -->
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4 min-w-0">
            <!-- Category: keep on one line, ellipsis if too long -->
            <p class="font-semibold whitespace-nowrap overflow-hidden">
              <span class="text-gray-600">Category:</span>
              <span class="ml-1">{{ row.category || '-' }}</span>
            </p>

            <!-- Tab / number of values: also single-line -->
            <!-- <p class="text-sm text-gray-600 whitespace-nowrap">
              <strong>Tab:</strong> {{ row.rows.length }}
            </p> -->
          </div>

          <!-- optional space-holder so header items layout well (edit button is absolute) -->
          <div class="hidden sm:block"></div>
        </div>

        <!-- Values area -->
        <div class="mt-3">
          <p class="font-medium text-sm text-gray-700 mb-1">Values:</p>

          <!-- collapsed summary: show first 2 values inline -->
          <div class="flex items-center gap-2 flex-wrap">
            <template v-if="row.rows && row.rows.length">
              <span v-if="row.rows.length >= 1" class="text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[65%]">
                {{ row.rows[0].value }}
              </span>

              <span v-if="row.rows.length >= 2" class="text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[65%]">
                , {{ row.rows[1].value }}
              </span>

              <button
                v-if="row.rows.length > 2"
                @click="toggleExpand(index)"
                class="text-sm font-medium ml-1 underline hover:no-underline"
                aria-expanded="isExpanded(index)"
              >
                <span v-if="!isExpanded(index)">+ {{ row.rows.length - 2 }} more</span>
                <span v-else>show less</span>
              </button>
            </template>

            <template v-else>
              <span class="text-sm text-gray-500">No values</span>
            </template>
          </div>

          <!-- expanded list (collapses without changing page width) -->
          <transition name="fade">
            <ul
              v-if="isExpanded(index)"
              class="mt-2 ml-4 max-w-full overflow-auto space-y-1"
              style="max-height: 240px;"
            >
              <li
                v-for="(item, idx) in row.rows"
                :key="idx"
                class="text-sm wrap-break-word bg-gray-50 px-3 py-1 rounded"
              >
                {{ item.value }}
              </li>
            </ul>
          </transition>
        </div>
      </div>
    </div>

    <!-- CATEGORY PANEL -->
     <div v-if="selectedCategory">
      <component :is="componentMap[currentCategory.name]" @rows-updated="rowsUpdatedFn" @saved="rowsSavedFn"
                  :component="categories.find(c => c.id === selectedCategory)" />
     </div>

  </div>
</template>

<style scoped>
/* small fade transition for the expanded list */
.fade-enter-active, .fade-leave-active {
  transition: opacity .18s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.text-ellipsis {
  /* helper for truncation - Tailwind's 'truncate' may be used too */
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
