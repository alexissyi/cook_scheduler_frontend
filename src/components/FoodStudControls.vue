<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useSchedulerStore } from "@/stores/cookScheduler";
import FoodStudControlCalendar from "./FoodStudControlCalendar.vue";
</script>

<template>
  <div class="page">
    <h3>Scheduling Controls</h3>
    <FoodStudControlCalendar />
  </div>
</template>

<style scoped>
h3 {
  font-weight: bold;
}
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
}
</style>
