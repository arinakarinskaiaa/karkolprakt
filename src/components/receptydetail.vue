<script setup>
import { computed } from "vue"
import { useRoute, RouterView, RouterLink } from "vue-router"
import { useRecipes } from "../composables/useRecipes"

const route = useRoute()
const { getById } = useRecipes()
const recipe = computed(() => getById(route.params.id))
</script>

<template>
    <div v-if="recipe" class="recipe-detail-page">
        <RouterLink class="back-button" :to="{ name: 'recepty' }">
            ← Назад
        </RouterLink>

        <div class="recipe-header">
            <img :src="recipe.image" alt="Фото блюда" class="header-image" />
            <div class="header-info">
                <h1>{{ recipe.title }}</h1>
                <div class="recipe-stats">
                    <span>{{ recipe.calories }} ккал</span>
                    <span>{{ recipe.time }} мин</span>
                    <span>Сложность: {{ recipe.difficulty }}</span>
                </div>
            </div>
        </div>

        <div class="tabs">
            <RouterLink :to="{ name: 'recepty.description', params: { id: recipe.id } }" class="tab">
                Описание
            </RouterLink>
            <RouterLink :to="{ name: 'recepty.ingredients', params: { id: recipe.id } }" class="tab">
                Ингредиенты
            </RouterLink>
            <RouterLink :to="{ name: 'recepty.steps', params: { id: recipe.id } }" class="tab">
                Приготовление
            </RouterLink>
        </div>

        <div class="tab-content">
            <RouterView />
        </div>
    </div>

    <div v-else class="not-found">
        <h2>Рецепт не найден</h2>
        <RouterLink to="/recepty" class="btn">← К списку рецептов</RouterLink>
    </div>
</template>


<style scoped>
.recipe-detail-page {
    max-width: 1000px;
    margin: 40px auto;
    padding: 0 20px;
}

.back-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 1.1rem;
    color: #2e8b57;
    text-decoration: none;
    font-weight: 500;
    padding: 10px 16px;
    background: white;
    border: 2px solid #2e8b57;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(230, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
    top: -10px;

    left: -10px;

}

.back-button:hover {
    background: #2e8b57;
    color: white;
    transform: translateY(-2px);
}

.recipe-header {
    display: flex;
    gap: 30px;
    margin-bottom: 30px;
    align-items: center;
}

.header-image {
    width: 300px;
    height: 220px;
    object-fit: cover;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-info h1 {
    margin: 0 0 10px;
    font-size: 2rem;
    color: #333;
}

.recipe-stats {
    display: flex;
    gap: 15px;
    color: #666;
    font-size: 0.95rem;
}

.tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
}

.tab {
    padding: 10px 16px;
    text-decoration: none;
    color: #555;
    font-weight: 500;
    border-radius: 8px 8px 0 0;
}

.tab.router-link-active {
    background: #2e8b57;
    color: white;
}

.tab-content {
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.not-found {
    text-align: center;
    padding: 60px 20px;
    color: #999;
}

.not-found .btn {
    margin-top: 15px;
    padding: 10px 20px;
    background: #2e8b57;
    color: white;
    text-decoration: none;
    border-radius: 8px;
}
</style>