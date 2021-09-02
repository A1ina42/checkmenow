import Vue from 'vue'

//* Всплывающие уведомления
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
Vue.use(VueToast);

//* Excel
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);

//* Vue Select для выпадающего списка
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
Vue.component('v-select', vSelect);

//* Firebase
import firebase from 'firebase/app';
import 'firebase/auth';
let firebaseConfig = {
  apiKey: "AIzaSyAfHfTXCgdyioUesgmnPuPAbsipjAS0p0w",
  authDomain: "test-442d3.firebaseapp.com",
  databaseURL: "https://test-442d3.firebaseio.com",
  projectId: "test-442d3",
  storageBucket: "test-442d3.appspot.com",
  messagingSenderId: "487647683125",
  appId: "1:487647683125:web:150dbad411fad0c2ce877c"
};
firebase.initializeApp(firebaseConfig);

//* Clipboard для копирования текста
import Clipboard from 'v-clipboard'
Vue.use(Clipboard);

//* Всплывающие подсказки
import VueTippy, { TippyComponent } from "vue-tippy";
import "tippy.js/themes/light.css";
import "tippy.js/themes/light-border.css";
import "tippy.js/themes/google.css";
import "tippy.js/themes/translucent.css";
Vue.use(VueTippy);
Vue.component("tippy", TippyComponent);

//* Модальные окна
import VueModal from '@kouts/vue-modal';
import '@kouts/vue-modal/dist/vue-modal.css';
Vue.component('Modal', VueModal);

//* Vue Sidebar
import VueSidebarMenu from 'vue-sidebar-menu'
import "vue-sidebar-menu/src/scss/vue-sidebar-menu.scss";
Vue.use(VueSidebarMenu)


//* Bootstrap Vue
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

//* Графики
import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
