<script setup>
import { ref } from "vue"
import { useProducts } from "../composables/useProducts"

const { products, addProduct } = useProducts()

const name = ref("")
const calories = ref("")

function add() {
    if (!name.value || !calories.value) return

    addProduct(name.value, calories.value)

    name.value = ""
    calories.value = ""
}
</script>

<template>
    <h1>Продукты</h1>

    <input v-model="name" placeholder="Название" />
    <input v-model="calories" placeholder="Калории" />

    <button @click="add">Добавить</button>

    <div v-for="p in products" :key="p.id">
        {{ p.name }} — {{ p.calories }} ккал
    </div>
</template>