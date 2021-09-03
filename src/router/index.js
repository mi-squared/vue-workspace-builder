import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
import PageDataSource from "@/views/PageDataSource";
import PageWorkspace from "@/views/PageWorkspace.vue";
import PageForms from "@/views/PageForms";
import PageFilters from "@/views/PageFilters";
import PageDashboards from "@/views/PageDashboards";
import PageActions from "@/views/PageActions";

import FormBuilder from "@/components/FormBuilder";
import DashboardBuilder from '@/components/DashboardBuilder'

Vue.use(VueRouter);

const routes = [
  { path: "/", component: PageWorkspace },
  { path: "/workspace/:workspaceId/data-source", component: PageDataSource },
  {
    path: "/workspace/:workspaceId/forms",
    component: PageForms,
    props: ({ params }) => ({
      workspaceId: Number.parseInt(params.workspaceId, 10) || 0,
    }),
    children: [
      {
        // UserProfile will be rendered inside User's <router-view>
        // when /user/:id/profile is matched
        path: ":formId(\\d+)",
        component: FormBuilder,
        props: ({ params }) => ({
          formId: Number.parseInt(params.formId, 10) || 0,
          workspaceId: Number.parseInt(params.workspaceId, 10) || 0,
        }),
      },
    ],
  },
  { path: "/filters", component: PageFilters },
  {
    path: "/workspace/:workspaceId/dashboards",
    component: PageDashboards,
    props: ({ params }) => ({
      workspaceId: Number.parseInt(params.workspaceId, 10) || 0,
    }),
    children: [
      {
        // DashboardVuilder will be rendered inside PageDashboard's <router-view>
        // when /dashboard/:id/profile is matched
        path: ":dashboardId(\\d+)",
        component: DashboardBuilder,
        props: ({ params }) => ({
          dashboardId: Number.parseInt(params.dashboardId, 10) || 0,
          workspaceId: Number.parseInt(params.workspaceId, 10) || 0,
        }),
      },
    ],
  },
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
