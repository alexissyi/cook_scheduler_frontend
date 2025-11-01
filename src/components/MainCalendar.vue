<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import {
  months,
  dayNames,
  dateToString,
  stringToYear,
  stringToMonth,
  getPeriod,
  monthYearToString,
  getDay,
} from "@/utils";
import { useSchedulerStore } from "@/stores/cookingSchedule";
import { useUserStore } from "@/stores/userAuthentication";

const schedulerStore = useSchedulerStore();
const userStore = useUserStore();

const { isFoodStud } = storeToRefs(userStore);
// non-period-specific state
const allUsers = ref<Array<{ user: string; kerb: string }>>([]); // users to select cooks from
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

interface DateObj {
  date: Date | null;
  inCurrentMonth: boolean;
}

const today = new Date();
const year = today.getFullYear();
const selectedPeriod = ref(getPeriod(dateToString(today))); // YYYY-MM-DD
const selectedMonth = computed(() => stringToMonth(selectedPeriod.value));
const selectedYear = computed(() => stringToYear(selectedPeriod.value));

const cookingDates = ref<Set<string>>(new Set());
const cooks = ref<Set<string>>(new Set());
const isCurrent = ref(false);
const isRegistered = ref(false);
const detailedAssignmentData = ref<
  Map<
    string,
    {
      lead: string | null;
      assistant: string | null;
      leadKerb: string | null;
      assistantKerb: string | null;
      needsAssistant: boolean;
    }
  >
>(new Map()); // date -> data

// load cooks, dates, and assignments for selected period
async function loadPeriodData() {
  const period = selectedPeriod.value;
  const [datesData, cooksData, isRegisteredData, isCurrentData, assignmentData] = await Promise.all(
    [
      schedulerStore._getCookingDates(period),
      schedulerStore._getCooks(period),
      schedulerStore._isRegisteredPeriod(period),
      schedulerStore._isCurrentPeriod(period),
      schedulerStore._getAssignments(period),
    ]
  );

  cookingDates.value = new Set(datesData?.map((d: any) => d.cookingDate));
  cooks.value = new Set(cooksData?.map((d: any) => d.cook));

  for (const cookingDate of cookingDates.value) {
    detailedAssignmentData.value.set(cookingDate, {
      lead: null,
      assistant: null,
      needsAssistant: true,
      leadKerb: null,
      assistantKerb: null,
    });
  }
  if (isRegisteredData) {
    isRegistered.value = isRegisteredData[0].isRegisteredPeriod;
  }
  if (isCurrentData) {
    isCurrent.value = isCurrentData[0].isCurrentPeriod;
  }
  if (assignmentData) {
    for (const assignmentItem of assignmentData) {
      const assignment = assignmentItem.assignment;
      const lead = assignment.lead;
      const assistant = assignment.assistant;
      const date = assignment.date;
      const leadPreferenceData = await schedulerStore._getPreference(lead, selectedPeriod.value);
      const needsAssistant = leadPreferenceData ? !leadPreferenceData[0].canSolo : true;
      const leadKerb = getKerb(lead);
      const assistantKerb = getKerb(assistant);
      detailedAssignmentData.value.set(date, {
        lead: lead,
        assistant: assistant,
        needsAssistant: needsAssistant,
        leadKerb: leadKerb ? leadKerb : null,
        assistantKerb: assistant && assistantKerb ? assistantKerb : null,
      });
    }
  }

  llmFailed.value = false;
}

// selected date and available cooks - for main display and foodstud side control panel
const selectedDate = ref<string | null>(null);
const selectedDay = computed(() => (selectedDate.value ? getDay(selectedDate.value) : null));
const availableCooks = ref({
  lead: [] as { user: string; daysLeft: number; canSolo: boolean }[],
  assist: [] as { user: string; daysLeft: number; canSolo: boolean }[],
});

