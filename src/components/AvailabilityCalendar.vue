<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useSchedulerStore } from "@/stores/cookingSchedule";
import { useUserStore } from "@/stores/userAuthentication";
import { storeToRefs } from "pinia";
import {
  months,
  dayNames,
  dateToString,
  stringToMonthYear,
  stringToYear,
  getPeriod,
  stringToMonth,
  monthYearToString,
} from "@/utils";

const schedulerStore = useSchedulerStore();
const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

// selected period and period-relevant states
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();
const todayString = dateToString(today);
const selectedPeriod = ref(getPeriod(todayString)); // YYYY-MM string

const selectedYear = computed(() => stringToYear(selectedPeriod.value));
const selectedMonth = computed(() => stringToMonth(selectedPeriod.value)); // 1-indexed

const cookingDates = ref<Set<string>>(new Set()); // YYYY-MM-DD strings

const isCurrent = ref(false);
const isRegisteredPeriod = ref(false);
const isOpen = ref(false);
const isRegisteredCook = ref(false);

const availability = ref<Set<string>>(new Set());
const preferences = ref({
  canSolo: false,
  canLead: false,
  canAssist: false,
  maxCookingDays: 0,
});

const showSavedMessage = ref(false);
const showFallbackMessage = ref(false);

// determines whether a user can actually enter anything
const canEdit = computed(() => isRegisteredPeriod.value && isOpen.value && isRegisteredCook.value);

// calendar generation
const calendarDays = ref<(Date | null)[]>([]);
function generateCalendar(): void {
  if (!selectedYear.value || !selectedMonth.value) return;
  const firstDay = new Date(selectedYear.value, selectedMonth.value - 1, 1);
  const lastDay = new Date(selectedYear.value, selectedMonth.value, 0);
  const daysArray: (Date | null)[] = [];
  for (let i = 0; i < firstDay.getDay(); i++) daysArray.push(null);
  for (let day = 1; day <= lastDay.getDate(); day++) {
    daysArray.push(new Date(selectedYear.value, selectedMonth.value - 1, day));
  }
  while (daysArray.length % 7 !== 0) daysArray.push(null);
  calendarDays.value = daysArray;
}

async function loadPeriodData() {
  if (!selectedPeriod.value) return;
  const period = selectedPeriod.value;
  const user = currentUser.value;

  const [
    isOpenData,
    isCurrentPeriodData,
    isRegisteredCookData,
    isRegisteredPeriodData,
    cookingDatesData,
    availData,
    prefData,
  ] = await Promise.all([
    schedulerStore._isOpen(period),
    schedulerStore._isCurrentPeriod(period),
    schedulerStore._isRegisteredCook(user, period),
    schedulerStore._isRegisteredPeriod(period),
    schedulerStore._getCookingDates(period),
    schedulerStore._getAvailability(user, period),
    schedulerStore._getPreference(user, period),
  ]);

  console.log(`isOpenData for ${period}: ${isOpenData[0]?.isOpen}`);
  console.log(
    `isRegisteredPeriodData for ${period}: ${isRegisteredPeriodData[0]?.isRegisteredPeriod}`
  );
  console.log(`isRegisteredCookData for ${period}: ${isRegisteredCookData[0]?.isRegisteredCook}`);
  console.log(`availData for ${period}: ${availData?.map((d: any) => d.date)}`);
  isOpen.value = isOpenData?.[0]?.isOpen ?? false;
  isCurrent.value = isCurrentPeriodData?.[0]?.isCurrentPeriod ?? false;
  isRegisteredCook.value = isRegisteredCookData?.[0]?.isRegisteredCook ?? false;
  isRegisteredPeriod.value = isRegisteredPeriodData?.[0]?.isRegisteredPeriod ?? false;
  cookingDates.value = new Set(cookingDatesData?.map((d: any) => d.cookingDate));
  availability.value = new Set(availData?.map((d: any) => d.date));

  if (prefData?.length) {
    const p = prefData[0];
    preferences.value = {
      canSolo: p.canSolo,
      canLead: p.canLead,
      canAssist: p.canAssist,
      maxCookingDays: p.maxCookingDays,
    };
  } else {
    preferences.value = { canSolo: false, canLead: false, canAssist: false, maxCookingDays: 0 };
  }
}

// interaction
async function onDayClick(date: string) {
  if (!canEdit.value) {
    alert("Availability editing is closed or you are not a registered cook.");
    return;
  }
  if (!cookingDates.value.has(date)) return;

  const user = currentUser.value;
  if (availability.value.has(date)) {
    console.log(`Removing availability ${date}`);
    await schedulerStore.removeAvailability(user, date);
    availability.value.delete(date);
  } else {
    console.log(`Adding availability ${date}`);
    await schedulerStore.addAvailability(user, date);
    availability.value.add(date);
  }
}

async function savePreferences() {
  if (!canEdit.value) {
    alert("Cannot save preferences: closed period or not a registered cook.");
    return;
  }
  await schedulerStore.uploadPreference(
    currentUser.value,
    selectedPeriod.value,
    preferences.value.canSolo,
    preferences.value.canLead,
    preferences.value.canAssist,
    preferences.value.maxCookingDays
  );
  showSavedMessage.value = true;
  setTimeout(() => (showSavedMessage.value = false), 4000);
}

