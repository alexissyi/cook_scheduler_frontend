<script setup lang="ts">
import { ref, computed } from "vue";
import { useSchedulerStore } from "@/stores/cookScheduler";

const periodToOpen = ref("");
const periodToClose = ref("");
</script>

<template>
  <div>
      <form>
        <fieldset>
          <h3>Open availability and preference forms:</h3>
          <div>
            <label for="periodToOpen">Period</label>
            <input v-model="periodToOpen" id="periodToOpen" type="month"></input>
          </div>
          <input type="submit" value="Open"></input>
        </fieldset>
      </form>
      <form>
        <fieldset>
          <h3>Close availability and preference forms:</h3>
          <div>
            <label for="periodToClose">Period</label>
            <input v-model="periodToClose" id="periodToClose" type="month"></input>
          </div>
          <input type="submit" value="Close"></input>
        </fieldset>
      </form>
    </div>
</template>

<style scoped></style>
