<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/userAuthentication";

const { uploadUser } = useUserStore();

const kerb = ref("");
const password = ref("");
const confirmPassword = ref("");

const passwordNotConfirmed = computed(() => {
  return password.value !== confirmPassword.value;
});

const formRegister = () => {
  console.log("in register function");
  if (!passwordNotConfirmed.value) {
    uploadUser(kerb.value, password.value);
  }
};
</script>

<template>
  <form @submit.prevent="formRegister">
    <h3>Register</h3>
    <fieldset>
      <div>
        <label for="kerb">Kerb</label>
        <input v-model.trim="kerb" id="kerb" placeholder="kerb" type="text" required />
      </div>
      <div>
        <label for="register-password">Password</label>
        <input
          v-model.trim="password"
          id="register-password"
          placeholder="password"
          type="password"
          required
        />
      </div>
      <div>
        <label for="confirm-password">Confirm Password</label>
        <input
          v-model.trim="confirmPassword"
          id="confirm-password"
          placeholder="password"
          type="password"
          required
        />
      </div>
      <div v-if="passwordNotConfirmed">Passwords don't match</div>
      <input type="submit" value="Submit" />
    </fieldset>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}

fieldset {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
