import { createRouter, createWebHistory } from "vue-router"
import login from "./components/login.vue"
import registracia from "./components/registracia.vue"
import diary from "./components/diarypage.vue"
import productspage from "./components/productspage.vue"
const routes = [
    { path: "/", name: "diary", name: "diary", component: diary },
    { path: "/registracia", name: "registracia", component: registracia },
    { path: "/login", name: "login", component: login },
    { path: "/products", name: "products", component: productspage }
]
export default createRouter({
    history: createWebHistory(),
    routes
})