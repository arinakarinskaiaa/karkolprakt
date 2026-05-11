<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import { useRecipes } from "../composables/useRecipes"

const route = useRoute()

const { getById } = useRecipes()

const recipe = computed(() => {
    return getById(route.params.id)
})
</script>

<template>

    <div>

        <h2>Ингредиенты</h2>

        <ul class="ingredients">

            <li v-for="i in recipe.ingredients" :key="i">
                {{ i }}
            </li>

        </ul>

    </div>

</template>

<style scoped>
.ingredients {
    padding-left: 20px;
}

.ingredients li {
    margin-bottom: 10px;
}
</style>