<template>
  <div>
  <v-toolbar dense flat>
    <v-app-bar-nav-icon @click="navigationHamburgerClicked"></v-app-bar-nav-icon>

    <v-toolbar-title>{{ dashboard.title }}</v-toolbar-title>

  </v-toolbar>
  <DashboardBuilder :key="dashboardId" :dashboard="dashboard"></DashboardBuilder>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { GET_WORKSPACE } from '../../store/types-workspace'
const { mapState: mapWorkspaceState, mapActions: mapWorkspaceActions, mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')
import { GET_DASHBOARD } from '../../store/types-dashboard'
import DashboardBuilder from '../../components/DashboardBuilder'
const { mapState: mapDashboardState, mapActions: mapDashboardActions, mapGetters: mapDashboardGetters } = createNamespacedHelpers('dashboard')

export default {
  name: 'PageDashboardEdit',
  components: { DashboardBuilder },
  props: {
    dashboardId: {
      type: Number,
      required: true,
    },
    workspaceId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      ...mapWorkspaceState,
      ...mapDashboardState,
    }
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
    ...mapWorkspaceActions,
    ...mapDashboardActions,
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
