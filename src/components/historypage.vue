<script setup>
import { ref, computed, watch } from "vue"
import useUsers from "../composables/useUsers"
import { useProducts } from "../composables/useProducts"

const { currentUser, saveCurrentUser } = useUsers()
const { products, filteredProducts, searchQuery } = useProducts()


const selectedDate = ref(new Date().toISOString().slice(0, 10))


const showDropdown = ref(false)
const selectedProduct = ref("")
const grams = ref("")
const error = ref("")

// Фильтруем записи по дате
const dailyItems = computed(() => {
    return currentUser.value?.diary?.filter(i => i.date === selectedDate.value) || []
})

// Общие калории за день
const dailyCalories = computed(() => {
    return dailyItems.value.reduce((sum, item) => {
        const product = products.value.find(p => p.id == item.productId)
        return sum + (product?.calories || 0) * item.grams / 100
    }, 0)
})

// Форматируем дату для отображения
function formatDate(dateStr) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' }
    return new Date(dateStr).toLocaleDateString('ru-RU', options)
}

// Показываем/скрываем выпадающий список
watch(searchQuery, () => {
    showDropdown.value = searchQuery.value.length > 0 && filteredProducts.value.length > 0
})

function selectProductForAdd(product) {
    selectedProduct.value = product.id
    searchQuery.value = product.name
    showDropdown.value = false
    error.value = ""
}

function addToDay() {
    error.value = ""
    if (!selectedProduct.value) {
        error.value = "Выберите продукт"
        return
    }
    if (!grams.value || isNaN(grams.value) || Number(grams.value) <= 0) {
        error.value = "Введите корректное количество граммов"
        return
    }

    currentUser.value.diary.push({
        id: Date.now(),
        productId: selectedProduct.value,
        grams: Number(grams.value),
        date: selectedDate.value
    })

    saveCurrentUser()
    grams.value = ""
    searchQuery.value = ""
    selectedProduct.value = ""
    showDropdown.value = false
}

function removeItem(id) {
    currentUser.value.diary = currentUser.value.diary.filter(i => i.id !== id)
    saveCurrentUser()
}
</script>

<template>
    <h1>История питания</h1>

    <div class="date-selector">
        <label>Дата: </label>
        <input v-model="selectedDate" type="date" />
    </div>

    <h2>{{ formatDate(selectedDate) }}</h2>


    <div class="stats">
        <h3>Калории: {{ dailyCalories.toFixed(0) }} ккал</h3>
    </div>


    <div class="add-form">
        <div class="search-container">
            <input v-model="searchQuery" placeholder="Поиск продукта..." class="search-input"
                @focus="showDropdown = searchQuery.length > 0" @blur="setTimeout(() => showDropdown = false, 200)" />

            <ul v-if="showDropdown" class="dropdown-list">
                <li v-if="filteredProducts.length === 0" class="no-results">Ничего не найдено</li>
                <li v-for="p in filteredProducts" :key="p.id" @click="selectProductForAdd(p)">
                    {{ p.name }} ({{ p.calories }} ккал)
                </li>
            </ul>
        </div>

        <input v-model="grams" type="number" min="0" placeholder="Граммы" @input="error = ''" />

        <button @click="addToDay">Добавить в день</button>
        <p v-if="error" class="error">{{ error }}</p>
    </div>

    <!-- Карточки продуктов за день -->
    <div v-if="dailyItems.length === 0" class="empty">
        Нет записей на эту дату.
    </div>

    <div v-else class="items-grid">
        <div v-for="item in dailyItems" :key="item.id" class="product-card">
            <div class="product-info">
                <span class="name">
                    {{products.find(p => p.id == item.productId)?.name}}
                </span>
                <span class="details">
                    {{ item.grams }} г · {{((products.find(p => p.id == item.productId)?.calories || 0) * item.grams /
                        100).toFixed(0)}} ккал
                </span>
            </div>
            <button @click="removeItem(item.id)" class="btn-remove">×</button>
        </div>
    </div>
</template>

<style scoped>
h1 {
    color: #2e8b57;
}

.date-selector {
    margin: 20px 0;
}

.date-selector input {
    padding: 8px;
    border: 2px solid #2e8b57;
    border-radius: 6px;
    font-size: 16px;
}

.stats {
    background: #f0f8f0;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    color: #2e8b57;
    font-weight: bold;
    margin: 20px 0;
}

.add-form {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #eee;
    margin-bottom: 30px;
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

.no-results {
    text-align: center;
    color: #888;
    font-style: italic;
    padding: 10px;
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

.empty {
    text-align: center;
    color: #888;
    font-style: italic;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
}

.items-grid {
    display: grid;
    gap: 10px;
    margin-top: 20px;
}

.product-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: white;
    border: 1px solid #eee;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.product-info {
    flex: 1;
}

.name {
    font-weight: 600;
    color: #000;
    display: block;
}

.details {
    font-size: 0.9rem;
    color: #666;
}

.btn-remove {
    background: #e60000;
    color: white;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 50%;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-remove:hover {
    background: #cc0000;
}
</style>