<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useSchedulerStore } from "@/stores/cookScheduler";
import { useUserStore } from "@/stores/userAuthentication";

import { months, dayNames, dateToString } from "@/utils";

const schedulerStore = useSchedulerStore();
const userStore = useUserStore();
const { allUsers } = storeToRefs(userStore);

const {
  addCookingDay,
  removeCookingDay,
  addPeriod,
  setCurrentPeriod,
  removePeriod,
  addCook,
  removeCook,
  toggleForm,
} = schedulerStore;

const { currentMonth, currentYear, cookingDays, periods, currentPeriod, cooks, formsOpen } =
  storeToRefs(schedulerStore);

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

const isRegistered = computed(() => periods.value.has(selectedPeriod.value));
const isCurrent = computed(() => currentPeriod.value === selectedPeriod.value);

const cooksForPeriod = computed(() => cooks.value.get(selectedPeriod.value) ?? new Set([]));
const cookToAdd = ref("");

const formOpenForSelected = computed(() => {
  return formsOpen.value.get(selectedPeriod.value) ?? false;
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

function prevMonth() {
  if (selectedMonth.value === 1) {
    selectedMonth.value = 12;
    selectedYear.value -= 1;
  } else {
    selectedMonth.value -= 1;
  }
  generateCalendar();
}

function nextMonth() {
  if (selectedMonth.value === 12) {
    selectedMonth.value = 1;
    selectedYear.value += 1;
  } else {
    selectedMonth.value += 1;
  }
  generateCalendar();
}

function toggleRegisterPeriod() {
  if (isRegistered.value) {
    if (isCurrent.value) {
      alert("You cannot deregister the current period.");
      return;
    }
    removePeriod(selectedPeriod.value);
  } else {
    addPeriod(selectedPeriod.value);
  }
}

function setAsCurrentPeriod() {
  if (!isRegistered.value) {
    addPeriod(selectedPeriod.value);
  }
  setCurrentPeriod(selectedPeriod.value);
}

function formAddCook() {
  const name = cookToAdd.value.trim();

  if (!name) return;

  // Ensure only registered users can be added
  if (!allUsers.value.includes(name)) {
    alert(`"${name}" is not a registered user.`);
    return;
  }

  addCook(selectedPeriod.value, name);
  cookToAdd.value = "";
}

function jumpToCurrentPeriod() {
  if (!currentPeriod.value) return;

  selectedYear.value = currentYear.value;
  selectedMonth.value = currentMonth.value;
  generateCalendar();
}

// initialize calendar on mount
generateCalendar();
</script>

<template>
  <div class="calendar-wrapper">
    <div class="calendar">
      <!-- month and year selection dropdowns-->
      <div class="calendar-header">
        <button class="nav-btn" @click="prevMonth">◀</button>
        <select v-model="selectedYear" @change="generateCalendar">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>

        <select v-model="selectedMonth" @change="generateCalendar">
          <option v-for="(month, index) in months" :key="month" :value="index + 1">
            <!--1 indexing for months-->
            {{ month }}
          </option>
        </select>
        <button class="nav-btn" @click="nextMonth">▶</button>
      </div>
      <div class="calendar-toggles">
        <button class="toggle-btn" @click="toggleRegisterPeriod" :class="{ active: isRegistered }">
          {{ isRegistered ? "Deregister Period" : "Register Period" }}
        </button>

        <button
          class="toggle-btn"
          @click="setAsCurrentPeriod"
          :disabled="isCurrent"
          :class="{ current: isCurrent }"
        >
          {{ isCurrent ? "Current Period" : "Set as Current" }}
        </button>
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
      <div class="jump-btn-container">
        <button
          class="jump-btn"
          @click="jumpToCurrentPeriod"
          :disabled="selectedPeriod === currentPeriod"
        >
          Jump to Current Period
        </button>
      </div>
    </div>
    <!-- Cook Management Section -->
    <div class="cook-panel">
      <h3>Cooks for {{ months[selectedMonth - 1] }} {{ selectedYear }}</h3>

      <div v-if="cooksForPeriod.size > 0" class="cook-list">
        <div class="cook-list">
          <button
            v-for="cook in cooksForPeriod"
            :key="cook"
            class="cook-button"
            @click="removeCook(selectedPeriod, cook)"
          >
            {{ cook }}
          </button>
        </div>
      </div>
      <div v-else class="no-cooks">No cooks registered for this period.</div>

      <div class="cook-actions">
        <h4>Add Cook</h4>
        <input
          v-model.trim="cookToAdd"
          list="user-list"
          placeholder="Select or type cook kerb"
          type="text"
        />
        <datalist id="user-list">
          <option v-for="user in allUsers" :key="user" :value="user" />
        </datalist>
        <button @click="formAddCook">Add</button>
      </div>
      <div class="preferences-toggle">
        <button @click="toggleForm(selectedPeriod)" class="prefs-btn">
          {{
            formOpenForSelected
              ? "Close Preferences & Availabilities Forms"
              : "Open Preferences & Availabilities Forms"
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
  margin-top: 20px;
  font-family: sans-serif;
}
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

.calendar-toggles {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
}

.toggle-btn {
  border: 1px solid #ccc;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  background: #f8f8f8;
  font-size: 0.9rem;
}

.toggle-btn.active {
  background: #39673a;
  color: white;
}

.toggle-btn.current {
  background: #2c5e2c;
  color: white;
}

.toggle-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cook-panel {
  width: 250px;
  border-left: 1px solid #ccc;
  padding-left: 20px;
}

.cook-list {
  margin-bottom: 10px;
}

.no-cooks {
  font-style: italic;
  color: #777;
}

.cook-actions h4 {
  margin: 10px 0 4px;
}

.cook-actions input {
  width: 100%;
  padding: 4px;
  margin-bottom: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.cook-actions button {
  width: 100%;
  padding: 6px;
  margin-bottom: 10px;
  border: none;
  border-radius: 4px;
  background: #39673a;
  color: white;
  cursor: pointer;
}

.cook-actions button:hover {
  background: #2c5e2c;
}

.cook-button {
  background-color: #39673a; /* green */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 6px 10px;
  margin: 4px 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.cook-button:hover {
  background-color: #2c5e2c;
  transform: scale(1.05);
}

.preferences-toggle {
  margin-top: 20px;
  text-align: center;
}

.prefs-btn {
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background: #39673a;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s, transform 0.1s;
}

.prefs-btn:hover {
  background: #2c5e2c;
  transform: scale(1.03);
}

.jump-btn-container {
  margin-top: 16px;
  text-align: center;
}

.jump-btn {
  background: #39673a;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.jump-btn:hover {
  background: #2c5e2c;
  transform: scale(1.03);
}

.jump-btn:disabled {
  background: #ccc;
  color: #666;
  cursor: not-allowed;
  transform: none;
}

.nav-btn {
  background: #39673a;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.nav-btn:hover {
  background: #2c5e2c;
}
</style>
