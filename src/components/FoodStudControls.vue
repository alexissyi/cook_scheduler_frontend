<script setup lang="ts">
import { ref, computed } from "vue";
import { useSchedulerStore } from "@/stores/cookScheduler";
import PeriodControls from "@/components/PeriodControls.vue";
import CookControls from "@/components/CookControls.vue";
import DateControls from "@/components/DateControls.vue";
</script>

<template>
  <div>
    <PeriodControls />
    <CookControls />
    <DateControls />
    <div>Open form</div>
  </div>
</template>

<style scoped></style>
