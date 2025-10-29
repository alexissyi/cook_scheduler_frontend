<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useSchedulerStore } from "@/stores/cookScheduler";

import { months, dayNames, dateToString } from "@/utils";

const schedulerStore = useSchedulerStore();

const { addCookingDay, removeCookingDay } = schedulerStore;

const { currentMonth, currentYear, cookingDays } = storeToRefs(schedulerStore);

type CalendarDay = Date | null; // either a date or an empty placeholder

const onDayClick = (day: string) => {
  console.log("Clicked day:", day);
  if (daySet.value !== undefined) {
    console.log("in here");
    if (daySet.value.has(day)) {
      console.log("removing day");
      removeCookingDay(day);
    } else {
      console.log("adding day");
      addCookingDay(day);
    }
  }
};

const selectedYear = ref(currentYear.value);
const selectedMonth = ref(currentMonth.value); // 1 indexed
const selectedPeriod = computed(() => {
  const month = String(selectedMonth.value).padStart(2, "0");
  return `${selectedYear.value}-${month}`;
});

const daySet = computed(() => {
  const map = cookingDays.value;
  return map.get(selectedPeriod.value) ?? new Set();
});

const calendarDays = ref(new Array<CalendarDay>());

// generate a list of years for dropdown (5 before and 4 after current)
const years: number[] = Array.from({ length: 10 }, (_, i) => currentYear.value - 5 + i);

function generateCalendar(): void {
  const firstDay = new Date(selectedYear.value, selectedMonth.value - 1, 1);
  const lastDay = new Date(selectedYear.value, selectedMonth.value, 0);

  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay();
  console.log(firstDay);
  console.log(startWeekday);

  const daysArray: CalendarDay[] = [];

  // fill empty cells before first day
  for (let i = 0; i < startWeekday; i++) {
    daysArray.push(null);
  }

  // fill actual date cells
  for (let day = 1; day <= daysInMonth; day++) {
    daysArray.push(new Date(selectedYear.value, selectedMonth.value - 1, day));
  }

  // pad with nulls until total is multiple of 7
  while (daysArray.length % 7 !== 0) {
    daysArray.push(null);
  }

  calendarDays.value = daysArray;
}

// initialize calendar on mount
generateCalendar();
</script>

<template>
  <div class="calendar">
    <div>Cooking Dates Selected: {{ Array.from(daySet) }}</div>
    <!-- month and year selection-->
    <div class="calendar-header">
      <select v-model="selectedYear" @change="generateCalendar">
        <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
      </select>

      <select v-model="selectedMonth" @change="generateCalendar">
        <option v-for="(month, index) in months" :key="month" :value="index + 1">
          <!--1 indexing for months-->
          {{ month }}
        </option>
      </select>
    </div>

    <!-- calendar grid-->
    <div class="calendar-grid">
      <!-- days of week header-->
      <div class="day-name" v-for="day in dayNames" :key="day">{{ day }}</div>

      <!-- date cells -->
      <div
        v-for="(date, index) in calendarDays"
        :key="index"
        class="calendar-cell"
        :class="{
          empty: !date,
          selected: date && daySet?.has(dateToString(date)),
        }"
        @click="date && onDayClick(dateToString(date))"
      >
        <span v-if="date">{{ date.getDate() }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar {
  width: 300px;
  margin: auto;
  font-family: sans-serif;
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
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-cell:hover {
  background: rgb(174, 203, 186);
}

.calendar-cell.empty {
  background: #f9f9f9;
  color: #ccc;
}

.calendar-cell.selected {
  background: #39673a;
  color: rgb(250, 250, 250);
}
</style>
