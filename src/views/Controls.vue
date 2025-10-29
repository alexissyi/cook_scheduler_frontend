<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import AdminControls from "@/components/AdminControls.vue";
import FoodStudControls from "@/components/FoodStudControls.vue";
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/userAuthentication";

const { isAdmin, isFoodStud, isAdminOrFoodStud } = useUserStore();
</script>

<template>
  <div>
    <NavBar />
    <div v-if="isAdminOrFoodStud">
      <AdminControls v-if="isAdmin" />
      <FoodStudControls v-if="isFoodStud" />
    </div>
    <div v-else>You don't have permissions, go away >:(</div>
  </div>
</template>

<style scoped></style>
