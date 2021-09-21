<template>
  <v-container  height="1000">

    <v-toolbar dense flat>
      <v-app-bar-nav-icon @click="navigationHamburgerClicked"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ this.dashboard.title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn color="success" :disabled="!isDirty">
        <v-icon>mdi-floppy</v-icon>
        <div>Save</div>
      </v-btn>

    </v-toolbar>

      <v-tabs
          v-model="tab"
          icons-and-text
      >
        <v-tab :key="'tab-properties'">
          Properties
          <v-icon>mdi-settings</v-icon>
        </v-tab>
        <v-tab :key="'tab-columns'">
          Columns
          <v-icon>mdi-table</v-icon>
        </v-tab>

      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item :key="'tab-properties'">
          <v-container>
            <v-text-field
                label="Title"
                hide-details="auto"
                v-model="this.dashboard.title"
                required
            ></v-text-field>

            <v-switch
              v-model="displayNewButton"
              label="Display '+ New' Button"
            ></v-switch>

            <v-select
              v-if="displayNewButton"
              v-model="this.newEntityFormId"
              label="New Entity Form"
              :items="this.formOptions"
            >

            </v-select>

            <v-switch
                v-model="displayDuration"
                :label="`Display Date Added: ${displayDuration.toString()}`"
            ></v-switch>
            <v-divider></v-divider>

            <MultiRangePicker></MultiRangePicker>

          </v-container>
        </v-tab-item>

        <!-- Column list -->
        <v-tab-item :key="'tab-columns'">
          <v-list>
            <v-list-item-group
                color="primary"
            >
              <draggable
                  id="first"
                  :list="dashboardColumns"
                  draggable=".v-list-item"
                  group="a"
              >
                <!-- use value for key because it's unique -->
                <v-list-item
                    v-for="element in dashboardColumns"
                    :key="element.value"
                    @click="dashboardElementClicked(element)"
                    color="primary"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-drag-vertical</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="element.text"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </draggable>

            </v-list-item-group>

            <v-list-item>
              <!-- Button to add a new dashboard column -->
              <v-btn @click="add">Add</v-btn>
            </v-list-item>
          </v-list>
        </v-tab-item>
      </v-tabs-items>

    <!-- end dashboard properties -->

    <!-- when an element is clicked, this should slide out -->
      <v-navigation-drawer
          v-model="drawer"
          app
          absolute
          right
          temporary
          width="420"
      >
        <v-list-item>
          <v-list-item-avatar>
            <v-icon>mdi-page-layout-header</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ this.activeDashboardElement.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-form
            ref="form"
            v-model="validElement"
            lazy-validation
        >
          <v-container>
            <v-text-field
                v-model="activeDashboardElement.text"
                :counter="10"
                label="Name"
                required
            ></v-text-field>

            <v-btn
                color="success"
                class="mr-4"
                @click="storeActiveDashboardElement"
            >
              Save
            </v-btn>
            <v-btn
                color="secondary"
                class="mr-4"
                @click="drawer = false"
            >
              Cancel
            </v-btn>
          </v-container>
        </v-form>
      </v-navigation-drawer>
  </v-container>

</template>

<script>
import draggable from "vuedraggable";
import MultiRangePicker from './MultiRangePicker'
import { createNamespacedHelpers } from 'vuex'
import { GET_WORKSPACE } from '../store/types-workspace'
import { GET_DASHBOARD } from '../store/types-dashboard'
const { mapState: mapWorkspaceState, mapActions: mapWorkspaceActions, mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')
const { mapState: mapDashboardState, mapActions: mapDashboardActions, mapGetters: mapDashboardGetters } = createNamespacedHelpers('dashboard')

export default {
  name: "DashboardBuilder",
  components: {
    MultiRangePicker,
    draggable
  },
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
      isDirty: false,
      tab: null,
      selectedItem: 1,
      drawer: null,
      activeDashboardElement: {},
      validElement: true,
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
    dashboardColumns() {
      return this.dashboard.headers
    },
    newEntityFormId() {
      return this.dashboard.newEntityFormId
    },
    displayDuration() {
      return this.dashboard.displayDuration
    },
    displayNewButton() {
      return this.dashboard.displayNewButton
    },
    formOptions() {
      // This gathers up all the forms in { text: '', value: '' } format for the select box
      let options = []
      this.workspace.forms.forEach(form => {
        const option = {
          text: form.title,
          value: form.id
        }
        options.push(option)
      })
      return options
    }
  },
  methods: {
    ...mapWorkspaceActions,
    ...mapDashboardActions,
    add: function() {
      const newElement = {
        title: '',
        value: ''
      }
      this.dashboard.headers.push(newElement)
      this.dashboardElementClicked(newElement)
    },
    dashboardElementClicked(element) {
      this.$emit('dashboard-element-clicked', element)
      this.showDashboardElementProperties(element)
    },
    dashboardAddElementClicked()
    {

    },
    showDashboardElementProperties(element)
    {
      this.activeDashboardElement = element
      console.log(element)
      this.drawer = true
    },

    /**
     * Save the active element to Vuex
     */
    storeActiveDashboardElement()
    {
      console.log('save clicked')
      this.$store.dispatch("updateDashboard", {
        workspaceId: this.workspaceId,
        dashboardId: this.dashboardId,
        dashboard: this.dashboard
      })
      this.drawer = false
    },
    navigationHamburgerClicked() {
      this.$emit('hamburger-navigation-clicked')
    }
  }
}
</script>
<style scoped></style>
