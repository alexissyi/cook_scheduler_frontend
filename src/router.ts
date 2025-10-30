import { createRouter, createWebHistory } from "vue-router";
import App from "@/App.vue";
import AvailabilityForm from "@/views/AvailabilityForm.vue";
import Controls from "@/views/Controls.vue";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: "/",
      name: "Home",
      component: App,
    },
    { path: "/availability", name: "Availability", component: AvailabilityForm },
    { path: "/controls", name: "Controls", component: Controls },
  ],
});

export default router;
