import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router.ts";

import AppRouter from "./AppRouter.vue";

const pinia = createPinia();
const app = createApp(AppRouter);

app.use(pinia);
app.use(router);
app.mount("#app");
