<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useUserStore } from "@/stores/userAuthentication";

const { logout, isAdminOrFoodStud, isAdmin, currentKerb } = useUserStore();
const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
</script>

<template>
  <nav class="navbar">
    <div class="navbar-left">
      <RouterLink :to="{ name: 'Home' }" class="brand">
        <h2>CookScheduler</h2>
      </RouterLink>
      <div class="greeting">Hi, {{ currentKerb }}</div>
    </div>

    <div class="navbar-right">
      <ul class="navbar-links">
        <li v-if="!isAdmin">
          <RouterLink
            :to="{ name: 'Availability' }"
            :class="{ active: currentRouteName === 'Availability' }"
          >
            Availability
          </RouterLink>
        </li>
        <li v-if="isAdminOrFoodStud">
          <RouterLink
            :to="{ name: 'Controls' }"
            :class="{ active: currentRouteName === 'Controls' }"
          >
            Controls
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'Home' }" @click="logout">Logout</RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #d7f2c6;
  padding: 0.75em 2em;
  gap: 1em;
}

.navbar-left {
  display: flex;
  align-items: center; /* vertically aligns brand and greeting */
  gap: 1em; /* space between brand and greeting */
}

.brand h2 {
  color: #39673a;
  margin: 0;
}

.greeting {
  font-size: 0.85rem; /* smaller text */
  font-weight: bold;
  color: #39673a;
  white-space: nowrap;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.navbar-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5em;
  margin: 0;
  padding: 0;
  list-style: none;
}

.navbar-links li a {
  text-decoration: none;
  color: #39673a;
  font-weight: 500;
  padding: 0.25em 0.5em;
  transition: background-color 0.2s, color 0.2s;
  border-radius: 4px;
}

.navbar-links li a:hover {
  background-color: #c1e3b3;
}

.navbar-links li a.active {
  background-color: #39673a;
  color: white;
}

@media (max-width: 600px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .navbar-links {
    width: 100%;
    justify-content: flex-start;
    gap: 0.75em;
  }
}
</style>
