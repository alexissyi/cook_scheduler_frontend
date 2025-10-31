<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/userAuthentication";

const userStore = useUserStore();

const kerb = ref("");
const password = ref("");
const message = ref<string | null>(null);
const loading = ref(false);

const formLogin = async () => {
  message.value = null;

  if (!kerb.value || !password.value) {
    message.value = "⚠️ Please enter both kerb and password.";
    return;
  }

  loading.value = true;

  try {
    const res = await userStore.login(kerb.value, password.value);

    // If backend sends a recognizable success property or user data:
    if (res?.user) {
      message.value = "✅ Login successful!";
    } else {
      message.value = res?.message || "❌ Incorrect kerb or password.";
    }
  } catch (err) {
    console.error("Login error:", err);
    message.value = "❌ Server error during login. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-wrapper">
    <form @submit.prevent="formLogin" class="login-card">
      <h2>Login</h2>

      <div class="input-group">
        <label for="kerb">Kerb</label>
        <input
          v-model.trim="kerb"
          id="kerb"
          placeholder="Enter your kerb"
          type="text"
          required
          :disabled="loading"
        />
      </div>

      <div class="input-group">
        <label for="password">Password</label>
        <input
          v-model.trim="password"
          id="password"
          placeholder="Enter your password"
          type="password"
          required
          :disabled="loading"
        />
      </div>

      <div v-if="message" class="feedback">{{ message }}</div>

      <button type="submit" :disabled="loading">
        <span v-if="!loading">Login</span>
        <span v-else>Logging in...</span>
      </button>
    </form>
  </div>
</template>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background: #e0f0df;
  padding: 16px;
}

.login-card {
  background: #39673a;
  padding: 32px 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-card h2 {
  text-align: center;
  color: #ffffff;
  font-weight: 600;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label {
  font-weight: 500;
  color: #d1f0c0;
}

.input-group input {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #2c5e2c;
  font-size: 14px;
  background: #e0f0df;
  color: #2c5e2c;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-group input:focus {
  outline: none;
  border-color: #39673a;
  box-shadow: 0 0 0 2px rgba(57, 103, 58, 0.2);
}

.feedback {
  color: #ffb3b3;
  font-size: 14px;
  text-align: center;
  min-height: 18px;
}

button[type="submit"] {
  background: #2c5e2c;
  color: #ffffff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

button[type="submit"]:hover {
  background: #1f4b1f;
}

button[type="submit"]:active {
  transform: scale(0.98);
}

button[type="submit"]:disabled {
  background: #7ea87e;
  cursor: not-allowed;
}
</style>
