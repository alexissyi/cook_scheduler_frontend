<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
import NavBar from "@/components/NavBar.vue";
</script>

<template>
  <header>
    <div>
      <RouterLink :to="{ name: 'Calendar' }">
        <h1>CookScheduler</h1>
      </RouterLink>
    </div>
  </header>
</template>

<style scoped></style>
