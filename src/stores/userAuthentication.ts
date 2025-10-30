import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const passwordMap: Map<string, string> = new Map();
  const adminKerb = "admin";
  const adminPassword = "adminPass";
  const passwords = ref(passwordMap);
  const currentKerb = ref("");
  const costcoFoodStudKerb = ref("");
  const produceFoodStudKerb = ref("");
  const allUsers = computed(() => Array.from(passwords.value.keys()));

  const isLoggedIn = computed(() => currentKerb.value !== "");

  const isAdmin = computed(() => currentKerb.value === adminKerb);

  const isFoodStud = computed(
    () =>
      currentKerb.value === costcoFoodStudKerb.value ||
      currentKerb.value === produceFoodStudKerb.value
  );

  const isAdminOrFoodStud = computed(() => isAdmin.value || isFoodStud.value);

  const setProduce = (kerb: string) => {
    if (!passwordMap.has(kerb)) {
      throw new Error("Not a valid kerb");
    } else if (kerb === adminKerb) {
      throw new Error("admin can't be foodstud");
    } else {
      produceFoodStudKerb.value = kerb;
    }
  };

  const setCostco = (kerb: string) => {
    if (!passwordMap.has(kerb)) {
      throw new Error("Not a valid kerb");
    } else if (kerb === adminKerb) {
      throw new Error("admin can't be foodstud");
    } else {
      costcoFoodStudKerb.value = kerb;
    }
  };

  const uploadUser = (kerb: string, password: string) => {
    if (passwords.value.has(kerb)) {
      throw new Error("User already exists");
    } else if (password === "") {
      throw new Error("Password is empty");
    } else if (kerb === "") {
      throw new Error("Kerb is empty");
    } else {
      passwords.value.set(kerb, password);
    }
  };

  const login = (kerb: string, password: string) => {
    if (kerb === adminKerb && password === adminPassword) {
      currentKerb.value = kerb;
    } else if (passwords.value.get(kerb) === password) {
      currentKerb.value = kerb;
    } else {
      throw new Error("Wrong password");
    }
  };

  const logout = () => {
    currentKerb.value = "";
  };

  const updatePassword = (newPassword: string) => {
    if (passwords.value.get(currentKerb.value) === newPassword) {
      throw new Error("New password same as old password");
    } else if (newPassword === "") {
      throw new Error("New password is empty");
    } else if (currentKerb.value !== adminKerb) {
      passwords.value.set(currentKerb.value, newPassword);
    }
  };

  const removeUser = (kerb: string) => {
    if (currentKerb.value !== adminKerb) {
      passwords.value.delete(kerb);
    }
  };

  return {
    passwords,
    currentKerb,
    isLoggedIn,
    isAdmin,
    isFoodStud,
    isAdminOrFoodStud,
    produceFoodStudKerb,
    costcoFoodStudKerb,
    allUsers,
    setCostco,
    setProduce,
    uploadUser,
    login,
    logout,
    updatePassword,
    removeUser,
  };
});
