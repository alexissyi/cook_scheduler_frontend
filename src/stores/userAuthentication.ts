import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

const BASE_URL = "/api/UserAuthentication";
const SYNC_URL = "/api";

export const useUserStore = defineStore("user", () => {
  const currentUser = ref("");
  const currentKerb = ref("");
  const currentSession = ref("");

  const isLoggedIn = computed(() => currentKerb.value !== "" && currentSession.value !== "");

  const isAdmin = ref(false);

  const isProduceFoodStud = ref(false);

  const isCostcoFoodStud = ref(false);

  const isFoodStud = computed(() => isProduceFoodStud.value || isCostcoFoodStud.value);

  const isAdminOrFoodStud = computed(() => isAdmin.value || isFoodStud.value);

  const clearStore = () => {
    currentUser.value = "";
    currentKerb.value = "";
    isAdmin.value = false;
    isProduceFoodStud.value = false;
    isCostcoFoodStud.value = false;
  };

  const uploadUser = async (kerb: string, password: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/uploadUser`, {
        kerb: kerb,
        password: password,
      });
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const removeUser = async (user: string) => {
    try {
      const response = await axios.post(`${SYNC_URL}/removeUser`, {
        session: currentSession.value,
        user: user,
      });
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateKerb = async (user: string, newKerb: string) => {
    try {
      const response = await axios.post(`${SYNC_URL}/updateKerb`, {
        session: currentSession.value,
        user: user,
        newKerb: newKerb,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updatePassword = async (user: string, newPassword: string) => {
    try {
      const response = await axios.post(`${SYNC_URL}/updatePassword`, {
        session: currentSession.value,
        user: user,
        newKerb: newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const login = async (kerb: string, password: string) => {
    try {
      const response = await axios.post(`${SYNC_URL}/login`, {
        kerb: kerb,
        password: password,
      });
      console.log(`Retrieved user data for: ${response.data.user}`);
      currentSession.value = response.data.session;
      currentKerb.value = kerb;
      currentUser.value = response.data.user;
      isAdmin.value = response.data.isAdmin;
      isProduceFoodStud.value = response.data.isProduceFoodStud;
      isCostcoFoodStud.value = response.data.isCostcoFoodStud;
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const logout = async () => {
    try {
      const response = await axios.post(`${SYNC_URL}/logout`, {
        session: currentSession.value,
      });

      clearStore();
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const setProduceFoodStud = async (user: string) => {
    try {
      const response = await axios.post(`${SYNC_URL}/setProduceFoodStud`, {
        session: currentSession.value,
        user: user,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const setCostcoFoodStud = async (user: string) => {
    try {
      const response = await axios.post(`${SYNC_URL}/setCostcoFoodStud`, {
        session: currentSession.value,
        user: user,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const _getUsers = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/_getUsers`, {});
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const _getProduceFoodStudKerb = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/_getProduceFoodStudKerb`, {});
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const _getCostcoFoodStudKerb = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/_getCostcoFoodStudKerb`, {});
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return {
    currentSession,
    currentUser,
    currentKerb,
    isLoggedIn,
    isAdmin,
    isFoodStud,
    isAdminOrFoodStud,
    _getProduceFoodStudKerb,
    _getCostcoFoodStudKerb,
    setCostcoFoodStud,
    setProduceFoodStud,
    uploadUser,
    login,
    logout,
    updatePassword,
    removeUser,
    _getUsers,
  };
});
