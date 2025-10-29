import { ref, computed } from "vue";
import { defineStore } from "pinia";

import { monthYearToString, stringToMonthYear } from "@/utils";

export const useSchedulerStore = defineStore("scheduler", () => {
  // periods represented in YYYY-MM format
  // days represented in YYYY-MM-DD format

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayPeriod = monthYearToString(todayMonth, todayYear);

  const periodSet: Set<string> = new Set();
  const periods = ref(periodSet);
  periods.value.add(todayPeriod);

  const currentPeriod = ref(todayPeriod);
  const currentYear = computed(() => stringToMonthYear(currentPeriod.value).year);
  const currentMonth = computed(() => stringToMonthYear(currentPeriod.value).month); // 1-indexing of months

  const addPeriod = (period: string) => {
    periods.value.add(period);
  };

  const removePeriod = (period: string) => {
    periods.value.delete(period);
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

  const preferencesMap: Map<
    string, // kerb
    Map<string, { canSolo: boolean; canLead: boolean; canAssist: boolean; maxCookingDays: number }>
  > = new Map(); //kerb -> period  -> preference

  const preferences = ref(preferencesMap);

  const uploadPreference = (
    kerb: string,
    period: string,
    canSolo: boolean,
    canLead: boolean,
    canAssist: boolean,
    maxCookingDays: number
  ) => {};

  return {
    cooks,
    periods,
    currentPeriod,
    currentYear,
    currentMonth,
    cookingDays,
    addCookingDay,
    removeCookingDay,
    addPeriod,
    removePeriod,
    setCurrentPeriod,
    addCook,
    removeCook,
  };
});
