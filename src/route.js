import { createRouter, createWebHistory } from 'vue-router'

import index from './components/index.vue'
import login from './components/login.vue'
import registracia from './components/registracia.vue'
import diary from './components/diarypage.vue'
import productspage from './components/productspage.vue'
import profile from './components/profile.vue'
import historypage from './components/historypage.vue'

import useUsers from './composables/useUsers'

const { currentUser } = useUsers()

const routes = [
    { path: '/', name: 'index', component: index },
    { path: '/login', name: 'login', component: login },
    { path: '/registracia', name: 'registracia', component: registracia },
    { path: '/diary', name: 'diary', component: diary, meta: { auth: true } },
    { path: '/products', name: 'products', component: productspage, meta: { auth: true } },
    { path: '/profile', name: 'profile', component: profile, meta: { auth: true } },
    { path: '/history', name: 'history', component: historypage, meta: { auth: true } }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const { currentUser } = useUsers()
    if (to.meta.auth && !currentUser.value) {
        next({ name: 'login' })
    } else {
        next()
    }
})

export default router