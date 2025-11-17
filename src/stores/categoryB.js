import { defineStore } from 'pinia'

export const useCategoryBStore = defineStore('categoryBStore', {
  state: () => ({
    name: 'Category B',           // store category name
    selectedTab: 'sub1', // store tab for this category
     tabs : [
      { key: 'sub1', label: 'Cat B Sub 1' },
      { key: 'sub2', label: 'Cat B Sub 2' },
      { key: 'sub3', label: 'Cat B Sub 3' },
      { key: 'sub4', label: 'Cat B Sub 4' }
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
