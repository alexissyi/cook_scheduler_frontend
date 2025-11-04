<script setup lang="ts">
import { ref, computed, onMounted, useCssVars } from "vue";
import { storeToRefs } from "pinia";
import { useSchedulerStore } from "@/stores/cookingSchedule";
import { useUserStore } from "@/stores/userAuthentication";
import {
  months,
  dayNames,
  dateToString,
  stringToYear,
  stringToMonth,
  getPeriod,
  monthYearToString,
} from "@/utils";

const schedulerStore = useSchedulerStore();
const userStore = useUserStore();

const {
  addCookingDate,
  removeCookingDate,
  addPeriod,
  removePeriod,
  setCurrentPeriod,
  addCook,
  openPeriod,
  closePeriod,
  removeCook,
  _getCookingDates,
  _getCooks,
  _getCurrentPeriod,
  _isOpen,
  _isRegisteredPeriod,
  _isRegisteredCook,
  _isCurrentPeriod,
} = schedulerStore;

const { currentPeriod, currentMonth, currentYear } = storeToRefs(schedulerStore);
const { currentSession } = storeToRefs(userStore);

// non-period-specific state
const allUsers = ref<Array<{ user: string; kerb: string }>>([]); // users to select cooks from
const cookToAddKerb = ref(""); // a kerb
const showFallbackMessage = ref(false); // for when no current period is set
const showBadDeregisterAttemptMsg = ref(false);

const getKerb = (user: string) => {
  const userObj = allUsers.value.find((u) => u.user === user);
  return userObj ? userObj.kerb : undefined;
};

// get all registered users
const fetchUsers = async () => {
  try {
    const res = await userStore._getUsers();
    if (Array.isArray(res)) {
      allUsers.value = res.map((u) => ({ user: u.user, kerb: u.kerb }));
    }
  } catch (err) {
    console.error("Failed to load users:", err);
  }
};

// selected period and relevant states
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();
const todayString = dateToString(today);
const selectedPeriod = ref(getPeriod(todayString)); // YYYY-MM string

const selectedYear = computed(() => stringToYear(selectedPeriod.value));
const selectedMonth = computed(() => stringToMonth(selectedPeriod.value));

const cookingDates = ref<Set<string>>(new Set()); // YYYY-MM-DD strings
const cooks = ref<Set<string>>(new Set()); // users
const isCurrent = ref(false);
const isRegistered = ref(false);
const isOpen = ref(false);

// load cooks, dates, and form status for selected period
async function loadPeriodData() {
  const period = selectedPeriod.value;
  const [datesData, cooksData, isOpenData, isRegisteredData, isCurrentData] = await Promise.all([
    _getCookingDates(period),
    _getCooks(period),
    _isOpen(period),
    _isRegisteredPeriod(period),
    _isCurrentPeriod(period),
  ]);
  console.log(`isOpenData for ${period}: ${isOpenData[0]?.isOpen}`);
  console.log(`isRegisteredData for ${period}: ${isRegisteredData[0]?.isRegisteredPeriod}`);
  console.log(`isCurrentData for ${period}: ${isCurrentData[0]?.isCurrentPeriod}`);
  cookingDates.value = new Set(datesData?.map((d: any) => d.cookingDate));
  cooks.value = new Set(cooksData?.map((d: any) => d.cook));
  if (isOpenData) {
    isOpen.value = isOpenData[0].isOpen;
  }
  if (isRegisteredData) {
    isRegistered.value = isRegisteredData[0].isRegisteredPeriod;
  }
  if (isCurrentData) {
    isCurrent.value = isCurrentData[0].isCurrentPeriod;
  }
  showBadDeregisterAttemptMsg.value = false;
}

// toggle open/close
async function toggleOpenPeriod() {
  console.log(`Toggling forms for ${selectedPeriod.value}`);
  if (isOpen.value) {
    await closePeriod(currentSession.value, selectedPeriod.value);
  } else {
    await openPeriod(currentSession.value, selectedPeriod.value);
  }
  await loadPeriodData();
}

// toggle register/unregister
async function toggleRegisterPeriod() {
  console.log(`Toggling registration of ${selectedPeriod.value}`);
  if (isRegistered.value) {
    if (isCurrent.value) {
      showBadDeregisterAttemptMsg.value = true;
      return;
    }
    console.log("Removing period");
    await removePeriod(currentSession.value, selectedPeriod.value);
  } else {
    console.log("Adding period");
    await addPeriod(currentSession.value, selectedPeriod.value);
  }
  await loadPeriodData();
}

// set selected period as current period
async function setSelectedAsCurrentPeriod() {
  console.log(`Setting ${selectedPeriod.value} as current period`);
  await setCurrentPeriod(currentSession.value, selectedPeriod.value);
  await loadPeriodData();
}

// generate the calendar days array used to load calendar in html
const calendarDays = ref<(Date | null)[]>([]);
function generateCalendar() {
  const first = new Date(selectedYear.value, selectedMonth.value - 1, 1);
  const last = new Date(selectedYear.value, selectedMonth.value, 0);
  const daysArray: (Date | null)[] = [];
  for (let i = 0; i < first.getDay(); i++) daysArray.push(null);
  for (let d = 1; d <= last.getDate(); d++)
    daysArray.push(new Date(selectedYear.value, selectedMonth.value - 1, d));
  while (daysArray.length % 7 !== 0) daysArray.push(null);
  calendarDays.value = daysArray;
}

// --- Actions ---
async function onDayClick(date: string) {
  if (cookingDates.value.has(date)) {
    console.log(`Removing cooking date ${date}`);
    await removeCookingDate(currentSession.value, date);
  } else {
    console.log(`Adding cooking date ${date}`);
    await addCookingDate(currentSession.value, date);
  }
  await loadPeriodData();
}

