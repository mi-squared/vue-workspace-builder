<template>
  <v-app class="builder">
    <div v-if="loaded">
      <v-app-bar app clipped-left>
        <v-tabs v-model="selected">
          <!--
          This is the worrkspace menu, where you can select and modify an existing workspace, or trigger creation
          of a new workspace
         -->

          <v-tab :to="{ name: 'PageWorkspace', params: { workspaceId: workspaceId } }">
            {{ this.workspaceTitle }}
          </v-tab>

          <v-tab :to="{ name: 'PageDataSource', params: { workspaceId: workspaceId } }">
            Data Source
          </v-tab>

          <v-tab :to="{ name: 'PageDashboards', params: { workspaceId: workspaceId, dashboardId: null } }">
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

        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              class="align-self-center mr-4"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>
                mdi-dots-vertical
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

            <v-list-item
              v-for="workspace in workspaces"
              :key="workspace.id"
              :to="{ name: 'PageWorkspace', params: { workspaceId: workspace.id } }"
            >
              {{ workspace.title }}
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <!-- v-main  -->
      <v-main>
        <router-view></router-view>
      </v-main>

      <v-footer app>
        <!-- -->
      </v-footer>
    </div>
    <div v-else>
      <v-skeleton-loader
        v-bind="skeletonLoaderAttrs"
        type="table-heading, actions, article, table-tfoot"
      ></v-skeleton-loader>
    </div>
  </v-app>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import {
  ALL_WORKSPACES,
  CREATE_WORKSPACE,
  FETCH_ALL_WORKSPACES,
  FETCH_WORKSPACE,
  GET_WORKSPACE
} from '../store/types-workspace'
import { INIT } from '../store/types-user'
const { mapState: mapWorkspaceState, mapActions: mapWorkspaceActions, mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')
const { mapActions: mapUserActions } = createNamespacedHelpers('user')

export default {
  name: 'Builder',
  props: {
    workspaceId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      loaded: false,
      ...mapWorkspaceState,
      skeletonLoaderAttrs: {
        class: 'mb-6',
        boilerplate: true,
        elevation: 2,
      },
      selected: null,
      showNewWorkspaceDialog: false,
      newWorkspaceModel: {
        title: "",
        administrator: ""
      },
    };
  },
  computed: {
    ...mapWorkspaceGetters({
      getWorkspace: GET_WORKSPACE,
      allWorkspaces: ALL_WORKSPACES
    }),
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
    workspaces() {
      return Object.values(this.allWorkspaces)
    },
    activeWorkspaceId() {
      return this.workspaceId
    },
    activeWorkspace() {
      return this.getWorkspace(this.activeWorkspaceId)
    },
    workspaceTitle() {
      return this.activeWorkspace.title + " Workspace"
    },
    administrators() {
      return [] // Object.values(this.$store.state.administrators)
    }
  },
  methods: {
    ...mapWorkspaceActions({
      fetchAllWorkspaces: FETCH_ALL_WORKSPACES,
      fetchWorkspace: FETCH_WORKSPACE,
      createWorkspace: CREATE_WORKSPACE
    }),
    ...mapUserActions({
      initUser: INIT
    }),
    saveNewWorkspace() {
      this.createWorkspace(this.newWorkspaceModel)
      // Save the new workspace model that gets initial data from the modal, store it, and then
      // set it to the active layout model to edit.
      this.showNewWorkspaceDialog = false

      // Reset the new workspace model to be empty for next time
      this.newWorkspaceModel = {
        title: "",
        administrator: ""
      }

      // TODO can we set the newly created workspace to be the active workspace?

    },
    setSelected(tab) {
      this.selected = tab
    },
  },
  mounted () {
    // When builder component load is done loading, redirect to the active workspace home page
    // this.$router.push({ path: `/builder/workspace/${this.activeWorkspaceId}/home` })
    console.log('hello')
    document.title = "Workspace Builder"
  },
  created () {
    let that = this
    this.initUser().then(() => {
      that.fetchAllWorkspaces().then(workspaces => {
        console.log('Fetched all workspaces: ' + workspaces.length)
      }).then(() => {
        this.loaded = true
        // this.getWorkspace(this.workspaceId)
      })
    })
  }
}
</script>

<style scoped>

</style>
