import Vue from "vue";
import vuetify from "@/plugins/vuetify"; // path to vuetify export
import App from "./App.vue";

import { makeServer } from "./server"

import store from "./store";
import router from "./router";

import VueMask from 'v-mask'
Vue.use(VueMask);

import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false;

if (import.meta.NODE_ENV === "development" && import.meta.VITE_API_MOCK) {
  makeServer();
}

import { createNamespacedHelpers } from 'vuex'
import { INIT } from './store/types-user'
const { mapActions: mapUserActions } = createNamespacedHelpers('user')

new Vue({
  vuetify,
  store,
  router,
  computed: {
    ...mapUserActions({
      initUser: INIT
    })
  },
  data() {
    return {
      initialized: false
    }
  },
  created () {
    //this.initUser
  },
  render: (h) => h(App),
}).$mount("#app");
