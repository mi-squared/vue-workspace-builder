<template>
  <div id="app">
    <v-app>
      <v-tabs v-model="selected">

        <!--
          This is the worrkspace menu, where you can select and modify an existing workspace, or trigger creation
          of a new workspace
         -->
        <v-menu
            bottom
            left
        >
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
                                    :items="administrators" item-text="displayName" item-value="userId"
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
                v-for="item in this.workspaces"
                :key="item"
            >
              {{ item }}
            </v-list-item>
          </v-list>
        </v-menu>

        <v-tab href="#workspace">
          {{ this.workspaceTitle }}
        </v-tab>
        <v-tab-item :key="`workspace`" value="workspace">
          <PageWorkspace></PageWorkspace>
        </v-tab-item>

        <v-tab href="#data-source">
          Data Source
        </v-tab>
        <v-tab-item :key="`data-source`" value="data-source">
          <PageDataSource></PageDataSource>
        </v-tab-item>

        <v-tab href="#dashboards">
          Dashboards
        </v-tab>
        <v-tab-item :key="`dashboards`" value="dashboards">
          <PageDashboards></PageDashboards>
        </v-tab-item>

      <v-tab href="#layouts">
          Forms
      </v-tab>
      <v-tab-item :key="`forms`" value="forms">
          <PageForms></PageForms>
      </v-tab-item>

        <v-tab href="#filters">
          Filters
        </v-tab>
        <v-tab-item :key="`filters`" value="filters">
          <PageFilters></PageFilters>
        </v-tab-item>

        <v-tab href="#actions" value="actions">
          Actions
        </v-tab>
        <v-tab-item :key="`actions`">
          <PageActions></PageActions>
        </v-tab-item>

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

    </v-app>
  </div>
</template>

<script>

import PageWorkspace from "./components/PageWorkspace"
import PageFilters from "./components/PageFilters"
import PageDataSource from "./components/PageDataSource"
import PageActions from "./components/PageActions"
import PageForms from "@/components/PageForms"
import PageDashboards from './components/PageDashboards'

export default {
  name: 'App',
  components: {
      PageDashboards,
    PageForms,
    PageActions,
    PageDataSource,
    PageFilters,
    PageWorkspace
  },
  data() {
    return {
      selected: null,
      workspaces: [ "CET", "Crisis", "Foo"],
      showNewWorkspaceDialog: false,
      newWorkspaceModel: {}
    }
  },
  methods: {
      saveNewWorkspace () {
          // TODO store workspace
          // Save the new workspace model that gets initial data from the modal, store it, and then
          // set it to the active layout model to edit.
          this.showNewWorkspaceDialog = false

          // Set the newly created workspace to be the active workspace
      },
    setSelected(tab) {
      this.selected = tab;
    }
  },
  computed: {
    tabs () {
      return [this.workspaceTitle, 'Data Source', 'Layouts', 'Filters', 'Actions', 'Revisions']
    },
    selectedTab () {
      if (this.selected === null) {
        return this.workspaceTitle
      } else {
        return this.selected
      }
    },
    activeWorkspace () {
      return this.$store.state.workspaces[this.$store.state.userState.activeWorkspace]
    },
    workspaceTitle () {
      return this.activeWorkspace.title + ' Workspace'
    },
    administrators () {
        return Object.values(this.$store.state.administrators)
    }
  }
}
</script>

<style>

</style>
