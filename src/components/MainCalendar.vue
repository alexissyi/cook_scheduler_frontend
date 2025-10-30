<script setup lang="ts">
import { ref, onMounted } from "vue";
import { months, dayNames } from "@/utils"; // adjust path as needed

interface DateObj {
  date: Date | null;
  inCurrentMonth: boolean;
}

const today = new Date();
const selectedMonth = ref(today.getMonth()); // 0-indexed
const selectedYear = ref(today.getFullYear());

const years = Array.from({ length: 20 }, (_, i) => today.getFullYear() - 10 + i);

const calendarDays = ref<DateObj[]>([]);

function generateCalendar() {
  const firstDay = new Date(selectedYear.value, selectedMonth.value, 1);
  const lastDay = new Date(selectedYear.value, selectedMonth.value + 1, 0);

  const days: DateObj[] = [];

  // Previous month fillers
  const startWeekday = firstDay.getDay();
  for (let i = startWeekday - 1; i >= 0; i--) {
    const date = new Date(selectedYear.value, selectedMonth.value, -i);
    days.push({ date, inCurrentMonth: false });
  }

  // Current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(selectedYear.value, selectedMonth.value, d);
    days.push({ date, inCurrentMonth: true });
  }

  // Next month fillers
  const endWeekday = lastDay.getDay();
  for (let i = 1; i < 7 - endWeekday; i++) {
    const date = new Date(selectedYear.value, selectedMonth.value, lastDay.getDate() + i);
    days.push({ date, inCurrentMonth: false });
  }

  calendarDays.value = days;
}

function prevMonth() {
  if (selectedMonth.value === 0) {
    selectedMonth.value = 11;
    selectedYear.value -= 1;
  } else selectedMonth.value -= 1;
  generateCalendar();
}

function nextMonth() {
  if (selectedMonth.value === 11) {
    selectedMonth.value = 0;
    selectedYear.value += 1;
  } else selectedMonth.value += 1;
  generateCalendar();
}

function jumpToCurrentPeriod() {
  selectedMonth.value = today.getMonth();
  selectedYear.value = today.getFullYear();
  generateCalendar();
}

function isToday(date: Date | null) {
  if (!date) return false;
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

onMounted(() => generateCalendar());
</script>

<template>
  <div class="calendar-wrapper">
    <div class="availability-calendar">
      <!-- Header -->
      <div class="calendar-header">
        <button class="nav-btn" @click="prevMonth">◀</button>
        <select v-model="selectedYear" @change="generateCalendar">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
        <select v-model="selectedMonth" @change="generateCalendar">
          <option v-for="(month, index) in months" :key="month" :value="index">
            {{ month }}
          </option>
        </select>
        <button class="nav-btn" @click="nextMonth">▶</button>
      </div>

      <!-- Calendar Grid -->
      <div class="calendar-grid">
        <div class="day-name" v-for="day in dayNames" :key="day">{{ day }}</div>
        <div
          v-for="(dayObj, index) in calendarDays"
          :key="index"
          class="calendar-cell"
          :class="{
            empty: !dayObj.date,
            inactive: dayObj.date && !dayObj.inCurrentMonth,
            today: isToday(dayObj.date),
          }"
        >
          <span v-if="dayObj.date" class="date-number">{{ dayObj.date.getDate() }}</span>
        </div>
      </div>

      <!-- Jump button -->
      <div class="jump-btn-container">
        <button class="jump-btn" @click="jumpToCurrentPeriod">Jump to Current Period</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  font-family: sans-serif;
}

.availability-calendar {
  width: 560px;
}

.calendar-header {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}

.day-name {
  font-weight: bold;
  background: #eee;
  padding: 6px;
}

.calendar-cell {
  border: 1px solid #ddd;
  height: 80px;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 2px;
  cursor: default;
  background: #fff;
}

.calendar-cell.empty {
  background: #f9f9f9;
  color: #ccc;
}

.calendar-cell.inactive {
  background: #f0f0f0;
  color: #999;
}

.calendar-cell.today {
  border: 2px solid #39673a;
}

.date-number {
  font-weight: bold;
  font-size: 0.7rem;
}

.nav-btn,
.jump-btn {
  background: #39673a;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.nav-btn:hover,
.jump-btn:hover {
  background: #2c5e2c;
}

.jump-btn-container {
  margin-top: 12px;
  text-align: center;
}
</style>
