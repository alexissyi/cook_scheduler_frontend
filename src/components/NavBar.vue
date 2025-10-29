<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { useUserStore } from "@/stores/userAuthentication";
import { storeToRefs } from "pinia";

const { logout, isAdminOrFoodStud } = useUserStore();

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
</script>

<template>
  <nav>
    <div id="navbar-left">
      <RouterLink :to="{ name: 'Home' }">
        <h1>CookScheduler</h1>
      </RouterLink>
    </div>
    <div id="navbar-right">
      <ul id="navbar-links">
        <li>
          <RouterLink :to="{ name: 'Availability' }"> Availability </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'Preference' }"> Preference </RouterLink>
        </li>
        <li v-if="isAdminOrFoodStud">
          <RouterLink :to="{ name: 'Controls' }"> Controls </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'Home' }" @click="logout"> Logout </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
nav {
  display: grid;
  grid-template-columns: 5fr 5fr;
  background-color: azure;
  padding: 0 2em;
}

#navbar-right {
  grid-column-start: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#navbar-left {
  grid-column-start: 1;
}

#navbar-links {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

ul {
  list-style-type: none;
}
</style>
