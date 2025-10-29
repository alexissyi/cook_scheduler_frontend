<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/userAuthentication";
import { storeToRefs } from "pinia";

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
  <form @submit.prevent="formLogin">
    <h3>Login</h3>
    <fieldset>
      <div>
        <label for="kerb">Kerb</label>
        <input v-model.trim="kerb" id="kerb" placeholder="kerb" type="text" required />
      </div>
      <div>
        <label for="password">Password</label>
        <input
          v-model.trim="password"
          type="password"
          id="password"
          placeholder="password"
          required
        />
      </div>
      <div v-if="wrongLogin">Wrong Password</div>
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
