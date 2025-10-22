import { createRouter, createWebHistory } from "vue-router";
import App from "@/App.vue";
import Calendar from "@/views/Calendar.vue";
import PreferenceForm from "@/views/PreferenceForm.vue";
import AvailabilityForm from "@/views/AvailabilityForm.vue";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: "/",
      name: "Home",
      component: App,
    },
    { path: "/calendar", name: "Calendar", component: Calendar },
    { path: "/preference", name: "Preference", component: PreferenceForm },
    { path: "/availability", name: "Availability", component: AvailabilityForm },
  ],
});

export default router;
