<script setup lang="ts">
import { ref, computed } from "vue";
import { useSchedulerStore } from "@/stores/cookScheduler";

const { addCook, removeCook } = useSchedulerStore();

const cookToAdd = ref("");

const periodToAdd = ref("");

const cookToRemove = ref("");

const periodToRemove = ref("");

const formAddCook = () => {
  addCook(periodToAdd.value, cookToAdd.value);
};

const formRemoveCook = () => {
  removeCook(periodToRemove.value, cookToRemove.value);
};
</script>

<template>
  <div>
    <form @submit.prevent="formAddCook">
      <h3>Add a cook: </h3>
      <fieldset>
        <div>
          <label  for="cook-to-add">Kerb</label>
          <input v-model.trim="cookToAdd" id="cook-to-add" type="text"></input>
        </div>
        <div>
          <label  for="period-to-add">Period</label>
          <input v-model.trim="periodToAdd" id="period-to-add" type="month"></input>
        </div>
        <input type="submit" value="Submit"/>
      </fieldset>
    </form>
    <form @submit.prevent="formRemoveCook">
      <h3>Remove a cook: </h3>
      <fieldset>
        <div>
          <label  for="cook-to-remove">Kerb</label>
          <input v-model.trim="cookToRemove" id="cook-to-remove" type="text"></input>
        </div>
        <div>
          <label  for="period-to-remove">Period</label>
          <input v-model.trim="periodToRemove" id="period-to-remove" type="month"></input>
        </div>
        <input type="submit" value="Submit"/>
      </fieldset>
    </form>
  </div>
</template>

<style scoped></style>
