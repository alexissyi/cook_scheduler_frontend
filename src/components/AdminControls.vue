<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/userAuthentication";

const userStore = useUserStore();
const { setProduce, setCostco, removeUser } = userStore;
const { produceFoodStudKerb, costcoFoodStudKerb, passwords } = storeToRefs(userStore);

const allUsers = computed(() => Array.from(passwords.value.keys()));

// Inputs
const produceKerb = ref(produceFoodStudKerb.value || "");
const costcoKerb = ref(costcoFoodStudKerb.value || "");
const userToRemove = ref("");

// Filtered suggestions
const produceSuggestions = computed(() =>
  allUsers.value.filter((u) => u.toLowerCase().includes(produceKerb.value.toLowerCase()))
);
const costcoSuggestions = computed(() =>
  allUsers.value.filter((u) => u.toLowerCase().includes(costcoKerb.value.toLowerCase()))
);
const removeSuggestions = computed(() =>
  allUsers.value.filter((u) => u.toLowerCase().includes(userToRemove.value.toLowerCase()))
);

// Handlers
const handleSetProduce = () => {
  if (allUsers.value.includes(produceKerb.value)) setProduce(produceKerb.value);
};

const handleSetCostco = () => {
  if (allUsers.value.includes(costcoKerb.value)) setCostco(costcoKerb.value);
};

const handleRemoveUser = () => {
  if (allUsers.value.includes(userToRemove.value)) removeUser(userToRemove.value);
};

watch(produceKerb, (val) => (produceKerb.value = val ? val : ""));
watch(costcoKerb, (val) => (costcoKerb.value = val ? val : ""));
watch(userToRemove, (val) => (userToRemove.value = val ? val : ""));
</script>

<template>
  <div class="admin-controls-wrapper">
    <h3>Admin Controls</h3>

    <!-- Produce FoodStud -->
    <div class="admin-section">
      <h4>Set Produce FoodStud</h4>
      <input v-model="produceKerb" list="produce-list" placeholder="Type or select user" />
      <datalist id="produce-list">
        <option v-for="user in produceSuggestions" :key="user" :value="user" />
      </datalist>
      <button @click="handleSetProduce" :disabled="!allUsers.includes(produceKerb)">Set</button>
    </div>

    <!-- Costco FoodStud -->
    <div class="admin-section">
      <h4>Set Costco FoodStud</h4>
      <input v-model="costcoKerb" list="costco-list" placeholder="Type or select user" />
      <datalist id="costco-list">
        <option v-for="user in costcoSuggestions" :key="user" :value="user" />
      </datalist>
      <button @click="handleSetCostco" :disabled="!allUsers.includes(costcoKerb)">Set</button>
    </div>

    <!-- Remove User -->
    <div class="admin-section">
      <h4>Remove User</h4>
      <input v-model="userToRemove" list="remove-list" placeholder="Type or select user" />
      <datalist id="remove-list">
        <option v-for="user in removeSuggestions" :key="user" :value="user" />
      </datalist>
      <button @click="handleRemoveUser" :disabled="!allUsers.includes(userToRemove)">Remove</button>
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
