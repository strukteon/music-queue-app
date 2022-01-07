import { createApp } from 'vue'
import App from './App.vue'

import './assets/styles/fonts.css';
import router from './router'

import BackendController from "@/scripts/BackendController";

if (localStorage.getItem("uniqueId") == null) {
    let uniqueId = Math.random().toString(36).substring(2, 15);
    uniqueId += Math.random().toString(36).substring(2, 15);
    uniqueId += Math.random().toString(36).substring(2, 15);
    localStorage.setItem("uniqueId", uniqueId);
    BackendController.setUniqueId(uniqueId);
}

createApp(App)
    .use(router)
    .mount('#app')
