<template>
  <v-app class="page-dashboard">
    <Dashboard v-if="loaded" :dashboard="dashboard" :preview="false"></Dashboard>
    <div v-else>
      <v-skeleton-loader
        v-bind="skeletonLoaderAttrs"
        type="table"
      ></v-skeleton-loader>
    </div>
  </v-app>
</template>

<script>

import { createNamespacedHelpers } from 'vuex'

import { ALL_WORKSPACES } from '../store/types-workspace'

const { mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')

import { GET_LIST } from '../store/types-list'

const { mapGetters: mapListGetters } = createNamespacedHelpers('list')

import { FETCH_DASHBOARD, GET_DASHBOARD, GET_DASHBOARD_ROWS } from '../store/types-dashboard'

const { mapGetters: mapDashboardGetters, mapActions: mapDashboardActions } = createNamespacedHelpers('dashboard')

import { INIT } from '../store/types-user'
import Dashboard from '../components/Dashboard'
const { mapActions: mapUserActions } = createNamespacedHelpers('user')

export default {
  name: 'PageDashboard',
  props: {
    dashboardId: {
      type: Number,
      required: true
    }
  },
  components: {
    Dashboard,
  },
  data () {
    return {
      loaded: false,
      isPreview: this.preview || false,
      skeletonLoaderAttrs: {
        class: 'mb-6',
        boilerplate: true,
        elevation: 2,
      },
    }
  },
  computed: {
    ...mapDashboardGetters({
      getDashboard: GET_DASHBOARD,
      getDashboardRows: GET_DASHBOARD_ROWS
    }),
    ...mapWorkspaceGetters({
      allWorkspaces: ALL_WORKSPACES
    }),
    ...mapListGetters({
      getList: GET_LIST
    }),
    dashboard () {
      return this.getDashboard(this.dashboardId)
    },
    headers () {
      return this.dashboard.headers
    },
    rows () {
      return this.getDashboardRows(this.dashboardId)
    },
    /**
     * Get an array of text/value objects representing facilities
     *
     * @returns {*}
     */
    facilities () {
      return this.getList('facilities').data
    },
    workspaces () {
      return Object.values(this.allWorkspaces)
    },
  },
  methods: {
    ...mapDashboardActions({
      fetchDashboard: FETCH_DASHBOARD,
    }),
    ...mapUserActions({
      initUser: INIT
    }),
  },
  mounted () {
    console.log("PageDashboard Mounted")

    let that = this
    // First we have to init our user and token so we can make API calls
    this.initUser().then(() => {

      that.fetchDashboard({ dashboardId: that.dashboardId })
        .then(() => {
          // For some reason, the dashboard object that is returned from the vuex action FETCH_DASHBOARD is undefined,
          // but this still works because it sets the dashboard object in vuex and becomes reactive
          that.loaded = true
        })
    })
  }
}
</script>

<style>

</style>
