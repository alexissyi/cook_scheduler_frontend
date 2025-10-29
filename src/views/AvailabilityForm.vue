<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import { useSchedulerStore } from "@/stores/cookScheduler";

const { currentPeriod } = useSchedulerStore();
</script>

<template>
  <div>
    <NavBar />
    <h1>Availability</h1>
    <h3>The current period is {{ currentPeriod }}</h3>
  </div>
</template>

<style scoped></style>
