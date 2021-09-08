<template>
  <v-app>
    <v-app-bar app>
      <v-tabs v-model="selected">
        <!--
        This is the worrkspace menu, where you can select and modify an existing workspace, or trigger creation
        of a new workspace
       -->
        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                text
                class="align-self-center mr-4"
                v-bind="attrs"
                v-on="on"
            >
              <v-icon>
                mdi-menu
              </v-icon>
            </v-btn>
          </template>

          <v-list class="grey lighten-3">
            <v-list-item>
              <!-- dialog for creating new workspace -->
              <v-dialog
                  v-model="showNewWorkspaceDialog"
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
                    New Workspace
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title>
                    <span class="text-h5">New Workspace</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-text-field
                          v-model="newWorkspaceModel.title"
                          label="Workspace Title*"
                          required
                      ></v-text-field>
                      <v-select
                          v-model="newWorkspaceModel.administrator"
                          :items="administrators"
                          item-text="displayName"
                          item-value="userId"
                          label="Administrator*"
                          required
                      ></v-select>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="showNewWorkspaceDialog = false"
                    >
                      Close
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="saveNewWorkspace"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!-- end dialog for new workspace -->
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item v-for="item in this.workspaces" :key="item">
              {{ item }}
            </v-list-item>
          </v-list>
        </v-menu>

        <v-tab :to="`/builder/workspace/${activeWorkspace.id}/home`">
          {{ this.workspaceTitle }}
        </v-tab>

        <v-tab :to="`/builder/workspace/${activeWorkspace.id}/data-source`">
          Data Source
        </v-tab>

        <v-tab :to="`/builder/workspace/${activeWorkspace.id}/dashboards`">
          Dashboards
        </v-tab>

        <v-tab :to="`/builder/workspace/${activeWorkspace.id}/forms`">
          Forms
        </v-tab>

        <v-tab :to="`/builder/workspace/${activeWorkspace.id}/filters`">
          Filters
        </v-tab>

        <v-tab :to="`/builder/workspace/${activeWorkspace.id}/actions`">
          Actions
        </v-tab>

        <!-- Revisions are not implemented -->
        <!--        <v-tab href="#revisions">-->
        <!--          Revisions-->
        <!--        </v-tab>-->
        <!--        <v-tab-item :key="`revisions`" value="revisions">-->
        <!--          Content for Revisions-->
        <!--        </v-tab-item>-->

        <!-- Saving and publishing are not implemented -->
        <!--        <v-spacer></v-spacer>-->
        <!--        <v-btn right class="mt-1">Save</v-btn>-->
        <!--        <v-btn right class="mt-1 mr-4">Publish</v-btn>-->
      </v-tabs>
    </v-app-bar>

    <v-main fluid>
      <router-view></router-view>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'Builder',
  data() {
    return {
      selected: null,
      workspaces: ["CET", "Crisis", "Foo"],
      showNewWorkspaceDialog: false,
      newWorkspaceModel: {},
    };
  },
  methods: {
    saveNewWorkspace() {
      // TODO store workspace
      // Save the new workspace model that gets initial data from the modal, store it, and then
      // set it to the active layout model to edit.
      this.showNewWorkspaceDialog = false

      // Set the newly created workspace to be the active workspace
    },
    setSelected(tab) {
      this.selected = tab
    },
  },
  computed: {
    tabs() {
      // Tabs have to be in this array for the navigation to work
      return [
        this.workspaceTitle,
        "Data Source",
        "Dashboards",
        "Forms",
        "Filters",
        "Actions",
      ];
    },
    selectedTab() {
      if (this.selected === null) {
        return this.workspaceTitle
      } else {
        return this.selected
      }
    },
    activeWorkspaceId() {
      return this.$store.state.userState.activeWorkspace
    },
    activeWorkspace() {
      return this.$store.state.workspaces[this.activeWorkspaceId]
    },
    workspaceTitle() {
      return this.activeWorkspace.title + " Workspace"
    },
    administrators() {
      return Object.values(this.$store.state.administrators)
    }
  },
  mounted () {
    // When builder component load is done loading, redirect to the active workspace home page
    this.$router.push({ path: `/builder/workspace/${this.activeWorkspaceId}/home` }) // -> /user/123
  }
}
</script>

<style scoped>

</style>