const leadCook = computed(() => {
  if (selectedDate.value) {
    const assignment = detailedAssignmentData.value.get(selectedDate.value);
    if (assignment) {
      return assignment.lead;
    }
  }
  return null;
}); // user UUID
const leadKerb = computed(() => (leadCook.value ? getKerb(leadCook.value) : null));
const assistantCook = computed(() => {
  if (selectedDate.value) {
    const assignment = detailedAssignmentData.value.get(selectedDate.value);
    if (assignment) {
      return assignment.assistant;
    }
  }
  return null;
}); // user UUID
const assistantKerb = computed(() => (assistantCook.value ? getKerb(assistantCook.value) : null));
const needsAssistant = computed(() => {
  if (selectedDate.value) {
    const assignment = detailedAssignmentData.value.get(selectedDate.value);
    if (assignment) {
      return assignment.needsAssistant;
    }
  }
  return false;
}); //should be true when a lead is assigned who is not willing to solo

// calendar generation
const calendarDays = ref<DateObj[]>([]);
function generateCalendar() {
  const firstDay = new Date(selectedYear.value, selectedMonth.value - 1, 1);
  const lastDay = new Date(selectedYear.value, selectedMonth.value, 0);
  const days: DateObj[] = [];

  // previous month fillers
  const startWeekday = firstDay.getDay();
  for (let i = startWeekday - 1; i >= 0; i--) {
    const date = new Date(selectedYear.value, selectedMonth.value - 1, -i);
    days.push({ date, inCurrentMonth: false });
  }
  // current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(selectedYear.value, selectedMonth.value - 1, d);
    days.push({ date, inCurrentMonth: true });
  }
  // next month fillers
  const endWeekday = lastDay.getDay();
  for (let i = 1; i < 7 - endWeekday; i++) {
    const date = new Date(selectedYear.value, selectedMonth.value - 1, lastDay.getDate() + i);
    days.push({ date, inCurrentMonth: false });
  }

  calendarDays.value = days;
}

// navigation
function prevMonth() {
  const month = selectedMonth.value;
  const year = selectedYear.value;
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  selectedPeriod.value = monthYearToString(prevMonth, prevYear);
  generateCalendar();
  loadPeriodData();
  selectedDate.value = null;
}

function nextMonth() {
  const month = selectedMonth.value;
  const year = selectedYear.value;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  selectedPeriod.value = monthYearToString(nextMonth, nextYear);
  generateCalendar();
  loadPeriodData();
  selectedDate.value = null;
}

// jump to current if not already there
async function jumpToCurrentPeriod() {
  if (isCurrent.value) {
    return;
  }
  const currentPeriodData = await schedulerStore._getCurrentPeriod();
  if (currentPeriodData) {
    selectedPeriod.value = currentPeriodData[0].period;
  }
  generateCalendar();
  await loadPeriodData();
  selectedDate.value = null;
}

