<template>
  <div class="bg-gray-50 p-4 rounded-md border">

    <!-- Rows -->
    <div class="space-y-3">

      <!-- Loop rows -->
      <div v-for="(row, idx) in rows" :key="idx" class="space-y-2">

        <!-- Operator Row (only if not first row) -->
        <div v-if="rows.length > 0 && idx > 0" class="flex justify-start mb-1">
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

    <!-- Add & Save All -->
    <div class="mt-4 flex gap-2">
      <button
        @click="addRow"
        class="text-sm px-3 py-1 bg-white border rounded shadow-sm hover:bg-gray-100"
        :disabled="!canAdd"
      >
        + Add another
      </button>

      <button
        @click="saveAll"
        :class="canAdd? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700' : 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'"
        :disabled="rowsAllEmpty">
        Save all
      </button>
    </div>

  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { useHomeStore } from '@/stores/home' // adjust path to your store file

const props = defineProps({
  // optional category/subcategory metadata to save with rows
  category: {
    type: String,
    default: ''
  },
  subcategory: {
    type: String,
    default: ''
  },

  // dropdown options
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

// local simple rows array (no saved flag)
const rows = ref([{ value: '', label: '', operator: '' }])

const lastRow = computed(() => rows.value[rows.value.length - 1])

// whether we can add a new row (last row should be non-empty)
const canAdd = computed(() => !!(lastRow.value && lastRow.value.value && lastRow.value.value !== ''))

// whether all rows are empty (disables Save all when true)
const rowsAllEmpty = computed(() => rows.value.every(r => !r.value || r.value === ''))

function addRow() {
  rows.value.push({ value: '', label: '', operator: 'OR' }) // default operator for new rows
  emit('rows-updated', rows.value)
}

function removeRow(index) {
  rows.value.splice(index, 1)
  if (rows.value.length === 0) rows.value.push({ value: '', label: '', operator: '' })
  emit('rows-updated', rows.value)
}

/**
 * Save all rows into the home store.
 * - only non-empty values are stored
 * - uses props.category / props.subcategory as metadata
 */
function saveAll() {
  const home = useHomeStore()
  // clean rows: only values that are non-empty
  const cleaned = rows.value.map(r => ({ value: r.value })).filter(r => r.value && r.value !== '')

  // call store action to persist into searchRowdata
  const payload = {
    category: props.category || '',
    subcategory: props.selectedTab || '',
    rows: cleaned
  }

  const result = home.addSearchRows(payload) // stores into home.searchRowdata & searchPayload

  // 🔥 turn saveMode = true here
  home.setSaveMode(true)

  // emit event to parent with saved result
  emit('saved', result)

  // also emit rows-updated
  emit('rows-updated', rows.value)

  // optional: reset local rows to a single empty row after save
  rows.value = [{ value: '', label: '', operator: '' }]
}
</script>

<style scoped>
/* small niceties if you want */
</style>
