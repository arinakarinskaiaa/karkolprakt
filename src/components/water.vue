<script setup>
import { ref, computed } from "vue"
import useUsers from "../composables/useUsers"

const { currentUser, saveCurrentUser } = useUsers()

const amount = ref("")
const error = ref("")
const isEditingGoal = ref(false)
const tempGoal = ref("") // временная цель для ввода

const goal = computed(() => {
  return currentUser.value.waterGoal || 2000
})

// Фильтруем записи за сегодня
const today = new Date().toISOString().slice(0, 10)

const dailyWater = computed(() => {
  return currentUser.value?.water?.filter(w => w.date === today) || []
})

const totalWater = computed(() => {
  return dailyWater.value.reduce((sum, w) => sum + w.amount, 0)
})

function startEditGoal() {
  tempGoal.value = goal.value
  isEditingGoal.value = true
}

function saveGoal() {
  if (!tempGoal.value) {
    tempGoal.value = goal.value // возвращаем старое значение
    return
  }

  const num = Number(tempGoal.value)
  if (isNaN(num) || num <= 0) {
    tempGoal.value = goal.value
    error.value = "Цель должна быть положительным числом"
    setTimeout(() => error.value = "", 2000)
    return
  }

  // Создаём поле waterGoal, если его нет
  if (!currentUser.value.waterGoal) {
    currentUser.value.waterGoal = num
  } else {
    currentUser.value.waterGoal = num
  }

  saveCurrentUser()
  isEditingGoal.value = false
  error.value = ""
}



function addWater() {
  error.value = ""

  if (!amount.value) {
    error.value = "Введите объём"
    return
  }

  const num = Number(amount.value)
  if (isNaN(num) || num <= 0) {
    error.value = "Введите корректное число"
    return
  }

  if (!currentUser.value.water) {
    currentUser.value.water = []
  }

  currentUser.value.water.push({
    id: Date.now(),
    amount: num,
    date: today
  })

  saveCurrentUser()
  amount.value = ""
}

function removeWater(id) {
  currentUser.value.water = currentUser.value.water.filter(w => w.id !== id)
  saveCurrentUser()
}
</script>

<template>
  <div class="water-tracker">
    <h3>💧 Водный баланс</h3>

    <div class="goal-section">
      <div v-if="!isEditingGoal" class="goal-display">
        <p><strong>Цель:</strong> {{ goal }} мл в день</p>
        <button @click="startEditGoal" class="btn-edit">Изменить</button>
      </div>

      <div v-else class="goal-edit">
        <input
          v-model="tempGoal"
          type="number"
          min="100"
          placeholder="Цель (мл)"
          @keyup.enter="saveGoal"
        />
        <button @click="saveGoal">Сохранить</button>
        <button @click="isEditingGoal = false" class="btn-cancel">Отмена</button>
      </div>
    </div>

    <!-- Прогресс-бар -->
    <div class="progress-bar">
      <div class="bar">
        <div
          class="fill"
          :style="{ width: `${Math.min(totalWater / goal * 100, 100)}%` }"
        ></div>
      </div>
      <p>{{ totalWater }} / {{ goal }} мл</p>
    </div>

    <!-- Форма добавления воды -->
    <div class="add-water-form">
      <input
        v-model="amount"
        type="number"
        min="0"
        placeholder="Объём (мл)"
        @input="error = ''"
      />
      <button @click="addWater">Добавить</button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <!-- История за день -->
    <div v-if="dailyWater.length > 0" class="water-list">
      <div v-for="w in dailyWater" :key="w.id" class="water-item">
        <span>{{ w.amount }} мл</span>
        <button @click="removeWater(w.id)" class="btn-remove">×</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.water-tracker {
  margin-top: 30px;
  padding: 20px;
  background: #f0f8ff;
  border-radius: 12px;
  border: 1px solid #cce6ff;
  color: #003366;
}

.water-tracker h3 {
  color: #0066cc;
  margin-bottom: 15px;
  font-size: 1.4em;
}

.goal-section {
  margin-bottom: 15px;
}

.goal-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
}

.btn-edit {
  padding: 6px 12px;
  background: #0099ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-edit:hover {
  background: #007acc;
}

.goal-edit {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.goal-edit input {
  padding: 8px;
  border: 2px solid #0066cc;
  border-radius: 6px;
  max-width: 120px;
  font-size: 14px;
}

.goal-edit button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.goal-edit button:first-child {
  background: #0066cc;
  color: white;
}

.goal-edit .btn-cancel {
  background: #ccc;
  color: #333;
}

.goal-edit button:hover {
  opacity: 0.9;
}

.progress-bar {
  margin-bottom: 15px;
}

.bar {
  width: 100%;
  height: 20px;
  background: #cce6ff;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 5px;
}

.fill {
  height: 100%;
  background: #0099ff;
  transition: width 0.3s ease;
}

.add-water-form {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

input[type="number"] {
  padding: 10px;
  border: 2px solid #0066cc;
  border-radius: 8px;
  flex: 1;
  max-width: 150px;
}

button {
  padding: 10px 16px;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background: #0055aa;
}

.error {
  color: #e60000;
  font-size: 0.9rem;
  margin: 5px 0;
}

.water-list {
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.water-item {
  display: flex;
  align-items: center;
  background: white;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  color: #333;
}

.btn-remove {
  background: #e60000;
  color: white;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  font-size: 14px;
  margin-left: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background: #cc0000;
}
</style>