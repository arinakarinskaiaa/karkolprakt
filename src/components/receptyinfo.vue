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

        <h2>Описание</h2>

        <p>
            {{ recipe.description }}
        </p>

        <p>
            Сложность:
            <b>{{ recipe.difficulty }}</b>
        </p>

    </div>

</template>