<template>

<div id="page-dashboards">
  <v-navigation-drawer app clipped v-model="drawer">
    <v-list shaped>
      <v-list-item>
        <v-list-item-content>
          <v-dialog
            v-model="showNewDashboardDialog"
            persistent
            max-width="600px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                class="align-self-center mr-4"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon left>
                  mdi-plus
                </v-icon>
                New Dashboard
              </v-btn>
            </template>

            <v-card height="100%">
              <v-card-title>
                <span class="text-h5">New Dashboard</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-text-field
                    v-model="newDashboardModel.title"
                    label="Dashboard Title*"
                    required
                  ></v-text-field>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="showNewDashboardDialog = false"
                >
                  Close
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="saveNewLayout"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-list-item-content>
      </v-list-item>
      <!-- End of the new layout dialog -->

      <v-divider class="ml-2 mb-4"></v-divider>

      <!-- this is the list of existing dashboards -->
      <v-list-item-group color="primary">
        <v-list-item @click="onListItemClicked(dashboard.id)" v-for="dashboard in dashboards" :key="dashboard.id" :to="`/builder/workspace/${workspaceId}/dashboards/${dashboard.id}`">
          {{ dashboard.title }}
        </v-list-item>
      </v-list-item-group>
      <!-- end of existing dashboards -->
    </v-list>
  </v-navigation-drawer>

  <router-view @hamburger-navigation-clicked="onNavigationClicked"></router-view>

</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { ALL_DASHBOARDS } from '../../store/types-dashboard'
import { GET_NAVIGATION, SET_NAVIGATION } from '../../store/types-user'
const { mapState: mapDashboardState, mapActions: mapDashboardActions, mapGetters: mapDashboardGetters } = createNamespacedHelpers('dashboard')
const { mapActions: mapUserActions, mapGetters: mapUserGetters } = createNamespacedHelpers('user')

export default {
  name: "PageDashboards",
  props: {
    workspaceId: {
      type: Number,
      required: true
    },
    dashboardId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      ...mapDashboardState,
      activeDashboard: this.dashboardId,
      drawer: true,
      showNewDashboardDialog: false,
      layouts: [

      ],
      newDashboardModel: {},
    }
  },
  computed: {
    ...mapDashboardGetters({
      dashboards: ALL_DASHBOARDS
    }),
    ...mapUserGetters({
      navigation: GET_NAVIGATION
    })
  },
  methods: {
    ...mapDashboardActions,
    ...mapUserActions({
      setNavigation: SET_NAVIGATION
    }),
    onListItemClicked(id) {
      console.log(id)
      this.setNavigation({
        key: 'dashboard',
        id: id
      })
    },
    onNavigationClicked() {
      this.drawer = !this.drawer
    },
    saveNewLayout () {
      // Save the new layout model that gets initial data from the modal, store it, and then
      // set it to the active layout model to edit.
      this.showNewDashboardDialog = false
    },
  },
  mounted () {
    if (!this.dashboardId) {
      if (this.navigation.dashboard) {
        this.activeDashboard = this.navigation.dashboard
      } else if (Object.keys(this.dashboards).length > 0) {
        this.activeDashboard = Object.keys(this.dashboards)[0]
      }

      this.$router.push({
        name: 'DashboardBuilder',
        params: {
          workspaceId: this.workspaceId,
          dashboardId: this.activeDashboard
        }
      })
    }
  }
}
</script>

<style scoped>
#page-dashboards {
  height: 100%;
}

.v-window-item {
  height: 100%;
}

.v-main {
  height: 100%;
}
</style>