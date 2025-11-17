import { defineStore } from 'pinia'

export const useCategoryAStore = defineStore('categoryAStore', {
  state: () => ({
    name: 'Category A',           // store category name
    selectedTab: 'sub1', // store tab for this category
     tabs : [
      { key: 'sub1', label: 'Cat A Sub 1' },
      { key: 'sub2', label: 'Cat A Sub 2' },
      { key: 'sub3', label: 'Cat A Sub 3' },
      { key: 'sub4', label: 'Cat A Sub 4' }
    ]
  }),

  actions: {

    setTab(tabKey) {
      this.selectedTab = tabKey
    },
    getTab(){
      return this.selectedTab;
    }
  }
})