// --- Navigation ---
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
  const currentPeriodData = await schedulerStore._getCurrentPeriod();
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
  generateCalendar();
  await loadPeriodData();
});

watch([selectedYear, selectedMonth], async () => {
  generateCalendar();
  await loadPeriodData();
});
</script>

<template>
  <div class="calendar-wrapper">
    <div class="availability-calendar">
      <div class="calendar-header">
        <button class="nav-btn" @click="prevMonth">◀</button>
        <select v-model="selectedYear">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
        <select v-model="selectedMonth">
          <option v-for="(month, index) in months" :key="month" :value="index + 1">
            {{ month }}
          </option>
        </select>
        <button class="nav-btn" @click="nextMonth">▶</button>
      </div>

      <div class="calendar-grid">
        <div class="day-name" v-for="day in dayNames" :key="day">{{ day }}</div>
        <div
          v-for="(date, index) in calendarDays"
          :key="index"
          class="calendar-cell"
          :class="{
            empty: !date,
            available: date && availability.has(dateToString(date)) && canEdit,
            notEditable: date && !canEdit,
            nonCookingDay: date && !cookingDates.has(dateToString(date)),
          }"
          @click="
            date &&
              canEdit &&
              cookingDates.has(dateToString(date)) &&
              onDayClick(dateToString(date))
          "
        >
          <span v-if="date">{{ date.getDate() }}</span>
        </div>
      </div>

      <div class="jump-btn-container">
        <button class="jump-btn" @click="jumpToCurrentPeriod">Jump to Current Period</button>
        <div v-if="showFallbackMessage" class="fallback-message">
          No current period set — showing this month instead.
        </div>
      </div>

      <div v-if="!canEdit" class="closed-message">
        Availability editing is closed or you are not registered as a cook.
      </div>
    </div>

    <div class="preferences-panel">
      <h3>Preferences for {{ months[selectedMonth - 1] }} {{ selectedYear }}</h3>

      <div class="pref-item">
        <input type="checkbox" id="canSolo" v-model="preferences.canSolo" :disabled="!canEdit" />
        <label for="canSolo">Can solo cook</label>
      </div>

      <div class="pref-item">
        <input type="checkbox" id="canLead" v-model="preferences.canLead" :disabled="!canEdit" />
        <label for="canLead">Can lead in pair</label>
      </div>

      <div class="pref-item">
        <input
          type="checkbox"
          id="canAssist"
          v-model="preferences.canAssist"
          :disabled="!canEdit"
        />
        <label for="canAssist">Can assist in pair</label>
      </div>

      <div class="pref-item">
        <label for="maxDays">Max cooking days:</label>
        <input
          type="number"
          id="maxDays"
          v-model.number="preferences.maxCookingDays"
          min="0"
          :disabled="!canEdit"
        />
      </div>

      <button class="save-btn" @click="savePreferences" :disabled="!canEdit">
        Save Preferences
      </button>
      <span v-if="showSavedMessage" class="saved-message">Saved</span>
    </div>
  </div>
</template>

<style scoped>
.calendar-wrapper {
  display: flex;
  gap: 30px;
  justify-content: center;
  align-items: flex-start;
  margin-top: 20px;
  font-family: sans-serif;
}

.availability-calendar {
  width: 280px;
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
  cursor: pointer;
}

.calendar-cell.empty {
  background: #f9f9f9;
  color: #ccc;
  cursor: default;
}

.calendar-cell.available {
  background: #39673a;
  color: white;
}

.calendar-cell.nonCookingDay {
  background-color: #f0f0f0;
  color: #ccc;
  cursor: not-allowed;
}

.calendar-cell.nonCookingDay.available {
  background-color: #a5d6a7;
  color: #666;
}

.calendar-cell.notEditable {
  background-color: #eee;
  color: #999;
  cursor: not-allowed;
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

.jump-btn-container {
  margin-top: 12px;
  text-align: center;
}

.jump-btn {
  background: #39673a;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.jump-btn:hover {
  background: #2c5e2c;
}

.closed-message {
  margin-top: 8px;
  text-align: center;
  color: #999;
  font-style: italic;
  font-size: 0.9rem;
}

.preferences-panel {
  width: 250px;
  border-left: 1px solid #ccc;
  padding-left: 20px;
}

.pref-item {
  margin-bottom: 10px;
}

.pref-item label {
  margin-left: 6px;
}

.save-btn {
  background: #39673a;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn:hover {
  background: #2c5e2c;
}

.save-btn:disabled {
  background: #aaa;
  cursor: not-allowed;
}

.saved-message {
  display: inline-block;
  margin-left: 10px;
  color: #39673a;
  font-weight: bold;
  font-size: 0.95rem;
}

.fallback-message {
  margin-top: 8px;
  text-align: center;
  color: #b15a00;
  font-size: 0.9rem;
  font-style: italic;
}
</style>
