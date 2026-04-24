import { ref } from "vue"

const products = ref(JSON.parse(localStorage.getItem("products")) || [
    { id: 1, name: "Яблоко", calories: 52 },
    { id: 2, name: "Рис", calories: 130 },
    { id: 3, name: "Курица", calories: 165 }
])

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products.value))
}

function addProduct(name, calories) {
    products.value.push({
        id: Date.now(),
        name,
        calories: Number(calories)
    })

    saveProducts()
}

export function useProducts() {
    return { products, addProduct }
}