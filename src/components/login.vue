<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import useUsers from "../composables/useUsers"

const router = useRouter()
const { login } = useUsers()

const loginval = ref("")
const password = ref("")

const errlog = ref("")
const errpass = ref("")


function submit() {
    errlog.value = ''
    errpass.value = ''
    if (!loginval.value || !password.value) {
        err.value = "Заполните все поля"
        return
    }
    const correct = login(loginval.value, password.value)
    if (correct) {
        router.push("/diary")
    }
    else {
        errpass.value = "Неверный логин или пароль"
    }
}
</script>

<template>
    <div class="form-page">
        <h1>Вход</h1>
        <form @submit.prevent="submit" class="login-form">
            <div class="form-group">
                <label>Логин:</label>
                <input v-model="loginval" type="text" class="npt" />
                <span class="error-message">{{ errlog }}</span>
            </div>

            <div class="form-group">
                <label>Пароль:</label>
                <input v-model="password" type="password" class="npt" />
                <span class="error-message">{{ errpass }}</span>
            </div>

            <button type="submit" class="btn">Войти</button>
        </form>

        <p>
            Нет аккаунта?
            <router-link :to="{ name: 'registracia' }">Зарегистрируйтесь</router-link>
        </p>
    </div>
</template>

<style scoped>
.form-page {
    max-width: 400px;
    margin: 60px auto;
    padding: 30px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-page h1 {
    text-align: center;
    color: #2e8b57;
    margin-bottom: 24px;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    font-weight: 500;
    margin-bottom: 6px;
    color: #333;
}

.form-group input {
    width: 100%;
    padding: 12px;
    border: 2px solid #2e8b57;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
}

.form-group input:focus {
    border-color: #2e8b57;
    box-shadow: 0 0 0 3px rgba(46, 139, 87, 0.2);
}

.error {
    color: #e60000;
    font-size: 0.85rem;
    margin-top: 4px;
    display: block;
}

button {
    width: 100%;
    padding: 12px;
    background: #2e8b57;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: 0.3s;
}

button:hover {
    background: #267c4a;
    transform: translateY(-1px);
}

.form-page p {
    text-align: center;
    margin-top: 20px;
    color: #555;
}

.form-page a {
    color: #2e8b57;
    font-weight: 500;
}
</style>