<script setup lang="ts">
import { ref } from "vue";
import { useSchedulerStore } from "@/stores/cookScheduler";
import FoodStudControlCalendar from "./FoodStudControlCalendar.vue";
</script>

<template>
  <div>
    <h3>Select cooking dates:</h3>
    <FoodStudControlCalendar />
  </div>
</template>
