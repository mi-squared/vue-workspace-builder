import Vue from "vue";
import vuetify from "@/plugins/vuetify"; // path to vuetify export
import App from "./App.vue";

import { makeServer } from "./server"

import store from "./store";
import router from "./router";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faTimes, faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faCheck, faTimes, faCopy, faTrash);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

if (process.env.NODE_ENV === "development" && process.env.VUE_APP_API_MOCK) {
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
