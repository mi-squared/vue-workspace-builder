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
              <v-icon>
                mdi-plus
              </v-icon>
              New Workspace
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

        <v-tab href="#layouts">
          Layouts
        </v-tab>
        <v-tab-item :key="`layouts`" value="layouts">
          <PageLayouts></PageLayouts>
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


        <v-tab href="#revisions">
          Revisions
        </v-tab>
        <v-tab-item :key="`revisions`" value="revisions">
          Content for Revisions
        </v-tab-item>

        <v-spacer></v-spacer>
        <v-btn right class="mt-1">Save</v-btn>
        <v-btn right class="mt-1 mr-4">Publish</v-btn>

      </v-tabs>

    </v-app>
  </div>
</template>

<script>

import PageWorkspace from "./components/PageWorkspace"
import PageFilters from "./components/PageFilters"
import PageDataSource from "./components/PageDataSource"
import PageActions from "./components/PageActions"
import PageLayouts from "@/components/PageLayouts"

export default {
  name: 'App',
  components: {
    PageLayouts,
    PageActions,
    PageDataSource,
    PageFilters,
    PageWorkspace
  },
  data() {
    return {
      selected: null,
      workspaces: [ "CET", "Crisis", "Foo"]
    }
  },
  methods: {
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
    }
  }
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
