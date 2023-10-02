import { createRouter, createWebHashHistory } from 'vue-router'
//import Home from '@/views/Home.vue'
const Home = () => import('@/views/Home.vue')
const Form = () => import('@/views/Form.vue')
//import About from '@/views/About.vue'

const routes = [
    { name: 'home', path: '/', component: Home },
    { name: 'form', path: '/form/:id?', component: Form },
]
  

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router