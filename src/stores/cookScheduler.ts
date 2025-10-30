import { ref, computed } from "vue";
import { defineStore } from "pinia";

import { monthYearToString, stringToMonthYear } from "@/utils";

export const useSchedulerStore = defineStore("scheduler", () => {
  const formsOpenMap: Map<string, boolean> = new Map(); // period -> boolean
  const formsOpen = ref(formsOpenMap);

  const toggleForm = (period: string) => {
    if (formsOpen.value.has(period)) {
      const oldValue = formsOpen.value.get(period);
      formsOpen.value.set(period, !oldValue);
    }
  };
  // periods represented in YYYY-MM format
  // days represented in YYYY-MM-DD format
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayPeriod = monthYearToString(todayMonth, todayYear);

  const periodSet: Set<string> = new Set();
  const periods = ref(periodSet);

  const currentPeriod = ref(todayPeriod);
  const currentYear = computed(() => stringToMonthYear(currentPeriod.value).year);
  const currentMonth = computed(() => stringToMonthYear(currentPeriod.value).month); // 1-indexing of months

  const addPeriod = (period: string) => {
    periods.value.add(period);
    formsOpen.value.set(period, false);
  };

  addPeriod(todayPeriod);

  const removePeriod = (period: string) => {
    periods.value.delete(period);
    formsOpen.value.delete(period);
  };

  const setCurrentPeriod = (period: string) => {
    if (periods.value.has(period)) {
      currentPeriod.value = period;
    } else {
      throw new Error("Period not added yet");
    }
  };

  const cookMap: Map<string, Set<string>> = new Map();
  const cooks = ref(cookMap);

  const addCook = (period: string, cook: string) => {
    if (!periods.value.has(period)) {
      throw new Error("Invalid period");
    } else {
      const cookSet = cooks.value.get(period);
      if (cookSet !== undefined) {
        cookSet.add(cook);
      } else {
        cooks.value.set(period, new Set([cook]));
      }
    }
  };

  const removeCook = (period: string, cook: string) => {
    if (!periods.value.has(period)) {
      throw new Error("Invalid period");
    } else {
      const cookSet = cooks.value.get(period);
      if (cookSet !== undefined) {
        cookSet.delete(cook);
      }
    }
  };

  const cookingDaysMap: Map<string, Set<string>> = new Map(); // period -> set of days
  const cookingDays = ref(cookingDaysMap);

  const addCookingDay = (day: string) => {
    console.log("adding cooking day");
    const period = day.slice(0, 7);
    if (periods.value.has(period)) {
      const oldMap = new Map(cookingDays.value); // force reactivity
      const daySet = new Set(oldMap.get(period) ?? []);
      daySet.add(day);
      oldMap.set(period, daySet);
      cookingDays.value = oldMap;
    } else {
      throw new Error("Period has not been registered yet");
    }
  };

  const removeCookingDay = (day: string) => {
    const period = day.slice(0, 7);
    if (periods.value.has(period)) {
      const oldMap = new Map(cookingDays.value); // force reactivity
      const daySet = new Set(oldMap.get(period) ?? []);
      daySet.delete(day);
      oldMap.set(period, daySet);
      cookingDays.value = oldMap;
    } else {
      throw new Error("Period has not been registered yet");
    }
  };

  const availabilitiesMap: Map<string, Set<string>> = new Map(); // maps period -> set of days, corresponds to the logged in user
  const availabilities = ref(availabilitiesMap);

  const addAvailability = (day: string) => {
    // day is string in YYYY-MM-DD format
    const period = day.slice(0, 7);
    if (periods.value.has(period)) {
      const oldSet = availabilities.value.get(period);
      const availabilitySet = oldSet ? oldSet : new Set<string>();
      availabilitySet.add(day);
      availabilities.value.set(period, availabilitySet);
    }
  };

  const removeAvailability = (day: string) => {
    // day is string in YYYY-MM-DD format
    const period = day.slice(0, 7);
    if (periods.value.has(period)) {
      const oldSet = availabilities.value.get(period);
      const availabilitySet = oldSet ? oldSet : new Set<string>();
      availabilitySet.delete(day);
      availabilities.value.set(period, availabilitySet);
    }
  };

  const preferencesMap: Map<
    string, // period
    { canSolo: boolean; canLead: boolean; canAssist: boolean; maxCookingDays: number }
  > = new Map(); //period  -> preference

  const preferences = ref(preferencesMap);

  const uploadPreferences = (
    period: string,
    canSolo?: boolean,
    canLead?: boolean,
    canAssist?: boolean,
    maxCookingDays?: number
  ) => {
    preferences.value.set(period, {
      canSolo: canSolo ? canSolo : false,
      canLead: canLead ? canLead : false,
      canAssist: canAssist ? canAssist : false,
      maxCookingDays: maxCookingDays ? maxCookingDays : 0,
    });
  };

  return {
    cooks,
    periods,
    currentPeriod,
    currentYear,
    currentMonth,
    cookingDays,
    formsOpen,
    availabilities,
    preferences,
    toggleForm,
    addCookingDay,
    removeCookingDay,
    addPeriod,
    removePeriod,
    setCurrentPeriod,
    addCook,
    removeCook,
    addAvailability,
    removeAvailability,
    uploadPreferences,
  };
});
