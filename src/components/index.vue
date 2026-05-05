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
    <div class="home">
        <h1>Добро пожаловать!</h1>
        <p>Контролируй питание и считай калории каждый день вместе с нами</p>

        <div class="btn-group">
            <button @click="goRegister" class="btn register">Регистрация</button>
            <button @click="goLogin" class="btn login">Вход</button>
        </div>
    </div>
</template>

<style scoped>
.home {
    text-align: center;
    padding: 40px 20px;
    background: linear-gradient(135deg, #30ae25, #268a1c);
    color: white;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.home h1 {
    font-size: 2.8rem;
    margin-bottom: 10px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.home p {
    font-size: 1.2rem;
    margin-bottom: 30px;
    max-width: 600px;
    opacity: 0.9;
}

.btn-group {
    display: flex;
    gap: 15px;
}

.btn {
    padding: 14px 30px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
    min-width: 120px;
}

.btn.login {
    background: white;
    color: #30ae25;
}

.btn.login:hover {
    background: #f0f0f0;
    transform: translateY(-2px);
}

.btn.register {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    backdrop-filter: blur(5px);
}

.btn.register:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
}
</style>