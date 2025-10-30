<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/userAuthentication";

const { uploadUser, login } = useUserStore();

const kerb = ref("");
const password = ref("");
const confirmPassword = ref("");

const passwordNotConfirmed = computed(() => password.value !== confirmPassword.value);

const formRegister = () => {
  if (!passwordNotConfirmed.value) {
    uploadUser(kerb.value, password.value);
    login(kerb.value, password.value);
  }
};
</script>

<template>
  <div class="register-wrapper">
    <form @submit.prevent="formRegister" class="register-card">
      <h2>Register</h2>
      <div class="input-group">
        <label for="kerb">Kerb</label>
        <input v-model.trim="kerb" id="kerb" placeholder="Enter your kerb" type="text" required />
      </div>
      <div class="input-group">
        <label for="register-password">Password</label>
        <input
          v-model.trim="password"
          id="register-password"
          placeholder="Enter password"
          type="password"
          required
        />
      </div>
      <div class="input-group">
        <label for="confirm-password">Confirm Password</label>
        <input
          v-model.trim="confirmPassword"
          id="confirm-password"
          placeholder="Confirm password"
          type="password"
          required
        />
      </div>
      <div v-if="passwordNotConfirmed" class="error-message">❌ Passwords don't match</div>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<style scoped>
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background: #e0f0df; /* matches login background */
  padding: 16px;
}

.register-card {
  background: #39673a; /* same dark green as login card */
  padding: 32px 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.register-card h2 {
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
  color: #d1f0c0; /* matches login labels */
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
