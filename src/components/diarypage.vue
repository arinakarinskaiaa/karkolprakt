<script setup>
import { ref, computed } from "vue"
import useUsers from "../composables/useUsers"
import { useProducts } from "../composables/useProducts"


const { currentUser, saveCurrentUser } = useUsers()
const { products, filteredProducts, searchQuery } = useProducts() // ← добавлено products

const selectedProduct = ref("")
const grams = ref("")
const gramsError = ref("")

function addToDiary() {
    gramsError.value = ""
    if (selectedProduct.value === "") {
        gramsError.value = "Выберите продукт"
        return
    }

    if (!grams.value) {
        gramsError.value = "Введите количество граммов"
        return
    }

    const num = Number(grams.value)
    if (isNaN(num) || num <= 0) {
        gramsError.value = "Введите корректное число (только цифры)"
        return
    }

    currentUser.value.diary.push({
        id: Date.now(),
        productId: selectedProduct.value,
        grams: Number(grams.value),
        date: new Date().toISOString().slice(0, 10)
    })

    saveCurrentUser()
    grams.value = ""
    searchQuery.value = "" // Очистить поиск после добавления
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

    <div class="add-form">
        <!-- Поиск при выборе продукта -->
        <input v-model="searchQuery" placeholder="Поиск продукта..." class="search-input" />

        <select v-model="selectedProduct">
            <option disabled value="">Выберите продукт</option>
            <option v-for="p in filteredProducts" :key="p.id" :value="p.id">
                {{ p.name }} ({{ p.calories }} ккал)
            </option>
        </select>

        <input v-model="grams" type="number" min="0" placeholder="Граммы" @input="gramsError = ''" />

        <button @click="addToDiary">Добавить</button>
        <p>Не нашли подходящий продукт?
            <router-link to="/products">Добавьте свой продукт</router-link>
        </p>

        <p v-if="gramsError" class="error">{{ gramsError }}</p>
    </div>

    <h2>Сегодня</h2>

    <div v-for="item in todayList" :key="item.id" class="diary-item">
        {{products.find(p => p.id == item.productId)?.name}} — {{ item.grams }} г
    </div>

    <h3>Калории: {{ totalCalories.toFixed(0) }}</h3>
</template>

<style scoped>
.search-input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 100%;
    max-width: 400px;
    margin-bottom: 10px;
}

.add-form {
    margin-bottom: 20px;
}

select,
input,
button {
    display: block;
    margin: 8px 0;
    padding: 8px;
    width: 100%;
    max-width: 400px;
}

.error {
    color: red;
    font-size: 0.9em;
}

.diary-item {
    padding: 6px 0;
    font-size: 16px;
}
</style>