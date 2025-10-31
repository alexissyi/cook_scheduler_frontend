<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import AvailabilityCalendar from "@/components/AvailabilityCalendar.vue";
import { storeToRefs } from "pinia";
import { useSchedulerStore } from "@/stores/cookingSchedule";
import { useUserStore } from "@/stores/userAuthentication";

const userStore = useUserStore();
const { isAdmin } = storeToRefs(userStore);

const schedulerStore = useSchedulerStore();
const { currentPeriod } = storeToRefs(schedulerStore);
const { addAvailability, removeAvailability } = schedulerStore;
</script>

<template>
  <div>
    <NavBar />
    <div v-if="!isAdmin" class="availability-wrapper">
      <h3>Enter Availability</h3>
      <AvailabilityCalendar />
    </div>
    <div v-else>Availability is not available to admin.</div>
  </div>
</template>

<style scoped>
h3 {
  font-weight: bold;
}
.availability-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  gap: 8px;
}
</style>
