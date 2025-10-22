<script setup lang="ts">
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user.ts";
import { storeToRefs } from "pinia";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
</script>

<template>
  <nav>
    <div>
      <RouterLink :to="{ name: 'Calendar' }">
        <h1>CookScheduler</h1>
      </RouterLink>
    </div>
    <ul>
      <li>
        <RouterLink :to="{ name: 'Calendar' }"> Calendar </RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'Availability' }"> Availability </RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'Preference' }"> Preference </RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'Home' }"> Logout </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped></style>
