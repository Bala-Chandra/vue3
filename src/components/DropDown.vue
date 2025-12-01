<template>
  <div class="bg-gray-50 p-4 rounded-md border">

    <!-- Rows -->
    <div class="space-y-3">

      <div v-for="(row, idx) in rows" :key="idx" class="space-y-2">

        <!-- Operator Row -->
        <div v-if="idx > 0" class="flex justify-start mb-1">
          <select
            v-model="row.operator"
            class="px-3 py-1 border text-sm rounded bg-white shadow-sm"
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        </div>

        <!-- Input Row -->
        <div class="flex items-center gap-3">
          <select v-model="row.value" class="px-3 py-2 border rounded flex-1">
            <option value="" disabled>Select an option</option>
            <option
              v-for="opt in options"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>

          <button
            v-if="rows.length > 1"
            @click="removeRow(idx)"
            class="px-2 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
          >
            Remove
          </button>
        </div>

      </div>
    </div>

    <!-- Add & Save buttons -->
    <div class="mt-4 flex gap-2">

      <!-- Add Another -->
      <button
        @click="addRow"
        :disabled="!canAdd"
        class="text-sm px-3 py-1 rounded shadow-sm transition border"
        :class="canAdd
          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700'
          : 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
        "
      >
        + Add another
      </button>

      <!-- Save All -->
      <button
        @click="saveAll"
        :disabled="rowsAllEmpty"
        class="text-sm px-3 py-1 rounded shadow-sm transition border"
        :class="!rowsAllEmpty
          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700'
          : 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
        "
      >
        Save all
      </button>

    </div>

  </div>
</template>



<script setup>
import { ref, computed } from 'vue'
import { useHomeStore } from '@/stores/home'

const props = defineProps({
  category: { type: String, default: '' },
  subcategory: { type: String, default: '' },

  options: {
    type: Array,
    default: () => ([
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
      { value: 'opt3', label: 'Option 3' }
    ])
  }
})

const emit = defineEmits(['rows-updated', 'saved'])

// ROWS STATE
const rows = ref([{ value: '', operator: '' }])

// COMPUTED
const lastRow = computed(() => rows.value[rows.value.length - 1])
const canAdd = computed(() => !!lastRow.value.value)
const rowsAllEmpty = computed(() => rows.value.every(r => !r.value))

// ACTIONS
function addRow() {
  rows.value.push({ value: '', operator: 'OR' })
  emit('rows-updated', rows.value)
}

function removeRow(index) {
  rows.value.splice(index, 1)
  if (rows.value.length === 0) {
    rows.value.push({ value: '', operator: '' })
  }
  emit('rows-updated', rows.value)
}

function saveAll() {
  const home = useHomeStore()

  // clean rows: only values that are non-empty
  const cleaned = rows.value.map(r => ({ value: r.value })).filter(r => r.value && r.value !== '')

  if (!cleaned.length) return

  const payload = {
    category: props.category || '',
    subcategory: props.subcategory || '',
    rows: cleaned
  }

  // if editing, pass the edit index as replaceIndex
  if (home.editMode && Number.isInteger(home.editIndex)) {
    payload.replaceIndex = home.editIndex
  }

  const result = home.addSearchRows(payload)

  // home.addSearchRows already sets saveMode(true) and clears editMode if it applied the edit
  // emit to parent
  emit('saved', result)

  // reset local rows
  rows.value = [{ value: '', operator: '' }]
}
</script>



<style scoped>
</style>
