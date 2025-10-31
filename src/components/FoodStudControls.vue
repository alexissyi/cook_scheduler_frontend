<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useSchedulerStore } from "@/stores/cookingSchedule";
import { useUserStore } from "@/stores/userAuthentication";
import FoodStudControlCalendar from "./FoodStudControlCalendar.vue";

const userStore = useUserStore();
const { isFoodStud } = storeToRefs(userStore);
</script>

<template>
  <div>
    <div v-if="isFoodStud" class="foodstud-page">
      <h3>Scheduling Controls</h3>
      <FoodStudControlCalendar />
    </div>
    <div v-else>You don't have authority to access this page. Go away >:(</div>
  </div>
</template>

<style scoped>
h3 {
  font-weight: bold;
}
.foodstud-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
}
</style>
