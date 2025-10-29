<script setup lang="ts">
import { ref, computed } from "vue";
import {storeToRefs} from "pinia";
import { useSchedulerStore } from "@/stores/cookScheduler";

const schedulerStore = useSchedulerStore();
const { addCook, removeCook} = schedulerStore;
const {periods, cooks} = storeToRefs(schedulerStore);

const viewPeriod = ref("");

const displayCooks = computed(()=>viewPeriod.value!=="")

const cooksToDisplay = computed(()=>cooks.value.get(viewPeriod.value))

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
    <div>
      <h3>Cooks for {{ viewPeriod || "[Select a period]" }}:</h3>
      <div v-if="displayCooks">
        <div v-for="cook of cooksToDisplay">{{ cook }}</div>
      </div>
      <h4>Select a period:</h4>
      <label for="view-period">Period</label>
      <input v-model.trim="viewPeriod" id="view-period" type="month"></input>
    </div>
    <form @submit.prevent="formAddCook">
      <fieldset>
        <h3>Add a cook: </h3>
        <div>
          <label  for="cook-to-add">Kerb</label>
          <input v-model.trim="cookToAdd" id="cook-to-add" type="text"></input>
        </div>
        <div>
          <label  for="period-to-add">Period</label>
          <input v-model.trim="periodToAdd" id="period-to-add" type="month"></input>
        </div>
        <input type="submit" value="Add Cook"/>
      </fieldset>
    </form>
    <form @submit.prevent="formRemoveCook">
      <fieldset>
        <h3>Remove a cook: </h3>
        <div>
          <label  for="cook-to-remove">Kerb</label>
          <input v-model.trim="cookToRemove" id="cook-to-remove" type="text"></input>
        </div>
        <div>
          <label  for="period-to-remove">Period</label>
          <input v-model.trim="periodToRemove" id="period-to-remove" type="month"></input>
        </div>
        <input type="submit" value="Remove Cook"/>
      </fieldset>
    </form>
  </div>
</template>

<style scoped></style>
