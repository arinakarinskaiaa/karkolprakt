<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goLogin() {
    router.push('/login')
}

function goRegister() {
    router.push('/registracia')
}
</script>

<template>
    <div class="welcome-container">
        <!-- Основной блок -->
        <div class="welcome-content">
            <h1>Добро пожаловать в FoodDiary!</h1>
            <p class="subtitle">
                Контролируй питание, считай калории и достигай своих целей — легко и удобно.
            </p>

            <div class="features">
                <div class="feature">
                    <span>📝</span>
                    <h3>Ведите дневник питания</h3>
                    <p>Добавляйте продукты каждый день и следите за потреблением калорий.</p>
                </div>

                <div class="feature">
                    <span>📊</span>
                    <h3>Смотрите историю</h3>
                    <p>Анализируйте приём пищи за прошлые дни и отслеживайте прогресс.</p>
                </div>

                <div class="feature">
                    <span>🥦</span>
                    <h3>База продуктов</h3>
                    <p>Большая библиотека с калориями — или добавьте свой продукт.</p>
                </div>
            </div>

            <div class="btn-group">
                <button @click="goRegister" class="btn register">Начать сейчас</button>
                <button @click="goLogin" class="btn login">Уже есть аккаунт? Войти</button>
            </div>
        </div>

        <div class="welcome-image">
            <div class="illustration">
                🥗<br>🍎<br>🥦<br>🍗<br>🥑<br>🍚
            </div>
        </div>
    </div>
</template>


<style scoped>
.welcome-container {
    min-height: 100vh;
    display: flex;
    background: #f0f8f0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
}


.welcome-content {
    flex: 1;
    padding: 60px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 600px;
}

.welcome-content h1 {
    font-size: 2.8rem;
    color: #2e8b57;
    margin-bottom: 16px;
    font-weight: 600;
}

.subtitle {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 40px;
    line-height: 1.6;
}

.features {
    margin-bottom: 40px;
}

.feature {
    margin-bottom: 20px;
}

.feature span {
    font-size: 2rem;
    vertical-align: middle;
    margin-right: 10px;
}

.feature h3 {
    display: inline;
    font-size: 1.3rem;
    color: #2e8b57;
    margin: 0;
}

.feature p {
    margin: 8px 0 0 32px;
    color: #666;
    font-size: 0.95rem;
}

.btn-group {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.btn {
    padding: 14px 30px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
}

.btn.login {
    background: #2e8b57;
    color: white;
}

.btn.login:hover {
    background: #267c4a;
    transform: translateY(-2px);
}

.btn.register {
    background: white;
    color: #2e8b57;
    border: 2px solid #2e8b57;
}

.btn.register:hover {
    background: #f0f8f0;
    transform: translateY(-2px);
}


.welcome-image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #2e8b57;
    color: white;
    font-size: 4rem;
    text-align: center;
    font-weight: bold;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    box-shadow: -10px 0 20px rgba(0, 0, 0, 0.1);
}

.illustration {
    line-height: 2;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Адаптив под мобильные */
@media (max-width: 900px) {
    .welcome-container {
        flex-direction: column;
    }

    .welcome-image {
        border-radius: 0;
        font-size: 3rem;
    }

    .welcome-content {
        padding: 40px 20px;
        max-width: none;
    }
}
</style>