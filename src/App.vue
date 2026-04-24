<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import useUsers from './composables/useUsers'

const router = useRouter()
const { currentUser, logout } = useUsers()

function doLogout() {
  logout()
  router.push('/login')
}
</script>

<template>
  <div>
    <nav>
      <RouterLink to="/">Дневник</RouterLink> |
      <RouterLink to="/products">Продукты</RouterLink> |
      <RouterLink v-if="!currentUser" to="/login">Вход</RouterLink>
      <button v-if="currentUser" @click="doLogout">Выйти</button>
    </nav>

    <RouterView />
  </div>
</template>

<style>
nav {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

a {
  margin-right: 10px;
}
</style>