<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import useUsers from "../composables/useUsers"

const loginVal = ref("")
const password = ref("")
const router = useRouter()

const { register } = useUsers()

function submit() {
    register(loginVal.value, password.value)
    router.push("/login")
}
</script>

<template>
    <h1>Регистрация</h1>

    <input v-model="loginVal" placeholder="Логин" />
    <input v-model="password" placeholder="Пароль" type="password" />

    <button @click="submit">Зарегистрироваться</button>
</template>