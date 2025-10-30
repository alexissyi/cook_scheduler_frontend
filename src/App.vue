<script setup lang="ts">
import { storeToRefs } from "pinia";
import NavBar from "@/components/NavBar.vue";
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegistrationForm.vue";
import { useUserStore } from "@/stores/userAuthentication";
import MainCalendar from "./components/MainCalendar.vue";

const { isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <div v-if="isLoggedIn">
    <NavBar />

    <MainCalendar />
  </div>

  <div v-else class="auth-wrapper">
    <h1 class="page-title">CookScheduler</h1>
    <div class="forms-container">
      <LoginForm />
      <RegisterForm />
    </div>
  </div>
</template>

<style scoped>
.auth-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  gap: 16px;
  background: #e0f0df; /* consistent light background */
  min-height: 100vh;
}

.page-title {
  color: #39673a;
  text-align: center;
}

.forms-container {
  display: flex;
  flex-direction: row;
  gap: 24px;
  flex-wrap: wrap; /* allows stacking on small screens */
  justify-content: center;
  width: 100%;
}

.forms-container > * {
  flex: 1 1 300px; /* minimum width for each form, grows to fill space */
  max-width: 360px; /* matches the card width of forms */
}
</style>