async function formAddCook() {
  const kerb = cookToAddKerb.value.trim();
  if (!kerb) return;
  const userObj = allUsers.value.find((u) => u.kerb === kerb);
  if (!userObj) {
    alert(`${kerb} is not a registered user.`);
    return;
  }
  const user = userObj.user;
  console.log("Registering cook: ", kerb);
  await addCook(currentSession.value, selectedPeriod.value, user);
  cooks.value.add(user);
  cookToAddKerb.value = "";
  await loadPeriodData();
}

async function removeCookFromPeriod(user: string) {
  await removeCook(currentSession.value, selectedPeriod.value, user);
  cooks.value.delete(user);
  await loadPeriodData();
}

function prevMonth() {
  if (selectedMonth.value === 1) {
    const prevMonth = 12;
    const prevYear = selectedYear.value - 1;
    const prevPeriod = monthYearToString(prevMonth, prevYear);
    selectedPeriod.value = prevPeriod;
  } else {
    const prevMonth = selectedMonth.value - 1;
    const prevPeriod = monthYearToString(prevMonth, selectedYear.value);
    selectedPeriod.value = prevPeriod;
  }
  generateCalendar();
  loadPeriodData();
}

function nextMonth() {
  if (selectedMonth.value === 12) {
    const nextMonth = 1;
    const nextYear = selectedYear.value + 1;
    const nextPeriod = monthYearToString(nextMonth, nextYear);
    selectedPeriod.value = nextPeriod;
  } else {
    const nextMonth = selectedMonth.value + 1;
    const nextPeriod = monthYearToString(nextMonth, selectedYear.value);
    selectedPeriod.value = nextPeriod;
  }
  generateCalendar();
  loadPeriodData();
}

// sets selected period to current period if it exists, otherwise does nothing
async function jumpToCurrentPeriod() {
  const currentPeriodData = await _getCurrentPeriod();
  if (currentPeriodData) {
    const currentPeriod = currentPeriodData[0].period;
    selectedPeriod.value = currentPeriod;
  }
  generateCalendar();
  await loadPeriodData();
}

// 5 year range for year selector drop down
const years = computed(() => {
  const range: number[] = [];
  for (let y = year - 2; y <= year + 2; y++) range.push(y);
  return range;
});

// --- Lifecycle ---
onMounted(async () => {
  await fetchUsers();
  generateCalendar();
  await loadPeriodData();
});
</script>

<template>
  <div class="calendar-wrapper">
    <div class="calendar">
      <div class="calendar-header">
        <button class="nav-btn" @click="prevMonth">◀</button>

        <select v-model="selectedYear" @change="generateCalendar">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>

        <select v-model="selectedMonth" @change="generateCalendar">
          <option v-for="(month, index) in months" :key="month" :value="index + 1">
            {{ month }}
          </option>
        </select>

        <button class="nav-btn" @click="nextMonth">▶</button>
      </div>

      <div class="calendar-toggles">
        <button class="toggle-btn" @click="toggleRegisterPeriod" :class="{ active: !isRegistered }">
          {{ isRegistered ? "Deregister Period" : "Register Period" }}
        </button>

        <button
          class="toggle-btn"
          @click="setSelectedAsCurrentPeriod"
          :disabled="isCurrent || !isRegistered"
          :class="{ current: isCurrent }"
        >
          {{ isCurrent ? "Current Period" : "Set as Current" }}
        </button>
      </div>
      <div v-if="showBadDeregisterAttemptMsg" class="fallback-message">
        Cannot deregister current period.
      </div>

      <div class="calendar-grid">
        <div class="day-name" v-for="day in dayNames" :key="day">{{ day }}</div>

        <div
          v-for="(date, index) in calendarDays"
          :key="index"
          class="calendar-cell"
          :class="{
            empty: !date,
            selected: date && cookingDates.has(dateToString(date)),
            notEditable: !isRegistered,
          }"
          @click="date && isRegistered && onDayClick(dateToString(date))"
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

        <div v-if="showFallbackMessage" class="fallback-message">
          No current period set — showing this month instead.
        </div>
      </div>
    </div>

    <div class="cook-panel">
      <h3>Cooks for {{ months[selectedMonth - 1] }} {{ selectedYear }}</h3>

      <div v-if="cooks.size > 0" class="cook-list">
        <button
          v-for="cook in cooks"
          :key="cook"
          class="cook-button"
          @click="removeCookFromPeriod(cook)"
        >
          {{ getKerb(cook) }}
        </button>
      </div>
      <div v-else class="no-cooks">No cooks registered for this period.</div>

      <div class="cook-actions">
        <h4>Add Cook</h4>
        <input
          v-model.trim="cookToAddKerb"
          list="user-list"
          placeholder="Select or type cook kerb"
          type="text"
        />
        <datalist id="user-list">
          <option v-for="userObj in allUsers" :key="userObj.user" :value="userObj.kerb" />
        </datalist>
        <button @click="formAddCook">Add</button>
      </div>

      <div class="preferences-toggle">
        <button @click="toggleOpenPeriod" class="prefs-btn">
          {{
            isOpen
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
.calendar-cell.selected {
  background: #39673a;
  color: rgb(250, 250, 250);
}

.calendar-cell.notEditable {
  background-color: #eee;
  color: #999;
  cursor: not-allowed;
}

.calendar-cell.empty {
  background: #f9f9f9;
  color: #ccc;
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

.fallback-message {
  margin-top: 8px;
  text-align: center;
  color: #b15a00;
  font-size: 0.9rem;
  font-style: italic;
}
</style>
