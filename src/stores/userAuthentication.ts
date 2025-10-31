import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

const BASE_URL = "/api/UserAuthentication";

export const useUserStore = defineStore("user", () => {
  const currentUser = ref("");
  const currentKerb = ref("");

  const isLoggedIn = computed(() => currentKerb.value !== "");

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
      const response = await axios.post(`${BASE_URL}/removeUser`, {
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
      const response = await axios.post(`${BASE_URL}/updateKerb`, {
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
      const response = await axios.post(`${BASE_URL}/updatePassword`, {
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
      const response = await axios.post(`${BASE_URL}/login`, {
        kerb: kerb,
        password: password,
      });

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
      const response = await axios.post(`${BASE_URL}/logout`, {
        user: currentUser.value,
      });

      clearStore();
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const setProduceFoodStud = async (user: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/setProduceFoodStud`, {
        user: user,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const setCostcoFoodStud = async (user: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/setCostcoFoodStud`, {
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
