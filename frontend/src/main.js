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

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import "@/assets/styles/all.scss";

createApp(App)
    .use(router)
    .component("font-awesome-icon", FontAwesomeIcon)
    .mount('#app')
