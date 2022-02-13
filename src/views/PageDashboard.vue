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


import { INIT_DASHBOARD } from '../store/types-dashboard'

const { mapActions: mapDashboardActions } = createNamespacedHelpers('dashboard')

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
      dashboardModel: null
    }
  },
  computed: {
    dashboard () {
      return this.dashboardModel
    },
  },
  methods: {
    ...mapDashboardActions({
      initDashboard: INIT_DASHBOARD,
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

      that.initDashboard({ dashboardId: that.dashboardId }).then((response) => {

        that.dashboardModel = response.dashboard
        that.loaded = true
      })
    })
  }
}
</script>

<style>

</style>
