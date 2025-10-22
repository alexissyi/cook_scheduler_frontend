import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const users = ref(new Map<string, { kerb: string; password: string; loggedIn: boolean }>());

  const currentKerb = ref("");

  const isLoggedIn = computed(() => {
    const user = users.value.get(currentKerb.value);
    if (currentKerb.value !== "" && user !== undefined) {
      return user.loggedIn;
    } else {
      return false;
    }
  });

  function uploadUser(kerb: string, password: string) {
    const userMap = users.value;
    if (!userMap.has(kerb)) {
      userMap.set(kerb, { kerb: kerb, password: password, loggedIn: false });
    }
  }

  function login(kerb: string, password: string) {
    const userMap = users.value;
    if (userMap.has(kerb)) {
      const user = userMap.get(kerb);
      if (user !== undefined && user.password === password) {
        userMap.set(kerb, { kerb: kerb, password: password, loggedIn: true });
        currentKerb.value = kerb;
      }
    }

    function logout() {
      const userMap = users.value;
      const kerb = currentKerb.value;
      if (userMap.has(kerb)) {
        const user = userMap.get(kerb);
        userMap.set(kerb, { kerb: kerb, password: password, loggedIn: false });
        currentKerb.value = "";
      }
    }

    return {
      users,
      currentKerb,
      isLoggedIn,
      uploadUser,
      login,
      logout,
    };
  }
});
