import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
import PageDataSource from "@/views/PageDataSource";
import PageWorkspace from "@/views/PageWorkspace.vue";
import PageForms from "@/views/PageForms";
import PageFilters from "@/views/PageFilters";
import PageDashboards from "@/views/PageDashboards";
import PageActions from "@/views/PageActions";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: PageWorkspace },
  { path: "/workspace/:workspaceId/data-source", component: PageDataSource },
  { path: "/workspace/:workspaceId/forms", component: PageForms },
  { path: "/filters", component: PageFilters },
  { path: "/dashboards", component: PageDashboards },
  { path: "/actions", component: PageActions },
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
];

const router = new VueRouter({
  routes,
});

export default router;
