<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/userAuthentication";

const { produceFoodStudKerb, costcoFoodStudKerb, setProduce, setCostco } = useUserStore();

const produceKerb = ref("");
const costcoKerb = ref("");

const formProduce = ()=>{
    setProduce(produceKerb.value);
}

const formCostco = ()=>{
    setCostco(costcoKerb.value);
}
</script>

<template>
    <div>
    <div>Produce FoodStud is: {{produceFoodStudKerb }}</div>
    <form @submit.prevent="formProduce">
        <h3>Set new Produce FoodStud</h3>
        <fieldset>
            <div>
                <label for="produce">Kerb</label>
                <input id="produce" v-model.trim="produceKerb"></input>
            </div>
            <input type="submit" value="Set Produce FoodStud" />
        </fieldset>
    </form>
    <div>Costco FoodStud is: {{costcoFoodStudKerb }}</div>
    <form @submit.prevent="formCostco">
        <h3>Set new Costco FoodStud</h3>
        <fieldset>
            <div>
                <label for="costco">Kerb</label>
                <input id="costco" v-model.trim="costcoKerb"></input>
            </div>
            <input type="submit" value="Set Costco FoodStud" />
        </fieldset>
    </form>
    </div>
</template>

<style scoped></style>
