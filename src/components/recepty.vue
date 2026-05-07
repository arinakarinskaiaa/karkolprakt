<script setup>
import { computed, ref } from "vue"
import { RouterLink } from "vue-router"
import { useRecipes } from "../composables/useRecipes"

const { recipes } = useRecipes()
console.log('Рецепты:', recipes.value)

const search = ref("")
const filter = ref("all")

const filteredRecipes = computed(() => {
    let result = recipes.value

    if (search.value) {
        result = result.filter(r =>
            r.title.toLowerCase().includes(search.value.toLowerCase())
        )
    }

    if (filter.value !== "all") {
        result = result.filter(r => r.difficulty === filter.value)
    }

    return result
})
</script>

<template>
    <div class="recipes-page">
        <h1 class="page-title">🍳 Рецепты</h1>

        <input v-model="search" placeholder="Поиск рецепта..." class="search-input" />

        <div class="filters">
            <button @click="filter = 'all'" :class="{ active: filter === 'all' }">
                Все
            </button>
            <button @click="filter = 'easy'" :class="{ active: filter === 'easy' }">
                Лёгкие
            </button>
            <button @click="filter = 'medium'" :class="{ active: filter === 'medium' }">
                Средние
            </button>
            <button @click="filter = 'hard'" :class="{ active: filter === 'hard' }">
                Сложные
            </button>
        </div>

        <!-- Список рецептов -->
        <div v-if="filteredRecipes.length" class="recipes-grid">
            <RouterLink v-for="recipe in filteredRecipes" :key="recipe.id"
                :to="{ name: 'recipe', params: { id: recipe.id } }" class="recipe-card">
                <img :src="recipe.image" alt="Фото рецепта" />
                <div class="recipe-info">
                    <h3>{{ recipe.title }}</h3>
                    <p>{{ recipe.description }}</p>
                    <div class="stats">
                        <span>{{ recipe.calories }} ккал</span>
                        <span>{{ recipe.time }} мин</span>
                    </div>
                </div>
            </RouterLink>
        </div>

        <p v-else class="no-results">Рецепты не найдены</p>
    </div>
</template>

<style scoped>
.recipes-page {
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 20px;
}

.page-title {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
    font-size: 2rem;
}

.search-input {
    width: 100%;
    padding: 14px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 12px;
    margin-bottom: 20px;
    outline: none;
}

.search-input:focus {
    border-color: #2e8b57;
    box-shadow: 0 0 0 2px rgba(230, 0, 0, 0.1);
}

.filters {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 30px;
}

.filters button {
    padding: 10px 20px;
    background: #f2f2f2;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: 0.2s;
}

.filters button.active,
.filters button:hover {
    background: #2e8b57;
    color: white;
}

.recipes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
}

.recipe-card {
    display: block;
    border-radius: 16px;
    overflow: hidden;
    text-decoration: none;
    color: #333;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: 0.3s;
}

.recipe-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.recipe-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.recipe-info {
    padding: 16px;
}

.recipe-info h3 {
    margin: 0 0 8px;
    font-size: 1.2rem;
}

.recipe-info p {
    color: #666;
    font-size: 0.95rem;
    margin: 0 0 12px;
}

.stats {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: #777;
}

.no-results {
    text-align: center;
    color: #999;
    font-style: italic;
}
</style>