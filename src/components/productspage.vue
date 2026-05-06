<script setup>
import { ref } from "vue"
import { useProducts } from "../composables/useProducts"

const { products, addProduct } = useProducts()

const name = ref("")
const calories = ref("")
const caloriesError = ref("")

function add() {
    caloriesError.value = ""

    if (!name.value.trim()) {
        caloriesError.value = "Введите название продукта"
        return
    }
    if (!calories.value || isNaN(calories.value) || Number(calories.value) <= 0) {
        caloriesError.value = "Введите корректное количество калорий"
        return
    }

    addProduct(name.value.trim(), calories.value)
    name.value = ""
    calories.value = ""
}
</script>

<template>
    <div class="products-page">
        <h1>База продуктов</h1>

        <!-- Форма добавления -->
        <div class="add-form">
            <input v-model="name" placeholder="Название продукта" />
            <input v-model="calories" type="number" min="0" step="1" placeholder="Калории (ккал)"
                @input="caloriesError = ''" />
            <button @click="add">Добавить продукт</button>
            <p v-if="caloriesError" class="error">{{ caloriesError }}</p>
        </div>

        <!-- Список продуктов -->
        <div class="products-list">
            <div v-for="p in products" :key="p.id" class="product-item">
                <span class="product-name">{{ p.name }}</span>
                <span class="product-calories">{{ p.calories }} ккал</span>
            </div>
        </div>

        <p v-if="products.length === 0" class="empty">
            Нет продуктов. Добавьте первый!
        </p>
    </div>
</template>



<style scoped>
.products-page {
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
}

.products-page h1 {
    text-align: center;
    color: #2e8b57;
    margin-bottom: 30px;
    font-size: 2rem;
}

.add-form {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #eee;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.add-form input {
    padding: 12px;
    border: 2px solid #2e8b57;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
}

.add-form input:focus {
    border-color: #2e8b57;
    box-shadow: 0 0 0 3px rgba(46, 139, 87, 0.2);
}

.add-form button {
    padding: 12px;
    background: #2e8b57;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 500;
}

.add-form button:hover {
    background: #267c4a;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.error {
    color: #e60000;
    font-size: 0.85rem;
    margin-top: 4px;
    text-align: left;
}

.products-list {
    display: grid;
    gap: 10px;
}

.product-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    background: white;
    border: 1px solid #eee;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    font-size: 16px;
    transition: transform 0.2s;
}

.product-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-name {
    font-weight: 500;
    color: #000;
    flex: 1;
}

.product-calories {
    color: #2e8b57;
    font-weight: 600;
    min-width: 100px;
    text-align: right;
}

.empty {
    text-align: center;
    color: #888;
    font-style: italic;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    border: 1px dashed #ccc;
}
</style>