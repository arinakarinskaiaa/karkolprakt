<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import useUsers from "../composables/useUsers"

const loginVal = ref("")
const password = ref("")
const router = useRouter()

const { login } = useUsers()

function submit() {
    const success = login(loginVal.value, password.value)

    if (success) {
        router.push("/diary")
    } else {
        alert("Неверные данные")
    }
}
</script>

<template>
    <h1>Вход</h1>

    <input v-model="loginVal" placeholder="Логин" />
    <input v-model="password" placeholder="Пароль" type="password" />

    <button @click="submit">Войти</button>

    <p>
        Нет аккаунта?
        <router-link to="/register">Регистрация</router-link>
    </p>
</template>