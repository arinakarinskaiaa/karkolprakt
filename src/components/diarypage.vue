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

const selectedCategory = ref("breakfast")

watch(searchQuery, () => {
    showDropdown.value = searchQuery.value.length > 0 && filteredProducts.value.length > 0
})

function selectProduct(product) {
    selectedProduct.value = product.id
    searchQuery.value = product.name
    showDropdown.value = false
}

function hideDropdownWithDelay() {
    setTimeout(() => {
        showDropdown.value = false
    }, 200)
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
        date: today,
        category: selectedCategory.value
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

const groupedItems = computed(() => {
    const groups = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: []
    }

    const labels = {
        breakfast: 'Завтрак',
        lunch: 'Обед',
        dinner: 'Ужин',
        snack: 'Перекус'
    }

    todayList.value.forEach(item => {
        const cat = item.category || 'snack'
        if (!groups[cat]) groups[cat] = []
        groups[cat].push(item)
    })

    return { groups, labels }
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

    <!-- Форма добавления -->
    <div class="add-form">
        <div class="search-container">
            <input v-model="searchQuery" placeholder="Поиск продукта..." class="search-input"
                @focus="showDropdown = searchQuery.length > 0" @blur="hideDropdownWithDelay" />

            <ul v-if="showDropdown" class="dropdown-list">
                <li v-if="filteredProducts.length === 0" class="no-results">Ничего не найдено</li>
                <li v-for="p in filteredProducts" :key="p.id" @click="selectProduct(p)">
                    {{ p.name }} ({{ p.calories }} ккал)
                </li>
            </ul>
        </div>

        <div class="form-row">
            <div class="input-group">
                <label>Граммы</label>
                <input v-model="grams" type="number" min="0" placeholder="Введите количество"
                    @input="gramsError = ''" />
            </div>

            <div class="input-group">
                <label>Приём пищи</label>
                <select v-model="selectedCategory">
                    <option value="breakfast">Завтрак</option>
                    <option value="lunch">Обед</option>
                    <option value="dinner">Ужин</option>
                    <option value="snack">Перекус</option>
                </select>
            </div>
        </div>
        <div class="quick-links">
            <router-link class="link" :to="{ name: 'water' }">💧 Добавить воду</router-link>

        </div>

        <button @click="addToDiary">Добавить в дневник</button>

        <p class="hint">
            Не нашли продукт? <router-link to="/products">Добавьте свой</router-link>
        </p>
        <p v-if="gramsError" class="error">{{ gramsError }}</p>
    </div>

    <h2>Сегодня — {{ new Date().toLocaleDateString('ru-RU') }}</h2>
    <div class="quick-links">
        <router-link class="link" :to="{ name: 'history' }">📅 Посмотреть историю</router-link>


    </div>


    <div v-for="(items, key) in groupedItems.groups" :key="key">
        <div v-if="items.length > 0" class="category-section">
            <h3>{{ groupedItems.labels[key] }}</h3>
            <div v-for="item in items" :key="item.id" class="diary-item">
                <span>{{products.find(p => p.id == item.productId)?.name}}</span>
                <span>{{ item.grams }} г</span>
            </div>
        </div>
    </div>


    <h3>Калории: {{ totalCalories.toFixed(0) }} ккал</h3>
</template>
<style scoped>
.add-form {
    max-width: 500px;
    margin: 0 auto 30px;
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #eee;
}


.search-container {
    position: relative;
    margin-bottom: 16px;
}

.search-input {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border: 2px solid #2e8b57;
    border-radius: 8px;
    outline: none;
    background: white;
    transition: border-color 0.3s;
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

.form-row {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    flex-wrap: wrap;
}

.input-group {
    flex: 1;
    min-width: 140px;
}

.input-group label {
    display: block;
    font-size: 14px;
    color: #555;
    margin-bottom: 6px;
    font-weight: 500;
}

.input-group input,
.input-group select {
    width: 100%;
    padding: 12px;
    border: 2px solid #2e8b57;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
    background: white;
    transition: border-color 0.3s;
}

.input-group input:focus,
.input-group select:focus {
    border-color: #2e8b57;
    box-shadow: 0 0 0 3px rgba(46, 139, 87, 0.2);
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

.error {
    color: #e60000;
    font-size: 0.9rem;
    margin-top: 5px;
    text-align: left;
}

.hint {
    text-align: center;
    font-size: 14px;
    color: #555;
    margin: 10px 0 0;
}

.hint a {
    color: #2e8b57;
    font-weight: 500;
    text-decoration: none;
}

.hint a:hover {
    text-decoration: underline;
}

.quick-links {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 20px 0;
    flex-wrap: wrap;
}

.link {
    color: #2e8b57;
    text-decoration: none;
    font-weight: 500;
    font-size: 14px;
    border-bottom: 1px dashed #2e8b57;
    padding-bottom: 2px;
    transition: all 0.3s ease;
}

.link:hover {
    color: #267c4a;
    border-bottom: 1px solid #267c4a;
    transform: translateY(-1px);
}

h1 {
    text-align: center;
    color: #2e8b57;
    margin-bottom: 20px;
    font-size: 2rem;
}

h2 {
    text-align: center;
    font-size: 1.2rem;
    color: #555;
    margin: 20px 0;
}

h3 {
    text-align: center;
    color: #2e8b57;
    font-size: 1.3rem;
    margin-top: 20px;
}

.category-section {
    max-width: 500px;
    margin: 30px auto 20px;
    text-align: left;
}

.category-section h3 {
    color: #2e8b57;
    margin-bottom: 10px;
    font-size: 1.3rem;
    border-bottom: 2px solid #f0f8f0;
    padding-bottom: 4px;
}

.diary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: white;
    border: 1px solid #eee;
    border-radius: 8px;
    margin-bottom: 8px;
    font-size: 15px;
    color: #333;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.diary-item span:first-child {
    font-weight: 500;
    flex: 1;
}
</style>