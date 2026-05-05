import { ref } from "vue"

const users = ref(JSON.parse(localStorage.getItem("users")) || [])
const currentUser = ref(JSON.parse(localStorage.getItem("currentUser")) || null)

function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users.value))
}

function register(login, password) {
    const user = {
        id: Date.now(),
        login,
        password,
        diary: []
    }

    users.value.push(user)
    saveUsers()
}

function login(login, password) {
    const user = users.value.find(
        u => u.login === login && u.password === password
    )

    if (user) {
        currentUser.value = user
        localStorage.setItem("currentUser", JSON.stringify(user))
        return true
    }

    return false
}

function logout() {
    currentUser.value = null
    localStorage.removeItem("currentUser")
}

function saveCurrentUser() {
    const index = users.value.findIndex(u => u.id === currentUser.value.id)
    if (index !== -1) {
        users.value[index] = currentUser.value
    }

    localStorage.setItem("currentUser", JSON.stringify(currentUser.value))
    saveUsers()
}

export default function useUsers() {
    return {
        users,
        currentUser,
        register,
        login,
        logout,
        saveCurrentUser
    }
}