<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/userAuthentication";

const { login } = useUserStore();

const kerb = ref("");
const password = ref("");
const wrongLogin = ref(false);

const formLogin = () => {
  try {
    login(kerb.value, password.value);
    wrongLogin.value = false;
  } catch (error) {
    wrongLogin.value = true;
  }
};
</script>

<template>
  <div class="login-wrapper">
    <form @submit.prevent="formLogin" class="login-card">
      <h2>Login</h2>
      <div class="input-group">
        <label for="kerb">Kerb</label>
        <input v-model.trim="kerb" id="kerb" placeholder="Enter your kerb" type="text" required />
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <input
          v-model.trim="password"
          id="password"
          placeholder="Enter your password"
          type="password"
          required
        />
      </div>
      <div v-if="wrongLogin" class="error-message">❌ Wrong username or password</div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background: #e0f0df; /* soft light green background */
  padding: 16px;
}

.login-card {
  background: #39673a; /* darker green for the card */
  padding: 32px 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-card h2 {
  text-align: center;
  color: #ffffff;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label {
  font-weight: 500;
  color: #d1f0c0; /* light green label */
}

.input-group input {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #2c5e2c;
  font-size: 14px;
  background: #e0f0df;
  color: #2c5e2c;
  transition: border-color 0.2s;
}

.input-group input:focus {
  outline: none;
  border-color: #2c5e2c;
}

.error-message {
  color: #ffb3b3;
  font-size: 14px;
  text-align: center;
}

button[type="submit"] {
  background: #2c5e2c;
  color: #ffffff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

button[type="submit"]:hover {
  background: #1f4b1f;
}
</style>
