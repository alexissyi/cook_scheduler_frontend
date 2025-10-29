<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import NavBar from "@/components/NavBar.vue";
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegistrationForm.vue";
import { useUserStore } from "@/stores/userAuthentication";

const { isLoggedIn, currentKerb } = storeToRefs(useUserStore());
</script>

<template>
  <div v-if="isLoggedIn">
    <header>
      <NavBar />
    </header>

    <h1>Calendar</h1>
  </div>
  <div v-else>
    <h1>CookScheduler</h1>

    <LoginForm />
    <RegisterForm />
  </div>
</template>

<style scoped></style>
