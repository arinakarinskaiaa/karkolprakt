<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import useUsers from "../composables/useUsers"

const login = ref("")
const password = ref("")
const errlog = ref("")
const errpass = ref("")

const router = useRouter()
const { register } = useUsers()

function submit() {
    errlog.value = ""
    errpass.value = ""
    if (!login.value) {
        errlog.value = 'Введите логин'
        return
    }
    if (login.value.length < 3) {
        errlog.value = 'Логин должен быть не короче 3 символов'
        return
    }
    if (!password.value) {
        errpass.value = 'Введите пароль'
        return
    }
    if (password.value.length < 5) {
        errpass.value = 'Пароль должен быть не короче 5 символов'
        return
    }
    register(login.value, password.value)
    router.push({ name: "login" })
}
</script>

<template>
    <div class="form-page">
        <h1>Регистрация</h1>
        <form @submit.prevent="submit" class="form">
            <div class="form-group">
                <label>Логин</label>
                <input v-model="login" type="text" placeholder="Введите логин" @input="errlog = ''" />
                <span class="error">{{ errlog }}</span>
            </div>

            <div class="form-group">
                <label>Пароль</label>
                <input v-model="password" type="password" placeholder="Введите пароль" @input="errpass = ''" />
                <span class="error">{{ errpass }}</span>
            </div>

            <button type="submit">Зарегистрироваться</button>
        </form>

        <p>
            Уже есть аккаунт?
            <router-link to="/login">Войти</router-link>
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
    font-size: 24px;
}

.form {
    display: flex;
    flex-direction: column;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    font-weight: 500;
    margin-bottom: 6px;
    color: #333;
    font-size: 14px;
}

.form-group input {
    width: 100%;
    padding: 12px;
    border: 2px solid #2e8b57;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s;
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
    min-height: 18px;
}

button {
    width: 100%;
    padding: 12px;
    background: #2e8b57;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
}

button:hover {
    background: #267c4a;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-page p {
    text-align: center;
    margin-top: 20px;
    color: #555;
    font-size: 14px;
}

.form-page a {
    color: #2e8b57;
    font-weight: 500;
    text-decoration: none;
}

.form-page a:hover {
    text-decoration: underline;
}
</style>
