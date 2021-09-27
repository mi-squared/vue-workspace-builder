<template>
  <div id="page-dashboard-edit">
    <v-toolbar dense flat>
      <v-app-bar-nav-icon @click="navigationHamburgerClicked"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ dashboard.title }}</v-toolbar-title>

    </v-toolbar>
    <DashboardBuilder :key="dashboardId" :workspace="workspace" :dashboard="dashboard"></DashboardBuilder>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { GET_WORKSPACE } from '../../store/types-workspace'
const { mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')
import { GET_DASHBOARD } from '../../store/types-dashboard'
import DashboardBuilder from '../../components/DashboardBuilder'
const { mapGetters: mapDashboardGetters } = createNamespacedHelpers('dashboard')

export default {
  name: 'PageDashboardEdit',
  components: { DashboardBuilder },
  props: {
    workspaceId: {
      type: Number,
      required: true,
    },
    dashboardId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapWorkspaceGetters({
      getWorkspace: GET_WORKSPACE
    }),
    ...mapDashboardGetters({
      getDashboard: GET_DASHBOARD
    }),
    workspace() {
      return this.getWorkspace(this.workspaceId)
    },
    dashboard() {
      return this.getDashboard(this.dashboardId)
    },
  },
  methods: {
    navigationHamburgerClicked() {
      this.$emit('hamburger-navigation-clicked')
    }
  },
  mounted () {
    console.log("PageDashboardEdit Mounted")
  }
}
</script>
<style scoped></style>
