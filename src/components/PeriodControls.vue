<script setup lang="ts">
import { ref, computed } from "vue";
import {storeToRefs} from "pinia";
import { useSchedulerStore } from "@/stores/cookScheduler";

const schedulerStore = useSchedulerStore();
const {addPeriod, setCurrentPeriod, removePeriod} = schedulerStore;

const {currentPeriod, periods} = storeToRefs(schedulerStore);

const items = periods;

const period = ref("");

const periodToMakeCurrent = ref("");

const periodToRemove = ref("");

const formPeriod = ()=>{
    addPeriod(period.value);
}

const formCurrentPeriod = ()=>{
    setCurrentPeriod(periodToMakeCurrent.value);
}

const formRemovePeriod = ()=>{
    if (periodToRemove.value !== currentPeriod.value){
    removePeriod(periodToRemove.value);
    } else {
      throw new Error("Can't remove current period");
    }
}
</script>

<template>
  <div>
    <div>
      <h3> All Registered Periods: </h3>
      <div>
        <div v-for="item of items">{{ item }}</div>
      </div>
    </div>
    <div>
      <h3> Current Period: {{ currentPeriod }}</h3>
    </div>
    <form @submit.prevent="formPeriod">
      <fieldset>
        <h3>Register a cooking period:</h3>
        <div>
            <label for="period"></label>
            <input v-model.trim="period" id="period" type="month"></input>
        </div>
        <input type="submit" value="Register Period"/>
    </fieldset>
    </form>

    <form @submit.prevent="formCurrentPeriod">
      <fieldset>
        <h3>Set current period:</h3>
        <div>
            <label for="current-period"></label>
            <input v-model.trim="periodToMakeCurrent" id="current-period" type="month"></input>
        </div>
        <input type="submit" value="Set Current Period"/>
    </fieldset>
    </form>

    <form @submit.prevent="formRemovePeriod">
      <fieldset>
        <h3>Remove a cooking period:</h3>
        <div>
            <label for="period-remove"></label>
            <input v-model.trim="periodToRemove" id="period-remove" type="month"></input>
        </div>
        <input type="submit" value="Remove Period"/>
    </fieldset>
    </form>
  </div>
</template>

<style scoped></style>