// check if date is today
function isToday(date: Date | null) {
  if (!date) return false;
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

// load available cooks for clicked date
async function loadAvailableCooksForDate(date: string) {
  showNoAssistantWithoutLeadMsg.value = false;
  selectedDate.value = date;
  availableCooks.value = { lead: [], assist: [] };

  try {
    const candidates = await schedulerStore._getCandidateCooks(date); // [{user:string, daysLeft: number}]
    if (!Array.isArray(candidates)) return;

    const period = selectedPeriod.value;

    const prefs = await Promise.all(
      candidates.map(async (c: any) => {
        const prefData = await schedulerStore._getPreference(c.user, period);
        const pref = Array.isArray(prefData) ? prefData[0] : null;
        return {
          user: c.user,
          daysLeft: c.daysLeft,
          canSolo: pref?.canSolo,
          canLead: pref?.canLead,
          canAssist: pref?.canAssist,
          maxCookingDays: pref?.maxCookingDays ?? 0,
        };
      })
    );
    availableCooks.value.lead = prefs.filter((p) => p.canLead || p.canSolo);
    availableCooks.value.assist = prefs.filter((p) => p.canAssist);
  } catch (err) {
    console.error("Error loading available cooks:", err);
  }
}

// assignment

async function assignLead(user: string) {
  if (selectedDate.value) {
    await schedulerStore.assignLead(user, selectedDate.value);
    await loadPeriodData();
    await loadAvailableCooksForDate(selectedDate.value);
  }
}

const showNoAssistantWithoutLeadMsg = ref(false);

async function assignAssistant(user: string) {
  if (!leadKerb.value) {
    showNoAssistantWithoutLeadMsg.value = true;
    return;
  }
  if (selectedDate.value) {
    await schedulerStore.assignAssistant(user, selectedDate.value);
    await loadPeriodData();
    await loadAvailableCooksForDate(selectedDate.value);
  }
}

async function clearAssignment() {
  if (selectedDate.value && leadKerb.value) {
    await schedulerStore.removeAssignment(selectedDate.value);
    await loadPeriodData();
    await loadAvailableCooksForDate(selectedDate.value);
  }
}

async function generateAssignments() {
  if (!isCurrent.value) {
    return;
  }
  console.log(`Generating assignments algorithmically for ${selectedPeriod.value}`);
  await schedulerStore.generateAssignments();
  await loadPeriodData();
  if (selectedDate.value) {
    await loadAvailableCooksForDate(selectedDate.value);
  }
}

const llmFailed = ref(false);
async function generateAssignmentsWithLLM() {
  if (!isCurrent.value) {
    return;
  }
  console.log(`Generating assignments via llm for ${selectedPeriod.value}`);
  const result = await schedulerStore.generateAssignmentsWithLLM();
  if (result.error) {
    llmFailed.value = true;
    return;
  }
  await loadPeriodData();
  if (selectedDate.value) {
    await loadAvailableCooksForDate(selectedDate.value);
  }
}

async function clearAllAssignments() {
  await schedulerStore.clearAssignments(selectedPeriod.value);
  await loadPeriodData();
  if (selectedDate.value) {
    await loadAvailableCooksForDate(selectedDate.value);
  }
}
// year range
const years = computed(() => {
  const range: number[] = [];
  for (let y = year - 2; y <= year + 2; y++) range.push(y);
  return range;
});

onMounted(async () => {
  fetchUsers();
  generateCalendar();
  await loadPeriodData();
});
</script>

<template>
  <div class="calendar-wrapper">
    <!-- keep calendar in its original place -->
    <div class="availability-calendar">
      <!-- Header -->
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
      <div v-if="isCurrent" class="generate-btn-container">
        <button class="generate-btn" @click="generateAssignments">Generate (Algo)</button>
        <button class="generate-btn" @click="generateAssignmentsWithLLM">Generate (LLM)</button>
        <button class="generate-btn" @click="clearAllAssignments">Clear Assignments</button>
      </div>
      <h5 v-if="llmFailed" class="no-assignments-msg">
        LLM failed, please try manual or algorithmic no-assignment-msg
      </h5>

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
            selected: dayObj.date && selectedDate === dateToString(dayObj.date),
            'not-cooking-day':
              dayObj.date && dayObj.inCurrentMonth && !cookingDates.has(dateToString(dayObj.date)),
          }"
          @click="
            dayObj.date &&
              isFoodStud &&
              cookingDates.has(dateToString(dayObj.date)) &&
              loadAvailableCooksForDate(dateToString(dayObj.date))
          "
        >
          <template v-if="dayObj.date">
            <span class="date-number">{{ dayObj.date.getDate() }}</span>
            <div class="assignment-info" v-if="dayObj.inCurrentMonth">
              <template v-if="cookingDates.has(dateToString(dayObj.date))">
                <span
                  v-if="
                    detailedAssignmentData.get(dateToString(dayObj.date))?.leadKerb ||
                    detailedAssignmentData.get(dateToString(dayObj.date))?.assistantKerb
                  "
                >
                  {{
                    [
                      detailedAssignmentData.get(dateToString(dayObj.date))?.leadKerb,
                      detailedAssignmentData.get(dateToString(dayObj.date))?.assistantKerb,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  }}
                </span>
              </template>
            </div>
          </template>
        </div>
      </div>

      <!-- Jump button -->
      <div class="jump-btn-container">
        <button class="jump-btn" @click="jumpToCurrentPeriod">Jump to Current Period</button>
      </div>
    </div>

    <!-- food stud controls rightside panel -->
    <div v-if="isFoodStud && selectedDate" class="availability-panel">
      <h3>Make Assignments for {{ months[selectedMonth - 1] }} {{ selectedDay }}</h3>
      <div class="selection-section">
        <div class="role-section">
          <h4>Lead</h4>
          <button class="cook-btn" v-if="leadKerb" @click="clearAssignment">
            {{ leadKerb }}
          </button>
          <h5 v-else class="no-assignment-msg">No lead assigned</h5>
          <h5 v-if="needsAssistant && leadKerb && !assistantKerb" class="no-assignment-msg">
            This lead needs an assistant.
          </h5>

          <h5>Candidates</h5>
          <div class="role-buttons">
            <button
              v-for="cook in availableCooks.lead"
              :key="cook.user"
              class="cook-btn"
              @click="assignLead(cook.user)"
            >
              {{ getKerb(cook.user) }} ({{ cook.daysLeft }}) {{ cook.canSolo ? "(can solo)" : "" }}
            </button>
          </div>
        </div>

        <div class="role-section">
          <h4>Assist</h4>
          <button class="cook-btn" v-if="assistantKerb" @click="clearAssignment">
            {{ assistantKerb }}
          </button>
          <h5 v-else class="no-assignment-msg">No assistant assigned</h5>
          <h5 v-if="showNoAssistantWithoutLeadMsg" class="no-assignment-msg">
            Cannot assign assistant without a lead
          </h5>
          <h5>Candidates</h5>
          <div class="role-buttons">
            <button
              v-for="cook in availableCooks.assist"
              :key="cook.user"
              class="cook-btn"
              @click="assignAssistant(cook.user)"
            >
              {{ getKerb(cook.user) }} ({{ cook.daysLeft }})
            </button>
          </div>
        </div>
      </div>
      <button @click="clearAssignment" class="clear-assignment-button">Clear Assignment</button>
    </div>
  </div>
</template>

<style scoped>
.calendar-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  font-family: sans-serif;
  padding: 16px;
}

