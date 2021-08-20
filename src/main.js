import Vue from "vue";
import vuetify from "@/plugins/vuetify"; // path to vuetify export
import App from "./App.vue";

import store from "./store";
import router from "./router";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faTimes, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faCheck, faTimes, faCopy);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
