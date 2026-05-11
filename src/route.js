import { createRouter, createWebHashHistory } from 'vue-router'

import index from './components/index.vue'
import login from './components/login.vue'
import registracia from './components/registracia.vue'
import diary from './components/diarypage.vue'
import productspage from './components/productspage.vue'
import profile from './components/profile.vue'
import historypage from './components/historypage.vue'
import water from './components/water.vue'
import nonepage from './components/nonepage.vue'
import recepty from './components/recepty.vue'
import receptydetail from './components/receptydetail.vue'
import receptyinfo from './components/receptyinfo.vue'
import receptyingredients from './components/receptyingredients.vue'
import receptysteps from './components/receptysteps.vue'

const routes = [
    { path: '/', name: 'index', component: index },
    { path: '/login', name: 'login', component: login },
    { path: '/registracia', name: 'registracia', component: registracia },
    { path: '/diary', name: 'diary', component: diary, meta: { auth: true } },
    { path: '/products', name: 'products', component: productspage, meta: { auth: true } },
    { path: '/profile', name: 'profile', component: profile, meta: { auth: true } },
    { path: '/history', name: 'history', component: historypage, meta: { auth: true } },
    { path: '/water', name: 'water', component: water, meta: { auth: true } },

    { path: '/recepty', component: recepty, name: 'recepty', meta: { auth: true } },

    {
        path: '/recepty/:id',
        component: receptydetail,
        name: 'recipe',
        redirect: to => {
            return `/recepty/${to.params.id}/description`
        },
        children: [
            {
                path: 'description',
                component: receptyinfo,
                name: 'recepty.description'
            },
            {
                path: 'ingredients',
                component: receptyingredients,
                name: 'recepty.ingredients'
            },
            {
                path: 'steps',
                component: receptysteps,
                name: 'recepty.steps'
            }
        ]
    },

    { path: '/:pathname(.*)', name: 'nonepage', component: nonepage }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})


import useUsers from './composables/useUsers'
const { currentUser } = useUsers()

router.beforeEach((to, from, next) => {
    if (to.meta.auth && !currentUser.value) {
        next({ name: 'login' })
    } else {
        next()
    }
})

export default router