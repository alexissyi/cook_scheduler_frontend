<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/userAuthentication";

const userStore = useUserStore();

const {
  setProduceFoodStud,
  setCostcoFoodStud,
  removeUser,
  _getUsers,
  _getProduceFoodStudKerb,
  _getCostcoFoodStudKerb,
} = userStore;

const allUsers = ref<Array<{ user: string; kerb: string }>>([]);
const produceKerb = ref("");
const costcoKerb = ref("");
const userToRemove = ref("");

const fetchInitialData = async () => {
  try {
    const usersRes = await _getUsers();
    if (Array.isArray(usersRes)) {
      allUsers.value = usersRes.map((u) => ({ user: u.user, kerb: u.kerb }));
    }

    const produceRes = await _getProduceFoodStudKerb();
    if (Array.isArray(produceRes)) {
      produceKerb.value = produceRes[0]?.produceFoodStudKerb || "";
    }

    const costcoRes = await _getCostcoFoodStudKerb();
    if (Array.isArray(costcoRes)) {
      costcoKerb.value = costcoRes[0]?.costcoFoodStudKerb || "";
    }
  } catch (err) {
    console.error("Error loading initial data:", err);
  }
};

// load initial data when component mounts
onMounted(fetchInitialData);

// filtered suggestions based on current input
const produceSuggestions = computed(() =>
  allUsers.value.filter((u) => u.kerb.toLowerCase().includes(produceKerb.value.toLowerCase()))
);

const costcoSuggestions = computed(() =>
  allUsers.value.filter((u) => u.kerb.toLowerCase().includes(costcoKerb.value.toLowerCase()))
);

const removeSuggestions = computed(() =>
  allUsers.value.filter((u) => u.kerb.toLowerCase().includes(userToRemove.value.toLowerCase()))
);

const handleSetProduce = async () => {
  const userObj = allUsers.value.find((u) => u.kerb === produceKerb.value);
  if (userObj) {
    await setProduceFoodStud(userObj.user);
    await fetchInitialData();
  }
};

const handleSetCostco = async () => {
  const userObj = allUsers.value.find((u) => u.kerb === costcoKerb.value);
  if (userObj) {
    await setCostcoFoodStud(userObj.user);
    await fetchInitialData();
  }
};

const handleRemoveUser = async () => {
  const userObj = allUsers.value.find((u) => u.kerb === userToRemove.value);
  if (userObj) {
    await removeUser(userObj.user);
    await fetchInitialData();
  }
};
</script>

<template>
  <div class="admin-controls-wrapper">
    <h3>Admin Controls</h3>

    <!-- Produce FoodStud -->
    <div class="admin-section">
      <h4>Set Produce FoodStud</h4>
      <input v-model="produceKerb" list="produce-list" placeholder="Type or select user" />
      <datalist id="produce-list">
        <option v-for="u in produceSuggestions" :key="u.user" :value="u.kerb" />
      </datalist>
      <button @click="handleSetProduce" :disabled="!allUsers.some((u) => u.kerb === produceKerb)">
        Set
      </button>
    </div>

    <!-- Costco FoodStud -->
    <div class="admin-section">
      <h4>Set Costco FoodStud</h4>
      <input v-model="costcoKerb" list="costco-list" placeholder="Type or select user" />
      <datalist id="costco-list">
        <option v-for="u in costcoSuggestions" :key="u.user" :value="u.kerb" />
      </datalist>
      <button @click="handleSetCostco" :disabled="!allUsers.some((u) => u.kerb === costcoKerb)">
        Set
      </button>
    </div>

    <!-- Remove User -->
    <div class="admin-section">
      <h4>Remove User</h4>
      <input v-model="userToRemove" list="remove-list" placeholder="Type or select user" />
      <datalist id="remove-list">
        <option v-for="u in removeSuggestions" :key="u.user" :value="u.kerb" />
      </datalist>
      <button @click="handleRemoveUser" :disabled="!allUsers.some((u) => u.kerb === userToRemove)">
        Remove
      </button>
    </div>
  </div>
</template>

<style scoped>
h3 {
  font-weight: bold;
}

.admin-controls-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  gap: 16px;
}

.admin-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

input[list] {
  padding: 6px 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
}

button {
  background: #39673a;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

button:hover {
  background: #2e5831;
  transform: scale(1.03);
}

button:disabled {
  background: #ccc;
  color: #666;
  cursor: not-allowed;
  transform: none;
}
</style>
