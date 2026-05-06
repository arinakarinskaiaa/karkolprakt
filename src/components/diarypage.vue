<script setup>
import { ref, computed, watch } from "vue"
import useUsers from "../composables/useUsers"
import { useProducts } from "../composables/useProducts"

const { currentUser, saveCurrentUser } = useUsers()
const { products, filteredProducts, searchQuery } = useProducts()

const selectedProduct = ref("")
const grams = ref("")
const gramsError = ref("")
const showDropdown = ref(false)

watch(searchQuery, () => {
    showDropdown.value = searchQuery.value.length > 0 && filteredProducts.value.length > 0
})

function selectProduct(product) {
    selectedProduct.value = product.id
    searchQuery.value = product.name
    showDropdown.value = false
}

function addToDiary() {
    gramsError.value = ""
    if (!selectedProduct.value) {
        gramsError.value = "Выберите продукт"
        return
    }
    if (!grams.value) {
        gramsError.value = "Введите количество граммов"
        return
    }
    const num = Number(grams.value)
    if (isNaN(num) || num <= 0) {
        gramsError.value = "Введите корректное число"
        return
    }

    const today = new Date().toISOString().slice(0, 10)
    currentUser.value.diary.push({
        id: Date.now(),
        productId: selectedProduct.value,
        grams: num,
        date: today
    })

    saveCurrentUser()
    grams.value = ""
    searchQuery.value = ""
    selectedProduct.value = ""
    showDropdown.value = false
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
        <!-- Поиск с выпадающим списком -->
        <div class="search-container">
            <input v-model="searchQuery" placeholder="Поиск продукта..." class="search-input"
                @focus="showDropdown = searchQuery.length > 0" @blur="setTimeout(() => showDropdown = false, 200)" />

            <ul v-if="showDropdown" class="dropdown-list">
                <li v-if="filteredProducts.length === 0" class="no-results">
                    Ничего не найдено
                </li>
                <li v-for="p in filteredProducts" :key="p.id" @click="selectProduct(p)">
                    {{ p.name }} ({{ p.calories }} ккал)
                </li>
            </ul>
        </div>

        <input v-model="grams" type="number" min="0" placeholder="Граммы" @input="gramsError = ''" /><button
            @click="addToDiary">Добавить</button>
        <p>Не нашли подходящий продукт? <router-link to="/products">Добавьте свой</router-link></p>
        <p v-if="gramsError" class="error"> {{ gramsError }}</p>
    </div>
    <h2>Сегодня — {{ new Date().toLocaleDateString('ru-RU') }}</h2>
    <div v-for="item in todayList" :key="item.id" class="diary-item"><span> {{products.find(p =>
        p.id == item.productId)?.name}}</span>
        <span> {{ item.grams }} г</span>
    </div>
    <h3>Калории: {{ totalCalories.toFixed(0) }}ккал</h3>
</template>
<style scoped>
.add-form {
    margin-bottom: 30px;
    position: relative;
}

.search-container {
    position: relative;
    margin-bottom: 10px;
}

.search-input {
    width: 100%;
    max-width: 400px;
    padding: 12px;
    font-size: 16px;
    border: 2px solid #2e8b57;
    border-radius: 8px;
    outline: none;
}

.search-input:focus {
    border-color: #2e8b57;
    box-shadow: 0 0 0 3px rgba(46, 139, 87, 0.2);
}

.dropdown-list {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-width: 400px;
    background: white;
    border: 1px solid #ddd;
    border-top: none;
    border-radius: 0 0 8px 8px;
    max-height: 200px;
    overflow-y: auto;
    list-style: none;
    margin: 0;
    padding: 0;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-list li {
    padding: 10px 12px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.2s;
}

.dropdown-list li:hover {
    background: #f0f8f0;
    color: #2e8b57;
}

input[type="number"] {
    padding: 12px;
    width: 100%;
    max-width: 400px;
    border: 2px solid #ccc;
    border-radius: 8px;
    margin: 8px 0;
}

button {
    padding: 12px 24px;
    background: #2e8b57;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: 0.3s;
}

button:hover {
    background: #267c4a;
    transform: translateY(-1px);
}

.error {
    color: #e60000;
    font-size: 0.9rem;
    margin-top: 5px;
}

h2,
h3 {
    color: #2e8b57;
}

.diary-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: white;
    border: 1px solid #eee;
    border-radius: 8px;
    margin-bottom: 8px;
    font-size: 16px;
    color: #333;
}
</style>