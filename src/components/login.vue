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
.error-message {
    color: red;
}
</style>
