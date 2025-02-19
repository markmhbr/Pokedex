import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Memory from './components/Memory.vue'
import perco from './components/Detail.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/memory', component: Memory },
  { path: '/pokemon/:name', component: perco },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
