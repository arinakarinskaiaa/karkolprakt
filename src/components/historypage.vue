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

const selectedCategory = ref("breakfast")

// Фильтруем записи по дате
const dailyItems = computed(() => {
    return currentUser.value?.diary?.filter(i => i.date === selectedDate.value) || []
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

    dailyItems.value.forEach(item => {
        const cat = item.category || 'snack'
        if (!groups[cat]) groups[cat] = []
        groups[cat].push(item)
    })

    return { groups, labels }
})

function hideDropdownWithDelay() {
    setTimeout(() => {
        showDropdown.value = false
    }, 200)
}

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
        date: selectedDate.value,
        category: selectedCategory.value
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

const dailyWater = computed(() => {
    return currentUser.value?.water?.filter(w => w.date === selectedDate.value) || []
})

const totalWater = computed(() => {
    if (!currentUser.value?.water) return []

    return dailyWater.value.reduce((sum, w) => sum + w.amount, 0)
})

const waterGoal = computed(() => {
    return currentUser.value.waterGoal || 2000
})

function addWater(amount) {
    const num = Number(amount)
    if (isNaN(num) || num <= 0) return

    if (!currentUser.value.water) {
        currentUser.value.water = []
    }

    currentUser.value.water.push({
        id: Date.now(),
        amount: num,
        date: selectedDate.value
    })

    saveCurrentUser()
}

function removeWater(id) {
    currentUser.value.water = currentUser.value.water.filter(w => w.id !== id)
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

    <div v-if="dailyItems.length === 0" class="empty">
        Нет записей на эту дату.
    </div>


    <div v-for="(items, key) in groupedItems.groups" :key="key">
        <div v-if="items.length > 0" class="category-section">
            <h3>{{ groupedItems.labels[key] }}</h3>
            <div v-for="item in items" :key="item.id" class="product-card">
                <div class="product-info">
                    <span class="name">{{products.find(p => p.id == item.productId)?.name}}</span>
                    <span class="details">{{ item.grams }} г · {{((products.find(p => p.id == item.productId)?.calories
                        || 0) * item.grams / 100).toFixed(0)}} ккал</span>
                </div>
                <button @click="removeItem(item.id)" class="btn-remove">×</button>
            </div>
        </div>
    </div>

    <div class="add-form">
        <h3>Забыли записать? Сделайте это сейчас!</h3>
        <div class="search-container">
            <input v-model="searchQuery" placeholder="Поиск продукта..." class="search-input"
                @focus="showDropdown = searchQuery.length > 0" @blur="hideDropdownWithDelay" />

            <ul v-if="showDropdown" class="dropdown-list">
                <li v-if="filteredProducts.length === 0" class="no-results">Ничего не найдено</li>
                <li v-for="p in filteredProducts" :key="p.id" @click="selectProductForAdd(p)">
                    {{ p.name }} ({{ p.calories }} ккал)
                </li>
            </ul>
        </div>

        <div class="form-row">
            <div class="input-group">
                <label>Граммы</label>
                <input v-model="grams" type="number" min="0" placeholder="Граммы" @input="error = ''" />
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

        <button @click="addToDay">Добавить в день</button>
        <p v-if="error" class="error">{{ error }}</p>
    </div>

    <div class="water-section">
        <h3>💧 Водный баланс</h3>

        <div class="progress-bar">
            <div class="bar">
                <div class="fill" :style="{ width: `${Math.min(totalWater / waterGoal * 100, 100)}%` }">
                </div>
            </div>
            <p>{{ totalWater }} / {{ waterGoal }} мл</p>
        </div>

        <div class="quick-add-water">
            <button @click="addWater(250)">+250 мл</button>
            <button @click="addWater(500)">+500 мл</button>
        </div>

        <div v-if="dailyWater.length > 0" class="water-list">
            <div v-for="w in dailyWater" :key="w.id" class="water-item">
                <span>{{ w.amount }} мл</span>
                <button @click="removeWater(w.id)" class="btn-remove">×</button>
            </div>
        </div>
        <div v-else class="empty-water">
            Нет данных о воде на эту дату.
        </div>
    </div>
</template>

<style scoped>
h1 {
    text-align: center;
    color: #2e8b57;
    margin-bottom: 20px;
    font-size: 2rem;
}

.date-selector {
    text-align: center;
    margin: 20px 0;
}

.date-selector label {
    font-size: 16px;
    color: #555;
    margin-right: 8px;
}

.date-selector input {
    padding: 12px;
    border: 2px solid #2e8b57;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
    background: white;
    transition: border-color 0.3s;
    width: 200px;
}

.date-selector input:focus {
    border-color: #2e8b57;
    box-shadow: 0 0 0 3px rgba(46, 139, 87, 0.2);
}

h2 {
    text-align: center;
    font-size: 1.2rem;
    color: #555;
    margin: 10px 0 20px;
}

.stats {
    text-align: center;
    margin: 20px 0;
}

.stats h3 {
    color: #2e8b57;
    font-size: 1.3rem;
    font-weight: 500;
}

.add-form {
    max-width: 500px;
    margin: 0 auto 30px;
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #eee;
    overflow: hidden;
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
    box-sizing: border-box;
    display: block;
}

.search-input:focus {
    border-color: #2e8b57;
    box-shadow: 0 0 0 3px rgba(46, 139, 87, 0.2);
}

.dropdown-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
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
    box-sizing: border-box;
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
    max-width: 100%;
    padding: 12px;
    border: 2px solid #2e8b57;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
    background: white;
    transition: border-color 0.3s;
    box-sizing: border-box;
    display: block;
}

.input-group input:focus,
.input-group select:focus {
    border-color: #2e8b57;
    box-shadow: 0 0 0 3px rgba(46, 139, 87, 0.2);
}

button {
    padding: 12px 24px;
    background: #2e8b57;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s;
    width: auto;
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

.empty {
    text-align: center;
    color: #888;
    font-style: italic;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    margin: 20px 0;
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

.product-card {
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

.product-info {
    flex: 1;
}

.name {
    font-weight: 500;
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
    margin-left: 8px;
}

.btn-remove:hover {
    background: #cc0000;
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

.water-section {
    max-width: 500px;
    margin: 30px auto;
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #eee;
}

.water-section h3 {
    color: #0066cc;
    margin-bottom: 10px;
    font-size: 1.3em;
    text-align: center;
}

.progress-bar {
    margin-bottom: 12px;
}

.bar {
    width: 100%;
    height: 16px;
    background: #cce6ff;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 6px;
}

.fill {
    height: 100%;
    background: #0099ff;
    transition: width 0.3s ease;
}

.quick-add-water {
    display: flex;
    gap: 10px;
    margin-bottom: 12px;
    justify-content: center;
    flex-wrap: wrap;
}

.quick-add-water button {
    padding: 8px 12px;
    background: #0066cc;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
}

.quick-add-water button:hover {
    background: #0055aa;
}

.water-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
    justify-content: center;
}

.water-item {
    display: flex;
    align-items: center;
    background: #f0f8ff;
    padding: 6px 10px;
    border: 1px solid #cce6ff;
    border-radius: 16px;
    font-size: 14px;
    color: #333;
}

.water-item .btn-remove {
    width: 22px;
    height: 22px;
    font-size: 14px;
    margin-left: 6px;
}

.empty-water {
    font-style: italic;
    color: #888;
    font-size: 14px;
    padding: 8px 0;
    text-align: center;
}
</style>