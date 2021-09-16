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
        <v-list-item v-for="dashboard in dashboards" :key="dashboard.id" :to="`/builder/workspace/${activeWorkspace.id}/dashboards/${dashboard.id}`">
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

export default {
  name: "PageDashboards",
  components: {

  },
  data () {
    return {
      drawer: true,
      showNewDashboardDialog: false,
      layouts: [

      ],
      newDashboardModel: {},
      activeDashboard: {},


    }
  },
  computed: {
    activeWorkspace () {
      return this.$store.state.workspaces[this.$store.state.userState.activeWorkspace]
    },
    dashboards () {
      return this.activeWorkspace.dashboards
    }
  },
  methods: {
    onNavigationClicked() {
      this.drawer = !this.drawer
    },
    saveNewLayout () {
      // Save the new layout model that gets initial data from the modal, store it, and then
      // set it to the active layout model to edit.
      this.showNewDashboardDialog = false
    },

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
