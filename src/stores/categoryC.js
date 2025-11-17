import { defineStore } from 'pinia'

export const useCategoryCStore = defineStore('categoryCStore', {
  state: () => ({
    name: 'Category C',           // store category name
    selectedTab: 'sub1', // store tab for this category
     tabs : [
      { key: 'sub1', label: 'Cat C Sub 1' },
      { key: 'sub2', label: 'Cat C Sub 2' },
      { key: 'sub3', label: 'Cat C Sub 3' },
      { key: 'sub4', label: 'Cat C Sub 4' }
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
