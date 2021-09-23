<template>
  <v-container>

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

        <v-spacer></v-spacer>

        <v-btn class="mt-4 mr-2" color="success" :disabled="!isDirty" @click="save">
          <v-icon>mdi-floppy</v-icon>
          Save
        </v-btn>


      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item :key="'tab-properties'">
          <v-container>
            <v-text-field
                label="Title"
                hide-details="auto"
                v-model="activeDashboard.title"
                required
            ></v-text-field>

            <v-switch
              v-model="activeDashboard.displayNewButton"
              label="Display '+ New' Button"
            ></v-switch>

            <v-select
              v-if="activeDashboard.displayNewButton"
              v-model="activeDashboard.newEntityFormId"
              label="New Entity Form"
              :items="this.formOptions"
            >

            </v-select>

            <v-switch
                v-model="activeDashboard.displayDuration"
                :label="`Display Date Added: ${activeDashboard.displayDuration.toString()}`"
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
                  :list="activeDashboard.headers"
                  draggable=".v-list-item"
                  group="a"
              >
                <!-- use value for key because it's unique -->
                <v-list-item
                    v-for="element in activeDashboard.headers"
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
              <v-btn @click="addColumn">Add</v-btn>
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
            <v-list-item-title>{{ activeDashboardElement.name }}</v-list-item-title>
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
const { mapState: mapWorkspaceState, mapActions: mapWorkspaceActions, mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')
import { GET_DASHBOARD, SET_DASHBOARD } from '../store/types-dashboard'
const { mapState: mapDashboardState, mapActions: mapDashboardActions, mapGetters: mapDashboardGetters } = createNamespacedHelpers('dashboard')

export default {
  name: "DashboardBuilder",
  components: {
    MultiRangePicker,
    draggable
  },
  props: {
    dashboard: {
      type: Object,
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
      activeDashboard: { ...this.dashboard }
    }
  },
  watch: {
    activeDashboard: {
      // Watch the activeDashboard using a deep watch, and when it changes,
      // mark the model as dirty, which activates the "save" button
      handler() {
        this.isDirty = true
        // TODO should propagate an event up to let navigation know that there are unsaved changes on this builder
      },
      deep: true
    }
  },
  computed: {
    ...mapWorkspaceGetters({
      getWorkspace: GET_WORKSPACE
    }),
    ...mapDashboardGetters({
      getDashboard: GET_DASHBOARD
    }),

    formOptions() {
      // This gathers up all the lists in { text: '', value: '' } format for the select box
      return [{ text: 'test', value: '0'}]
    }
  },
  methods: {
    ...mapWorkspaceActions,
    ...mapDashboardActions({
      setDashboard: SET_DASHBOARD
    }),
    addColumn: function() {
      this.activeDashboardElement = {
        title: '',
        value: ''
      }
      // this.dashboard.headers.push(newElement)
      this.dashboardElementClicked(this.activeDashboardElement)
    },
    save() {
      // this.$emit('dashboard-save-clicked', { dashboardId: this.activeDashboard.id })
      let that = this
      this.setDashboard({ dashboardId: this.activeDashboard.id, dashboard: this.activeDashboard })
        .then(function () {
          that.isDirty = false
        })
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
      this.dashboard.headers.push(this.activeDashboardElement)
      console.log('save clicked')
      // this.$store.dispatch("updateDashboard", {
      //   workspaceId: this.workspaceId,
      //   dashboardId: this.dashboardId,
      //   dashboard: this.dashboard
      // })
      this.drawer = false
    }
  },
  mounted () {
    console.log('Dashboard Builder Mounted')
  }
}
</script>
<style scoped></style>
