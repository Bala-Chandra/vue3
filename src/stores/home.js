// src/stores/home.js
import { defineStore } from 'pinia'

export const useHomeStore = defineStore('homeStore', {
  state: () => ({
    saveMode: false,
    editMode: false,
    // index being edited when editMode === true. null if not editing.
    editIndex: null,
    viewMode: true,
    searchRowdata: [],
    searchPayload: {
      category: '',
      subcategory: '',
      query: [],
      operator: 'OR'
    }
  }),

  actions: {
    // Set saveMode flag
    setSaveMode(value) {
      this.saveMode = !!value
    },

    // Set edit mode (and optionally index)
    setEditMode(enabled, index = null) {
      this.editMode = !!enabled
      this.editIndex = enabled ? index : null
    },

    /**
     * Add rows for a particular category/subcategory into searchRowdata
     * If `replaceIndex` is provided (number) OR `this.editMode && this.editIndex != null` then
     * the function will replace the existing entry at that index instead of appending.
     *
     * payload: { category, subcategory, rows, replaceIndex }
     */
    addSearchRows({ category = '', subcategory = '', rows = [], replaceIndex = null } = {}) {
      // Prepare cleaned rows array (only non-empty values)
      const cleaned = (rows || [])
        //.map(r => ({ value: r.value }))
        .filter(r => r.value && r.value !== '')

      if (cleaned.length === 0) {
        // nothing to save
        return null
      }

      const record = {
        category,
        subcategory,
        rows: cleaned,
        createdAt: new Date().toISOString(),
         operator: 'OR'
      }

      // Determine index to replace:
      // precedence: explicit replaceIndex argument -> store.editMode/editIndex -> append
      let targetIndex = null
      if (Number.isInteger(replaceIndex)) {
        targetIndex = replaceIndex
      } else if (this.editMode && Number.isInteger(this.editIndex)) {
        targetIndex = this.editIndex
      }

      if (targetIndex !== null && targetIndex >= 0 && targetIndex < this.searchRowdata.length) {
        // replace existing entry
        this.searchRowdata.splice(targetIndex, 1, record)
      } else {
        // append
        this.searchRowdata.push(record)
      }

      // update searchPayload to latest saved payload
      // this.searchPayload = {
      //   category,
      //   subcategory,
      //   query: cleaned.map(r => r.value),
      //   operator: 'OR'
      // }

      // mark saved state
      this.setSaveMode(true)

      // if we were in edit mode, clear it (we've applied the edit)
      if (this.editMode) {
        this.setEditMode(false, null)
      }

      return { category, subcategory, rows: cleaned }
    },

    /**
     * Replace entire searchRowdata (if needed)
     */
    setSearchRowdata(newArray) {
      this.searchRowdata = Array.isArray(newArray) ? newArray : []
    }
  },
  persist: {
    enabled: true,
  }
})
