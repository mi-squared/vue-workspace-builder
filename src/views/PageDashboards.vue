<template>

<div id="page-dashboards">
  <!-- This is the dialog at the top for creating a new layout -->
  <v-tabs vertical>
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

      <v-card>
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
    <!-- End of the new layout dialog -->

    <!-- this is the list of existing dashboards -->
    <v-tab v-for="dashboard in dashboards" :key="dashboard.id">
      {{ dashboard.title }}
    </v-tab>
    <!-- end of existing dashboards -->


    <v-tab-item v-for="dashboard in dashboards" :key="dashboard.id">
      <v-card flat>
        <DashboardBuilder :dashboard="dashboard"></DashboardBuilder>
      </v-card>
    </v-tab-item>

  </v-tabs>
</div>
</template>

<script>
import DashboardBuilder from "@/components/DashboardBuilder"

export default {
  name: "PageDashboards",
  components: {
    DashboardBuilder
  },
  data () {
    return {
      showNewDashboardDialog: false,
      layouts: [

      ],
      newDashboardModel: {},
      activeDashboard: {}
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
    saveNewLayout () {
      // Save the new layout model that gets initial data from the modal, store it, and then
      // set it to the active layout model to edit.
      this.showNewDashboardDialog = false
    }
  }
}
</script>

<style scoped>

</style>
