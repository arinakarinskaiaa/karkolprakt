import { ref, computed } from "vue"

// Полный список продуктов
const products = ref(JSON.parse(localStorage.getItem("products")) || [
    { id: 1, name: "Яблоко", calories: 52 },
    { id: 2, name: "Рис", calories: 130 },
    { id: 3, name: "Курица", calories: 165 },
    { id: 4, name: "Банан", calories: 89 },
    { id: 5, name: "Апельсин", calories: 47 },
    { id: 6, name: "Гречка", calories: 116 },
    { id: 7, name: "Творог", calories: 150 },
    { id: 8, name: "Йогурт", calories: 57 },
    { id: 9, name: "Овсянка", calories: 389 },
    { id: 10, name: "Фундук", calories: 628 },
    { id: 11, name: "Миндаль", calories: 579 },
    { id: 12, name: "Салат", calories: 15 },
    { id: 13, name: "Картофель", calories: 77 },
    { id: 14, name: "Макароны", calories: 371 },
    { id: 15, name: "Сыр", calories: 400 },
    { id: 16, name: "Хлеб", calories: 265 },
    { id: 17, name: "Говядина", calories: 250 },
    { id: 18, name: "Рыба", calories: 206 },
    { id: 19, name: "Авокадо", calories: 160 },
    { id: 20, name: "Молоко", calories: 42 }
])

// Поисковой запрос
const searchQuery = ref('')

// Фильтрация по названию продукта
const filteredProducts = computed(() => {
    if (!searchQuery.value.trim()) {
        return products.value
    }
    const query = searchQuery.value.toLowerCase().trim()
    return products.value.filter(p => p.name.toLowerCase().includes(query))
})

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
    return {
        products,
        filteredProducts,
        searchQuery,
        addProduct
    }
}