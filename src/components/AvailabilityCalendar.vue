<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useSchedulerStore } from "@/stores/cookScheduler";
import { useUserStore } from "@/stores/userAuthentication";
import { months, dayNames, dateToString } from "@/utils";

// Scheduler store
const schedulerStore = useSchedulerStore();
const {
  currentMonth,
  currentYear,
  periods,
  formsOpen,
  cookingDays,
  availabilities,
  preferences,
  cooks,
} = storeToRefs(schedulerStore);
const { addAvailability, removeAvailability, uploadPreferences } = schedulerStore;

// User store
const userStore = useUserStore();
const currentKerb = computed(() => userStore.currentKerb);

// Selected month/year
const selectedYear = ref(currentYear.value);
const selectedMonth = ref(currentMonth.value); // 1-indexed

// Computed period string
const selectedPeriod = computed(() => {
  const month = String(selectedMonth.value).padStart(2, "0");
  return `${selectedYear.value}-${month}`;
});

// Availability for this period
const availabilitySet = computed(() => {
  return availabilities.value.get(selectedPeriod.value) ?? new Set<string>();
});

// Determine if period is open
const formOpenForSelected = computed(() => formsOpen.value.get(selectedPeriod.value) ?? false);

// Cooking days for this period
const cookingDaysSet = computed(
  () => cookingDays.value.get(selectedPeriod.value) ?? new Set<string>()
);

// Check if user is registered as cook for this period
const isRegisteredCook = computed(() => {
  const cookSet = cooks.value.get(selectedPeriod.value);
  return cookSet?.has(currentKerb.value) ?? false;
});

// Determine if user can edit
const canEdit = computed(() => formOpenForSelected.value && isRegisteredCook.value);

// Calendar array
const calendarDays = ref<(Date | null)[]>([]);

// Generate years list
const years: number[] = Array.from({ length: 10 }, (_, i) => currentYear.value - 5 + i);

// Preferences reactive state
const localCanSolo = ref(false);
const localCanLead = ref(false);
const localCanAssist = ref(false);
const localMaxCookingDays = ref(0);

// Sync preferences from store
function loadPreferences() {
  const pref = preferences.value.get(selectedPeriod.value);
  if (pref) {
    localCanSolo.value = pref.canSolo;
    localCanLead.value = pref.canLead;
    localCanAssist.value = pref.canAssist;
    localMaxCookingDays.value = pref.maxCookingDays;
  } else {
    localCanSolo.value = false;
    localCanLead.value = false;
    localCanAssist.value = false;
    localMaxCookingDays.value = 0;
  }
}

const showSavedMessage = ref(false);

function savePreferences() {
  if (!canEdit.value) {
    alert(
      "Cannot save preferences: either this period is closed or you are not registered as a cook."
    );
    return;
  }
  uploadPreferences(
    selectedPeriod.value,
    localCanSolo.value,
    localCanLead.value,
    localCanAssist.value,
    localMaxCookingDays.value
  );

  // Show temporary "Saved" message
  showSavedMessage.value = true;
  setTimeout(() => {
    showSavedMessage.value = false;
  }, 5000); // disappears after 5 seconds
}

// Generate calendar
function generateCalendar(): void {
  const firstDay = new Date(selectedYear.value, selectedMonth.value - 1, 1);
  const lastDay = new Date(selectedYear.value, selectedMonth.value, 0);

  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay();

  const daysArray: (Date | null)[] = [];

  for (let i = 0; i < startWeekday; i++) daysArray.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    daysArray.push(new Date(selectedYear.value, selectedMonth.value - 1, day));
  }
  while (daysArray.length % 7 !== 0) daysArray.push(null);

  calendarDays.value = daysArray;
}

// Navigation
function prevMonth() {
  if (selectedMonth.value === 1) {
    selectedMonth.value = 12;
    selectedYear.value -= 1;
  } else selectedMonth.value -= 1;
  generateCalendar();
}

function nextMonth() {
  if (selectedMonth.value === 12) {
    selectedMonth.value = 1;
    selectedYear.value += 1;
  } else selectedMonth.value += 1;
  generateCalendar();
}

// Jump to current period
function jumpToCurrentPeriod() {
  selectedYear.value = currentYear.value;
  selectedMonth.value = currentMonth.value;
  generateCalendar();
}

// Toggle availability
function onDayClick(day: string) {
  if (!periods.value.has(selectedPeriod.value)) return;
  if (!canEdit.value) {
    alert("Availability editing is closed for this period or you are not registered as a cook.");
    return;
  }
  if (!cookingDaysSet.value.has(day)) return;

  if (availabilitySet.value.has(day)) removeAvailability(day);
  else addAvailability(day);
}

// Initialize calendar
generateCalendar();

// Watch for period changes to auto-load preferences
watch([selectedMonth, selectedYear, preferences], () => {
  generateCalendar();
  loadPreferences();
});
</script>

<template>
  <div class="calendar-wrapper">
    <!-- Calendar -->
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
            available: date && availabilitySet?.has(dateToString(date)) && canEdit,
            notEditable: date && !canEdit,
            nonCookingDay: date && !cookingDaysSet.has(dateToString(date)),
          }"
          @click="
            date &&
              canEdit &&
              cookingDaysSet.has(dateToString(date)) &&
              onDayClick(dateToString(date))
          "
        >
          <span v-if="date">{{ date.getDate() }}</span>
        </div>
      </div>

      <div class="jump-btn-container">
        <button class="jump-btn" @click="jumpToCurrentPeriod">Jump to Current Period</button>
      </div>

      <div v-if="!canEdit" class="closed-message">
        Availability editing is closed or you are not registered as a cook for this period.
      </div>
    </div>

    <!-- Preferences Panel -->
    <div class="preferences-panel">
      <h3>Preferences for {{ months[selectedMonth - 1] }} {{ selectedYear }}</h3>
      <div class="pref-item">
        <input type="checkbox" id="canSolo" v-model="localCanSolo" :disabled="!canEdit" />
        <label for="canSolo">Can solo cook</label>
      </div>
      <div class="pref-item">
        <input type="checkbox" id="canLead" v-model="localCanLead" :disabled="!canEdit" />
        <label for="canLead">Can lead in pair</label>
      </div>
      <div class="pref-item">
        <input type="checkbox" id="canAssist" v-model="localCanAssist" :disabled="!canEdit" />
        <label for="canAssist">Can assist in pair</label>
      </div>
      <div class="pref-item">
        <label for="maxDays">Max cooking days:</label>
        <input
          type="number"
          id="maxDays"
          v-model.number="localMaxCookingDays"
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
</style>
