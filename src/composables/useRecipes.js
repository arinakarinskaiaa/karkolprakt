import { ref } from "vue"
import ovsbanan from "../assets/img/овсянкасбананом.jpg"
import kurrus from "../assets/img/рисскурицей.jpg"
import tvogo from "../assets/img/творогсягодами.webp"
import oml from "../assets/img/омлетссыром.jpeg"
import salat from "../assets/img/салатгреческий.png"
import pasta from "../assets/img/пастаскурицей.jpg"
import avtost from "../assets/img/авакадотост.jpg"
import blini from "../assets/img/сладкиеблинчики.jpg"
import sup from "../assets/img/суп с овощами.jpg"
import ryb from "../assets/img/запеченаярыба.jpg"


const recipes = ref([
    {
        id: 1,
        title: "Овсянка с бананом",
        image: ovsbanan,
        calories: 320,
        difficulty: "easy",
        category: "breakfast",
        time: 10,

        description: "Полезный и быстрый завтрак",

        ingredients: [
            "Овсянка — 100 г",
            "Банан — 1 шт",
            "Молоко — 200 мл"
        ],

        steps: [
            "Налить молоко в кастрюлю",
            "Добавить овсянку",
            "Варить 5 минут",
            "Добавить банан"
        ]
    },

    {
        id: 2,
        title: "Курица с рисом",
        image: kurrus,
        calories: 540,
        difficulty: "medium",
        category: "lunch",
        time: 40,

        description: "Белковый обед для набора энергии",

        ingredients: [
            "Куриное филе — 200 г",
            "Рис — 100 г",
            "Соль",
            "Специи"
        ],

        steps: [
            "Сварить рис",
            "Обжарить курицу",
            "Добавить специи",
            "Подать вместе"
        ]
    },

    {
        id: 3,
        title: "Творог с ягодами",
        image: tvogo,

        calories: 250,
        difficulty: "easy",
        category: "breakfast",
        time: 5,

        description: "Лёгкий белковый перекус",

        ingredients: [
            "Творог — 200 г",
            "Ягоды — 50 г",
            "Мёд — 1 ч.л"
        ],

        steps: [
            "Выложить творог",
            "Добавить ягоды",
            "Полить мёдом"
        ]
    },

    {
        id: 4,
        title: "Омлет с сыром",
        image: oml,

        calories: 400,
        difficulty: "easy",
        category: "breakfast",
        time: 15,

        description: "Быстрый горячий завтрак",

        ingredients: [
            "Яйца — 3 шт",
            "Сыр — 50 г",
            "Молоко — 50 мл"
        ],

        steps: [
            "Смешать яйца и молоко",
            "Добавить сыр",
            "Обжарить на сковороде"
        ]
    },

    {
        id: 5,
        title: "Греческий салат",
        image: salat,

        calories: 280,
        difficulty: "easy",
        category: "dinner",
        time: 15,

        description: "Свежий овощной салат",

        ingredients: [
            "Помидоры",
            "Огурцы",
            "Сыр фета",
            "Оливки"
        ],

        steps: [
            "Нарезать овощи",
            "Добавить сыр",
            "Перемешать"
        ]
    },

    {
        id: 6,
        title: "Паста с курицей",
        image: pasta,

        calories: 620,
        difficulty: "medium",
        category: "lunch",
        time: 35,

        description: "Сытный итальянский обед",

        ingredients: [
            "Макароны — 150 г",
            "Курица — 200 г",
            "Сливки"
        ],

        steps: [
            "Сварить пасту",
            "Обжарить курицу",
            "Добавить сливки"
        ]
    },

    {
        id: 7,
        title: "Авокадо тост",
        image: avtost,

        calories: 350,
        difficulty: "easy",
        category: "breakfast",
        time: 10,

        description: "Популярный полезный завтрак",

        ingredients: [
            "Хлеб",
            "Авокадо",
            "Яйцо"
        ],

        steps: [
            "Поджарить хлеб",
            "Размять авокадо",
            "Добавить яйцо"
        ]
    },

    {
        id: 8,
        title: "Суп с овощами",
        image: sup,

        calories: 190,
        difficulty: "medium",
        category: "lunch",
        time: 50,

        description: "Лёгкий овощной суп",

        ingredients: [
            "Картофель",
            "Морковь",
            "Лук",
            "Бульон"
        ],

        steps: [
            "Нарезать овощи",
            "Варить 40 минут",
            "Добавить специи"
        ]
    },

    {
        id: 9,
        title: "Запечённая рыба",
        image: ryb,
        calories: 430,
        difficulty: "hard",
        category: "dinner",
        time: 45,
        description: "Полезный ужин с белком",
        ingredients: [
            "Рыба — 300 г",
            "Лимон",
            "Специи"
        ],
        steps: [
            "Подготовить рыбу",
            "Добавить специи",
            "Запекать 35 минут"

        ]
    },
    {
        id: 10,
        title: "Блинчики",
        image: blini,
        calories: 500,
        difficulty: "medium",
        category: "dessert",
        time: 30,
        description: "Домашние сладкие блинчики",
        ingredients: [
            "Мука",
            "Молоко",
            "Яйца",
            "Сахар"
        ],

        steps: [
            "Смешать ингредиенты",
            "Приготовить тесто",
            "Жарить на сковороде"
        ]
    }
])

function getById(id) {
    return recipes.value.find(r => r.id == id)
}
export function useRecipes() {
    return {
        recipes,
        getById
    }

}