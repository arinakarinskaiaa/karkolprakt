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

        <h2>Приготовление</h2>

        <ol class="steps">

            <li v-for="s in recipe.steps" :key="s">
                {{ s }}
            </li>

        </ol>

    </div>

</template>

<style scoped>
.steps {
    padding-left: 20px;
}

.steps li {
    margin-bottom: 15px;
    line-height: 1.5;
}
</style>