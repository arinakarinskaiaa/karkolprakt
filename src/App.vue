<script setup>
import { RouterLink, RouterView } from 'vue-router'
import useUsers from './composables/useUsers'
import { useRouter } from 'vue-router'

const router = useRouter()
const { currentUser, logout } = useUsers()

function handleLogout() {
  logout()
  router.push('/')
}
</script>

<template>
  <div class="app-container">
    <!-- Шапка -->
    <header v-if="currentUser" class="main-header">
      <nav class="nav">
        <div class="nav-links">
          <RouterLink :to="{ name: 'diary' }">📝 Дневник питания</RouterLink>
          <RouterLink :to="{ name: 'products' }">🥦 Продукты</RouterLink>
          <RouterLink :to="{ name: 'history' }">📅 История</RouterLink>
          <RouterLink :to="{ name: 'water' }">💧 Водный баланс</RouterLink>

        </div>
        <div class="nav-right">
          <RouterLink :to="{ name: 'profile' }">👤 Профиль</RouterLink>
          <a href="#" @click.prevent="handleLogout" class="logout-link">🚪 Выйти</a>
        </div>
      </nav>
    </header>

    <!-- Основной контент -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- Подвал -->
    <footer class="footer">
      &copy; 2025 FoodDiary. Следи за питанием!
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f9f9f9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.main-header {
  background-color: #2e8b57;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
}

.nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: 0.3s;
}

.nav a:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav a.router-link-exact-active {
  background: white;
  color: #2e8b57;
  font-weight: bold;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  text-align: center;
  padding: 15px;
  background: #f0f0f0;
  color: #555;
  font-size: 0.9rem;
  border-top: 1px solid #ddd;
}
</style>
