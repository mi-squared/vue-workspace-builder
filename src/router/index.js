import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
import PageDataSource from "@/views/builder/PageDataSource";
import PageWorkspace from "@/views/builder/PageWorkspace.vue";
import PageForms from "@/views/builder/PageForms";
import PageFilters from "@/views/builder/PageFilters";
import PageDashboards from "@/views/builder/PageDashboards";
import PageActions from "@/views/builder/PageActions";

import Builder from '@/views/Builder'
import PageDashboard from '@/views/PageDashboard'
import PageDashboardEdit from '../views/builder/PageDashboardEdit'
import PageFormEdit from '../views/builder/PageFormEdit'
import PageForm from '../views/PageForm'
import PageTimeline from '../views/PageTimeline'

Vue.use(VueRouter);

const routes = [{
    path: "/builder",
    name: 'Builder',
    component: Builder,
    props: ({ params }) => ({
      workspaceId: Number(params.workspaceId),
    }),
    children: [
      {
        path: "workspace/:workspaceId/home",
        name: 'PageWorkspace',
        component: PageWorkspace,
        props: ({ params }) => ({
          workspaceId: Number(params.workspaceId),
        }),
      },
      {
        path: "workspace/:workspaceId/data-source",
        name: 'PageDataSource',
        component: PageDataSource,
        props: ({ params }) => ({
          workspaceId: Number(params.workspaceId),
        }),
      },
      {
        path: "workspace/:workspaceId/forms",
        component: PageForms,
        props: ({ params }) => ({
          workspaceId: Number(params.workspaceId),
          formId: Number(params.formId)
        }),
        children: [
          {
            // UserProfile will be rendered inside User's <router-view>
            // when /user/:id/profile is matched
            path: ":formId(\\d+)",
            name: 'PageFormEdit',
            component: PageFormEdit,
            props: ({ params }) => ({
              formId: Number(params.formId),
              workspaceId: Number(params.workspaceId),
            }),
          },
        ],
      },
      { path: "workspace/:workspaceId/filters", component: PageFilters },
      {
        path: "workspace/:workspaceId/dashboards",
        name: 'PageDashboards',
        component: PageDashboards,
        // beforeEnter: (to, from, next) => {
        //   if (!to.params.dashboardId) {
        //     const navigation = router.app.$store.getters['user/GET_NAVIGATION']
        //     let dashboardId = null
        //     if (navigation.dashboard) {
        //       dashboardId = navigation.dashboard
        //     } else {
        //       const dashboards = Object.keys(router.app.$store.getters['dashboard/ALL_DASHBOARDS'])
        //       if (dashboards.length > 0) {
        //         dashboardId = dashboards[0]
        //       }
        //     }
        //     next({
        //       name: 'DashboardBuilder',
        //       params: {
        //         workspaceId: to.params.workspaceId,
        //         dashboardId: dashboardId
        //       }
        //     })
        //   } else {
        //     router.app.$store.dispatch('user/SET_NAVIGATION', { key: 'dashboard', id: to.params.dashboardId }).then(value => {
        //       console.log(value)
        //       next()
        //     })
        //   }
        // },
        props: ({ params }) => ({
          workspaceId: Number(params.workspaceId),
          dashboardId: Number(params.dashboardId)
        }),
        children: [
          {
            // Dashboard will be rendered inside PageDashboard's <router-view>
            // when /dashboard/:id/profile is matched
            path: ":dashboardId(\\d+)",
            name: "PageDashboardEdit",
            component: PageDashboardEdit,
            // beforeEnter: (to, from , next) => {
            //   router.app.$store.dispatch('user/SET_NAVIGATION', { key: 'dashboard', id: to.params.dashboardId }).then(value => {
            //     console.log(value)
            //     next()
            //   })
            // },
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
    path: "/dashboard/:dashboardId",
    component: PageDashboard,
    name: 'Dashboard',
    props: ({ params }) => ({
      dashboardId: Number(params.dashboardId),
    }),
  },
  {
      path: "/form/:formId",
    name: 'Form',
    component: PageForm,
    props: ({ params }) => ({
      formId: Number(params.formId),
    }),
  },
  {
    path: "/timeline/:pid",
    name: 'PageTimeline',
    component: PageTimeline,
    props: ({ params }) => ({
      pid: Number(params.pid),
    }),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
