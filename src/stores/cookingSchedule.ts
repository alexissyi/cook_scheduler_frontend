import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { monthYearToString, stringToMonthYear } from "@/utils";

const BASE_URL = "/api/CookingSchedule";
const SYNC_URL = "/api";

export const useSchedulerStore = defineStore("scheduler", () => {
  const currentPeriod = ref("");

  const currentYear = computed(() =>
    currentPeriod.value ? stringToMonthYear(currentPeriod.value).year : null
  );
  const currentMonth = computed(() =>
    currentPeriod.value ? stringToMonthYear(currentPeriod.value).month : null
  );

  /** Generic POST helper with logging and error handling */
  const postRequest = async (
    endpoint: string,
    payload: Record<string, any> = {},
    base_url: string = BASE_URL
  ) => {
    try {
      console.log(`POST ${endpoint}:`, payload);
      const { data } = await axios.post(`${base_url}/${endpoint}`, payload);
      console.log("Response data:", data);
      return data;
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
      return { error };
    }
  };

  // Define all API methods cleanly using the helper
  const api = {
    addCook: (session: string, period: string, user: string) =>
      postRequest("addCook", { session, period, user }, SYNC_URL),
    removeCook: (session: string, period: string, user: string) =>
      postRequest("removeCook", { session, period, user }, SYNC_URL),

    openPeriod: (session: string, period: string) =>
      postRequest("openPeriod", { session, period }, SYNC_URL),
    closePeriod: (session: string, period: string) =>
      postRequest("closePeriod", { session, period }, SYNC_URL),
    addPeriod: (session: string, period: string) =>
      postRequest("addPeriod", { session, period, current: false }, SYNC_URL),
    removePeriod: (session: string, period: string) =>
      postRequest("removePeriod", { session, period }, SYNC_URL),
    setCurrentPeriod: (session: string, period: string) =>
      postRequest("setCurrentPeriod", { session, period }, SYNC_URL),

    addCookingDate: (session: string, date: string) =>
      postRequest("addCookingDate", { session, date }, SYNC_URL),
    removeCookingDate: (session: string, date: string) =>
      postRequest("removeCookingDate", { session, date }, SYNC_URL),

    uploadPreference: (
      session: string,
      user: string,
      period: string,
      canSolo: boolean,
      canLead: boolean,
      canAssist: boolean,
      maxCookingDays: number
    ) =>
      postRequest(
        "uploadPreference",
        {
          session,
          user,
          period,
          canSolo,
          canLead,
          canAssist,
          maxCookingDays,
        },
        SYNC_URL
      ),

    addAvailability: (session: string, user: string, date: string) =>
      postRequest("addAvailability", { session, user, date }, SYNC_URL),
    removeAvailability: (session: string, user: string, date: string) =>
      postRequest("removeAvailability", { session, user, date }, SYNC_URL),

    assignLead: (session: string, user: string, date: string) =>
      postRequest("assignLead", { session, user, date }, SYNC_URL),
    assignAssistant: (session: string, user: string, date: string) =>
      postRequest("assignAssistant", { session, user, date }, SYNC_URL),
    removeAssignment: (session: string, date: string) =>
      postRequest("removeAssignment", { session, date }, SYNC_URL),

    generateAssignments: (session: string) =>
      postRequest("generateAssignments", { session }, SYNC_URL),
    generateAssignmentsWithLLM: (session: string) =>
      postRequest("generateAssignmentsWithLLM", { session }, SYNC_URL),
    clearAssignments: (session: string, period: string) =>
      postRequest("clearAssignments", { session, period }, SYNC_URL),

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