/* keep existing calendar styles */
.availability-calendar {
  width: 560px;
}

/* new side panel */
.availability-panel {
  margin-left: 24px;
  width: 320px;
  border: 1px solid #ccc;
  padding: 12px;
  background: #d7f2c6;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.role-section {
  margin-top: 10px;
}

.role-section h4 {
  font-weight: bold;
  margin: 6px 0;
  color: #39673a;
}

.role-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cook-btn {
  background-color: #39673a; /* green */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 6px 10px;
  margin: 4px 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}
.cook-btn:hover {
  background-color: #2c5e2c;
  transform: scale(1.05);
}

.no-assignment-msg {
  font-style: italic;
  color: #b15a00;
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
  cursor: pointer;
  background: #fff;
  transition: background 0.2s ease;
}

/* existing cell states */
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

.calendar-cell.selected {
  outline: 3px solid #2c5e2c;
}

/* new: gray out days that are not cooking dates */
.calendar-cell.not-cooking-day {
  background: #f3f3f3;
  color: #bbb;
  opacity: 0.6;
  cursor: not-allowed;
}

.assignment-info {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  transform: translate(-50%, -10%);
  text-align: center;
  font-size: 0.75rem;
  color: #39673a;
  line-height: 1.2;
  pointer-events: none; /* allows clicking the cell without blocking */
}

.date-number {
  font-weight: bold;
  font-size: 0.7rem;
}

.generate-btn-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 8px;
  padding: 8px;
}

.nav-btn,
.jump-btn,
.generate-btn {
  background: #39673a;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.nav-btn:hover,
.jump-btn:hover,
.generate-btn:hover {
  background: #2c5e2c;
  transform: scale(1.05);
}

.jump-btn-container {
  margin-top: 12px;
  text-align: center;
}

.selection-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.clear-assignment-button {
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background: #39673a;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.clear-assignment-button:hover {
  transform: scale(1.05);
}
</style>
