import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'
import NotFound from '../pages/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: Home },
     { path: '/about', name: 'About', component: About },
       // catch-all
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ],
})

export default router
