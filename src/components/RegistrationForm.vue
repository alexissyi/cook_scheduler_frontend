<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/userAuthentication";

const userStore = useUserStore();

const kerb = ref("");
const password = ref("");
const confirmPassword = ref("");

const passwordNotConfirmed = computed(() => password.value !== confirmPassword.value);
const message = ref<string | null>(null);
const loading = ref(false);

const formRegister = async () => {
  message.value = null;

  if (passwordNotConfirmed.value) {
    message.value = "❌ Passwords do not match.";
    return;
  }

  if (!kerb.value || !password.value) {
    message.value = "⚠️ Please fill out all fields.";
    return;
  }

  loading.value = true;

  try {
    const res = await userStore.uploadUser(kerb.value, password.value);

    if (res && res.user) {
      message.value = "✅ Registration successful! Logging you in...";
      await userStore.login(kerb.value, password.value);
    } else {
      message.value = res?.message || "❌ Registration failed.";
    }
  } catch (err) {
    console.error("Registration error:", err);
    message.value = "❌ Server error during registration. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="register-wrapper">
    <form @submit.prevent="formRegister" class="register-card">
      <h2>Register</h2>

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
        <label for="register-password">Password</label>
        <input
          v-model.trim="password"
          id="register-password"
          placeholder="Enter password"
          type="password"
          required
          :disabled="loading"
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
          :disabled="loading"
        />
      </div>

      <div v-if="message" class="feedback">{{ message }}</div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Registering..." : "Register" }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background: #e0f0df;
  padding: 16px;
}

.register-card {
  background: #39673a;
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
  color: #d1f0c0;
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
  transition: background 0.2s;
}

button[type="submit"]:hover {
  background: #1f4b1f;
}

button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
