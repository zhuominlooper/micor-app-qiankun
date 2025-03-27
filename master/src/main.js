import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
//import { registerMicroApps, start } from "qiankun";
import { registerMicroApps, start } from "./micor-fe/index";
const app = createApp(App);

app.use(router);

app.mount("#app");
registerMicroApps([
  {
    name: "vueApp",
    entry: "http://localhost:8080/",
    container: "#container",
    activeRule: "/app-vue2",
  },
]);
// 启动 qiankun
start();
