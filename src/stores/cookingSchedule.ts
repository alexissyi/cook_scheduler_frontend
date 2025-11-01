import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { monthYearToString, stringToMonthYear } from "@/utils";

const BASE_URL = "/api/CookingSchedule";

export const useSchedulerStore = defineStore("scheduler", () => {
  const currentPeriod = ref("");

  const currentYear = computed(() =>
    currentPeriod.value ? stringToMonthYear(currentPeriod.value).year : null
  );
  const currentMonth = computed(() =>
    currentPeriod.value ? stringToMonthYear(currentPeriod.value).month : null
  );

  /** Generic POST helper with logging and error handling */
  const postRequest = async (endpoint: string, payload: Record<string, any> = {}) => {
    try {
      console.log(`POST ${endpoint}:`, payload);
      const { data } = await axios.post(`${BASE_URL}/${endpoint}`, payload);
      console.log("Response data:", data);
      return data;
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
      return { error };
    }
  };

  // Define all API methods cleanly using the helper
  const api = {
    addCook: (period: string, user: string) => postRequest("addCook", { period, user }),
    removeCook: (period: string, user: string) => postRequest("removeCook", { period, user }),

    openPeriod: (period: string) => postRequest("openPeriod", { period }),
    closePeriod: (period: string) => postRequest("closePeriod", { period }),
    addPeriod: (period: string) => postRequest("addPeriod", { period, current: false }),
    removePeriod: (period: string) => postRequest("removePeriod", { period }),
    setCurrentPeriod: (period: string) => postRequest("setCurrentPeriod", { period }),

    addCookingDate: (date: string) => postRequest("addCookingDate", { date }),
    removeCookingDate: (date: string) => postRequest("removeCookingDate", { date }),

    uploadPreference: (
      user: string,
      period: string,
      canSolo: boolean,
      canLead: boolean,
      canAssist: boolean,
      maxCookingDays: number
    ) =>
      postRequest("uploadPreference", {
        user,
        period,
        canSolo,
        canLead,
        canAssist,
        maxCookingDays,
      }),

    addAvailability: (user: string, date: string) => postRequest("addAvailability", { user, date }),
    removeAvailability: (user: string, date: string) =>
      postRequest("removeAvailability", { user, date }),

    assignLead: (user: string, date: string) => postRequest("assignLead", { user, date }),
    assignAssistant: (user: string, date: string) => postRequest("assignAssistant", { user, date }),
    removeAssignment: (date: string) => postRequest("removeAssignment", { date }),

    generateAssignments: () => postRequest("generateAssignments"),
    generateAssignmentsWithLLM: () => postRequest("generateAssignmentsWithLLM"),
    clearAssignments: (period: string)=> postRequest("clearAssignments", {period}),

    _isRegisteredPeriod: (period: string) => postRequest("_isRegisteredPeriod", { period }),
    _isRegisteredCook: (user: string, period: string) =>
      postRequest("_isRegisteredCook", { user, period }),
    _isCurrentPeriod: (period: string) => postRequest("_isCurrentPeriod", { period }),
    _isOpen: (period: string) => postRequest("_isOpen", { period }),

    _getCooks: (period: string) => postRequest("_getCooks", { period }),
    _getCookingDates: (period: string) => postRequest("_getCookingDates", { period }),
    _getCurrentPeriod: () => postRequest("_getCurrentPeriod"),
    _getAssignment: (date: string) => postRequest("_getAssignment", { date }),
    _getAssignments: (period: string) => postRequest("_getAssignments", { period }),
    _getAvailability: (user: string, period: string) =>
      postRequest("_getAvailability", { user, period }),
    _getPreference: (user: string, period: string) =>
      postRequest("_getPreference", { user, period }),
    _getCandidateCooks: (date: string) => postRequest("_getCandidateCooks", { date }),
  };

  return {
    currentPeriod,
    currentYear,
    currentMonth,
    ...api,
  };
});
