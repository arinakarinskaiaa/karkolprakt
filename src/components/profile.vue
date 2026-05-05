<script setup>
import { ref } from 'vue'
import useUsers from '../composables/useUsers'

const { currentUser, saveCurrentUser } = useUsers()

const isEdit = ref(false)
const showPass = ref(false)

// Поля формы
const loginval = ref(currentUser.value?.login || '')
const password = ref(currentUser.value?.password || '')
const errlogin = ref('')
const errpassword = ref('')

function saveProfile() {
    errlogin.value = ''
    errpassword.value = ''

    if (!loginval.value) {
        errlogin.value = 'Введите логин'
        return
    }
    if (loginval.value.length < 3) {
        errlogin.value = 'Логин должен быть не короче 3 символов'
        return
    }
    if (!password.value) {
        errpassword.value = 'Введите пароль'
        return
    }
    if (password.value.length < 5) {
        errpassword.value = 'Пароль должен быть не короче 5 символов'
        return
    }


    currentUser.value.login = loginval.value
    currentUser.value.password = password.value

    saveCurrentUser()
    isEdit.value = false
    showPass.value = false
}
</script>

<template>
    <div class="profile-container">
        <h2>Профиль пользователя</h2>

        <div v-if="currentUser" class="user-info">
            <!-- Режим просмотра -->
            <div v-if="!isEdit" class="info-view">
                <div class="profile-row">
                    <span class="label">Логин</span>
                    <span class="value">{{ currentUser.login }}</span>
                </div>
                <div class="profile-row">
                    <span class="label">Пароль</span>
                    <span class="value">••••••••</span>
                </div>

                <button @click="isEdit = true" class="btn-edit">Изменить профиль</button>
            </div>

            <!-- Режим редактирования -->
            <div v-else class="info-edit">
                <div class="edit-row">
                    <label>Логин *</label>
                    <input v-model="loginval" type="text" class="npt" />
                    <span class="error-message">{{ errLogin }}</span>
                </div>

                <div class="edit-row">
                    <label>Пароль *</label>
                    <input v-model="password" :type="showPass ? 'text' : 'password'" class="npt" />
                    <label style="font-size: 0.8rem; margin-top: 5px;">
                        <input type="checkbox" v-model="showPass" /> Показать пароль
                    </label>
                    <span class="error-message">{{ errPassword }}</span>
                </div>

                <div class="edit-actions">
                    <button @click="saveProfile" class="btn-save">Сохранить</button>
                    <button @click="isEdit = false" class="btn-cancel">Отмена</button>
                </div>
            </div>
        </div>

        <div v-else class="guest-info">
            <p>Вы не авторизованы.</p>
            <router-link to="/login" class="btn-auth">Войти</router-link>
        </div>
    </div>
</template>

<style scoped>
.profile-container {
    max-width: 600px;
    margin: 80px auto 60px;
    padding: 30px;
    background: #fff;
    border: 2px solid #000;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-container h2 {
    text-align: center;
    font-size: 28px;
    margin-bottom: 25px;
    color: #000;
    font-weight: 600;
}

.profile-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px dashed #eee;
    font-size: 16px;
}

.profile-row:last-child {
    border-bottom: none;
}

.label {
    font-weight: 600;
    color: #000;
    min-width: 100px;
}

.value {
    color: #333;
    text-align: right;
    flex: 1;
    word-break: break-word;
    padding-left: 10px;
}

.btn-edit {
    width: 100%;
    margin-top: 20px;
    padding: 12px;
    background: #08bc47;
    color: #fff;
    border: 2px solid #000;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-edit:hover {
    background: #08bc47;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.edit-row {
    margin-bottom: 15px;
}

.edit-row label {
    display: block;
    font-weight: 600;
    color: #000;
    margin-bottom: 5px;
    font-size: 15px;
}

.npt {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: #f9f9f9;
    color: #000;
    font-size: 15px;
}

.npt:focus {
    outline: none;
    border-color: #08bc47;
}

.error-message {
    color: #08bc47;
    font-size: 0.8rem;
    margin-top: 4px;
    display: block;
}

.edit-actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.btn-save,
.btn-cancel {
    flex: 1;
    padding: 12px;
    border: 2px solid #000;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    transition: all 0.3s ease;
}

.btn-save {
    background: #08bc47;
    color: #fff;
}

.btn-save:hover {
    background: #08bc47;
}

.btn-cancel {
    background: #f5f5f5;
    color: #000;
}

.btn-cancel:hover {
    background: #e0e0e0;
}

.guest-info {
    text-align: center;
    padding: 30px;
    color: #000;
    font-size: 16px;
}

.guest-info .btn-auth {
    display: inline-block;
    margin-top: 15px;
    padding: 10px 20px;
    background: #08bc47;
    color: #fff;
    border-radius: 6px;
    text-decoration: none;
    font-weight: bold;
}
</style>