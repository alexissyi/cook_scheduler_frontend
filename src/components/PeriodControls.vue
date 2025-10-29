<script setup lang="ts">
import { ref, computed } from "vue";
import { useSchedulerStore } from "@/stores/cookScheduler";

const {addPeriod, setCurrentPeriod, removePeriod} = useSchedulerStore();

const period = ref("");

const currentPeriod = ref("");

const periodToRemove = ref("");

const formPeriod = ()=>{
    addPeriod(period.value);
}

const formCurrentPeriod = ()=>{
    setCurrentPeriod(currentPeriod.value);
}

const formRemovePeriod = ()=>{
    removePeriod(periodToRemove.value);
}
</script>

<template>
  <div>
    <form @submit.prevent="formPeriod">
      <h3>Register a cooking period:</h3>
      <fieldset>
        <div>
            <label for="period"></label>
            <input v-model.trim="period" id="period" type="month"></input>
        </div>
        <input type="submit" value="Submit"/>
    </fieldset>
    </form>
    <form @submit.prevent="formCurrentPeriod">
      <h3>Set current period:</h3>
      <fieldset>
        <div>
            <label for="current-period"></label>
            <input v-model.trim="currentPeriod" id="current-period" type="month"></input>
        </div>
        <input type="submit" value="Submit"/>
    </fieldset>
    </form>

    <form @submit.prevent="formRemovePeriod">
      <h3>Remove a cooking period:</h3>
      <fieldset>
        <div>
            <label for="period-remove"></label>
            <input v-model.trim="periodToRemove" id="period-remove" type="month"></input>
        </div>
        <input type="submit" value="Submit"/>
    </fieldset>
    </form>
  </div>
</template>

<style scoped></style>
