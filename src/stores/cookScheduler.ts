import { ref, computed } from "vue";
import { defineStore } from "pinia";

const stringToMonthYear = (periodString: string) => {
  const monthString = periodString.slice(-2);
  const yearString = periodString.slice(0, 4);
  const month = parseInt(monthString);
  const year = parseInt(yearString);
  return { month: month, year: year };
};

const monthYearToString = (month: number, year: number) => {
  let monthString = month.toString();
  if (monthString.length < 2) {
    monthString = "0" + monthString;
  }
  let yearString = year.toString();
  while (yearString.length < 4) {
    yearString = "0" + yearString;
  }
  return yearString + "-" + monthString;
};

export const useSchedulerStore = defineStore("scheduler", () => {
  // periods represented in YYYY-MM format
  const periodSet: Set<string> = new Set();
  const periods = ref(periodSet);
  const currentPeriod = ref("");

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

  return { periods, currentPeriod, addPeriod, removePeriod, setCurrentPeriod, addCook, removeCook };
});
