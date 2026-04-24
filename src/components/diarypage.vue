<script setup>
import { ref, computed } from "vue"
import useUsers from "../composables/useUsers"
import { useProducts } from "../composables/useProducts"

const { currentUser, saveCurrentUser } = useUsers()
const { products } = useProducts()

const selectedProduct = ref("")
const grams = ref("")

function addToDiary() {
    if (!selectedProduct.value || !grams.value) return

    currentUser.value.diary.push({
        id: Date.now(),
        productId: selectedProduct.value,
        grams: Number(grams.value),
        date: new Date().toISOString().slice(0, 10)
    })

    saveCurrentUser()
    grams.value = ""
}

const today = new Date().toISOString().slice(0, 10)

const todayList = computed(() => {
    return currentUser.value?.diary?.filter(i => i.date === today) || []
})

const totalCalories = computed(() => {
    return todayList.value.reduce((sum, item) => {
        const product = products.value.find(p => p.id == item.productId)
        return sum + (product?.calories || 0) * item.grams / 100
    }, 0)
})
</script>

<template>
    <h1>Дневник питания</h1>

    <div>
        <select v-model="selectedProduct">
            <option disabled value="">Выбери продукт</option>
            <option v-for="p in products" :key="p.id" :value="p.id">
                {{ p.name }}
            </option>
        </select>

        <input v-model="grams" placeholder="Граммы" />

        <button @click="addToDiary">Добавить</button>
    </div>

    <h2>Сегодня</h2>

    <div v-for="item in todayList" :key="item.id">
        {{products.find(p => p.id == item.productId)?.name}} —
        {{ item.grams }} г
    </div>

    <h3>Калории: {{ totalCalories.toFixed(0) }}</h3>
</template>