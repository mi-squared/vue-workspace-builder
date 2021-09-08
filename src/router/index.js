import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
import PageDataSource from "@/views/builder/PageDataSource";
import PageWorkspace from "@/views/builder/PageWorkspace.vue";
import PageForms from "@/views/builder/PageForms";
import PageFilters from "@/views/builder/PageFilters";
import PageDashboards from "@/views/builder/PageDashboards";
import PageActions from "@/views/builder/PageActions";

import FormBuilder from "@/components/FormBuilder";
import DashboardBuilder from '@/components/DashboardBuilder'
import Builder from '@/views/Builder'
import PageDashboard from '@/views/dashboard/PageDashboard'
import PageForm from '@/views/form/PageForm'
import Dashboard from '../views/Dashboard'
import Form from '../views/Form'

Vue.use(VueRouter);

const routes = [{
    path: "/builder",
    component: Builder,
    children: [
      {
          path: "workspace/:workspaceId/home",
          component: PageWorkspace
      },
      {
          path: "workspace/:workspaceId/data-source",
          component: PageDataSource
      },
      {
        path: "workspace/:workspaceId/forms",
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
      { path: "workspace/:workspaceId/filters", component: PageFilters },
      {
        path: "workspace/:workspaceId/dashboards",
        component: PageDashboards,
        props: ({ params }) => ({
          workspaceId: Number.parseInt(params.workspaceId, 10) || 0,
        }),
        children: [
          {
            // Dashboard will be rendered inside PageDashboard's <router-view>
            // when /dashboard/:id/profile is matched
            path: ":dashboardId(\\d+)",
            name: "builder-dashboard",
            component: DashboardBuilder,
            props: ({ params }) => ({
              dashboardId: Number.parseInt(params.dashboardId, 10) || 0,
              workspaceId: Number.parseInt(params.workspaceId, 10) || 0,
            }),
          },
        ],
      },
      { path: "workspace/:workspaceId/actions", component: PageActions },
    ]
  },
  {
      path: "/dashboard",
      component: Dashboard,
      children: [{
        path: ':id',
        name: 'Dashboard',
        component: PageDashboard,
        props: true
      }]
  },
  {
      path: "/form",
      component: Form,
      children: [{
        path: ':id',
        name: 'Form',
        component: PageForm,
        props: true
     }]
  },
];

const router = new VueRouter({
  routes,
});

export default router;
