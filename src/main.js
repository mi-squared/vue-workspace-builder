import Vue from "vue";
import VueRouter from "vue-router";
import vuetify from "@/plugins/vuetify"; // path to vuetify export
import App from "./App.vue";
import PageDataSource from "./components/PageDataSource";
import PageWorkspace from "./components/PageWorkspace.vue";
import PageForms from "@/components/PageForms";
import PageFilters from "./components/PageFilters";
import PageDashboards from "./components/PageDashboards";
import PageActions from "./components/PageActions";

import store from "./store";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faTimes, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faCheck, faTimes, faCopy);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  { path: "/", component: PageWorkspace },
  { path: "/workspace/:workspaceId/data-source", component: PageDataSource },
  { path: "/workspace/:workspaceId/forms", component: PageForms },
  { path: "/filters", component: PageFilters },
  { path: "/dashboards", component: PageDashboards },
  { path: "/actions", component: PageActions },
  // { path: "/bar", component: Bar },
];

const router = new VueRouter({
  routes, // short for `routes: routes`
});

new Vue({
  vuetify,
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
