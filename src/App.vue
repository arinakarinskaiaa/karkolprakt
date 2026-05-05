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
    <!-- Навигация показывается ТОЛЬКО если пользователь вошёл -->
    <header v-if="currentUser" class="main-header">
      <nav class="nav">
        <!-- Левые/центральные ссылки -->
        <div class="nav-links">
          <RouterLink to="/diary">📝 Дневник питания</RouterLink>
          <RouterLink to="/products">🥦 Продукты</RouterLink>
        </div>

        <!-- Правые ссылки (Профиль и Выйти) -->
        <div class="nav-right">
          <RouterLink to="/profile">👤 Профиль</RouterLink>
          <a href="#" @click.prevent="handleLogout" class="logout-link">🚪 Выйти</a>
        </div>
      </nav>
    </header>

    <!-- Основной контент -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- Подвал всегда -->
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
}

.main-header {
  background-color: #30ae25;
  color: white;
  padding: 10px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  font-size: 1.1rem;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-right {
  display: flex;
  gap: 15px;
}

.nav a {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background 0.3s;
}

.nav a:hover {
  background: rgba(255, 255, 255, 0.2);
}

.nav a.router-link-exact-active {
  background: white;
  color: #30ae25;
  font-weight: bold;
}

.logout-link {
  background: #e60000 !important;
  font-weight: bold;
}

.logout-link:hover {
  background: #cc0000 !important;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 900px;
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