// src/stores/home.js
import { defineStore } from 'pinia'

export const useHomeStore = defineStore('homeStore', {
  state: () => ({
    saveMode: false,
    editMode: false,
    viewMode: true,
    searchRowdata: [],
    searchPayload: {
      category: '',
      subcategory: '',
      query: []
    }
  }),
  actions: {
    /**
     * Add rows for a particular category/subcategory into searchRowdata
     * payload: { category, subcategory, rows } where rows = [{ value }, ...]
     */
     // Set saveMode flag
      setSaveMode(value) {
        this.saveMode = value
      },
    addSearchRows({ category = '', subcategory = '', rows = [] } = {}) {
      // Prepare a cleaned rows array (only non-empty values)
      const cleaned = (rows || []).map(r => ({ value: r.value })).filter(r => r.value && r.value !== '')

      // push into searchRowdata as a record (you can change shape as needed)
      this.searchRowdata.push({
        category,
        subcategory,
        rows: cleaned,
        createdAt: new Date().toISOString()
      })

      // update searchPayload: last saved payload (useful for immediate query)
      this.searchPayload = {
        category,
        subcategory,
        query: cleaned.map(r => r.value)
      }

      // optionally return what was saved
      return { category, subcategory, rows: cleaned }
    },

    /**
     * Replace entire searchRowdata (if needed)
     */
    setSearchRowdata(newArray) {
      this.searchRowdata = Array.isArray(newArray) ? newArray : []
    }
  }
})
