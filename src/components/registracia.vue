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
        <form @submit.prevent="submit">
            <input v-model="login" placeholder="Логин" class="npt" />
            <span class="errors">{{ errlog }}</span>
            <input v-model="password" placeholder="Пароль" class="npt" type="password" />
            <span class="errors">{{ errpass }}</span>

            <button class="btn">Зарегистрироваться</button>
        </form>
    </div>
    <p>
        Есть аккаунт?
        <router-link to="/login">Войти</router-link>
    </p>
</template>