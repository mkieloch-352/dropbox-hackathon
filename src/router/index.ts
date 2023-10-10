import { createRouter, createWebHistory } from 'vue-router'
import Home from '../Views/Home.vue'
import SignContract from '../Views/SignContract.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/contract/sign',
        name: 'SignContract',
        component: SignContract
    }
]

const router = createRouter({ history: createWebHistory(), routes: routes })
export default router