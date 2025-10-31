import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

import { monthYearToString, stringToMonthYear } from "@/utils";

const BASE_URL = "/api/CookingSchedule";

export const useSchedulerStore = defineStore("scheduler", () => {
  // periods represented in YYYY-MM format strings
  // dates represented in YYYY-MM-DD format strings

  const currentPeriod = ref("");

  const currentYear = computed(() =>
    currentPeriod.value !== "" ? stringToMonthYear(currentPeriod.value).year : null
  );
  const currentMonth = computed(() =>
    currentPeriod.value !== "" ? stringToMonthYear(currentPeriod.value).month : null
  ); // 1-indexing of months

  const addCook = async (period: string, user: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/addCook`, {
        period: period,
        user: user,
      }); // response.data is of form {} or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const removeCook = async (period: string, user: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/removeCook`, {
        period: period,
        user: user,
      }); // response.data is of form {} or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const openPeriod = async (period: string) => {
    try {
      console.log(`Opening period: ${period}`);
      const response = await axios.post(`${BASE_URL}/openPeriod`, {
        period: period,
      }); // response.data is of form {} or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const closePeriod = async (period: string) => {
    try {
      console.log(`Closing period: ${period}`);
      const response = await axios.post(`${BASE_URL}/closePeriod`, {
        period: period,
      }); // response.data is of form {} or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addPeriod = async (period: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/addPeriod`, {
        period: period,
        current: false,
      }); // response.data is of form {} or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const removePeriod = async (period: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/removePeriod`, {
        period: period,
      }); // response.data is of form {} or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const setCurrentPeriod = async (period: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/setCurrentPeriod`, {
        period: period,
      }); // response.data is of form {} or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addCookingDate = async (date: string) => {
    try {
      console.log(`Adding cooking date ${date}`);
      const response = await axios.post(`${BASE_URL}/addCookingDate`, {
        date: date,
      }); // response.data is of form {} or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const removeCookingDate = async (date: string) => {
    try {
      console.log(`Removing cooking date ${date}`);
      const response = await axios.post(`${BASE_URL}/removeCookingDate`, {
        date: date,
      }); // response.data is of form {} or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const uploadPreference = async (
    user: string,
    period: string,
    canSolo: boolean,
    canLead: boolean,
    canAssist: boolean,
    maxCookingDays: number
  ) => {
    try {
      const response = await axios.post(`${BASE_URL}/uploadPreference`, {
        user: user,
        period: period,
        canSolo: canSolo,
        canLead: canLead,
        canAssist: canAssist,
        maxCookingDays: maxCookingDays,
      }); // response.data is of form {} or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addAvailability = async (user: string, date: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/addAvailability`, {
        user: user,
        date: date,
      }); // response.data is of form {} or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const removeAvailability = async (user: string, date: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/removeAvailability`, {
        user: user,
        date: date,
      }); // response.data is of form {} or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const assignLead = async (user: string, date: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/assignLead`, {
        user: user,
        date: date,
      }); // response.data is of form {} or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const assignAssistant = async (user: string, date: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/assignAssistant`, {
        user: user,
        date: date,
      }); // response.data is of form {} or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const removeAssignment = async (date: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/removeAssignment`, {
        date: date,
      }); // response.data is of form {} or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const generateAssignments = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/generateAssignments`, {});
      // response.data is of form {} or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const generateAssignmentsWithLLM = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/generateAssignmentsWithLLM`, {});
      // response.data is of form {} or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const _isRegisteredPeriod = async (period: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/_isRegisteredPeriod`, {
        period: period,
      }); // response.data is of form [{isRegisteredPeriod: boolean}] or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const _isRegisteredCook = async (user: string, period: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/_isRegisteredCook`, {
        period: period,
        user: user,
      }); // response.data is of form [{isRegisteredCook: boolean}] or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const _isCurrentPeriod = async (period: string) => {
    try {
      console.log(`Checking if ${period} is current`);
      const response = await axios.post(`${BASE_URL}/_isCurrentPeriod`, {
        period: period,
      }); // response.data is of form [{isCurrentPeriod: boolean}] or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const _isOpen = async (period: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/_isOpen`, {
        period: period,
      }); // response.data is of form [{isOpen: boolean}] or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const _getCooks = async (period: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/_getCooks`, {
        period: period,
      }); // response.data is of form Array<{cook: string}> or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const _getCookingDates = async (period: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/_getCookingDates`, {
        period: period,
      }); // response.data is of form Array<{cookingDate: string}> or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const _getCurrentPeriod = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/_getCurrentPeriod`, {});
      console.log("Response data:", response.data);
      return response.data; // response.data is of form [{period: string}] or {error: string}
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const _getAssignment = async (date: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/_getAssignment`, {
        date: date,
      });
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const _getAssignments = async (period: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/_getAssignments`, {
        period: period,
      });
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const _getAvailability = async (user: string, period: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/_getAvailability`, {
        user: user,
        period: period,
      }); // response.data is of form Array<{date: string}> or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const _getPreference = async (user: string, period: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/_getPreference`, {
        user: user,
        period: period,
      }); // response.data is of form Array<{canLead: boolean, canSolo: boolean, canAssist: boolean, maxCookingDays: number} > or {error: string}
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return {
    currentPeriod,
    currentYear,
    currentMonth,
    openPeriod,
    closePeriod,
    addCookingDate,
    removeCookingDate,
    addPeriod,
    removePeriod,
    setCurrentPeriod,
    addCook,
    removeCook,
    addAvailability,
    removeAvailability,
    uploadPreference,
    _isRegisteredCook,
    _isRegisteredPeriod,
    _isOpen,
    _getCooks,
    _getCookingDates,
    _getCurrentPeriod,
    _getAvailability,
    _getPreference,
    _isCurrentPeriod,
  };
});
