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

        <DashboardPreviewButton :dashboard="activeDashboard"></DashboardPreviewButton>

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

            <v-select
              v-model="activeDashboard.mainFormId"
              label="Main Form"
              :items="this.formOptions"
            ></v-select>

            <v-switch
              v-model="activeDashboard.displayNewButton"
              label="Display '+ New' Button"
            ></v-switch>

            <v-select
              v-if="activeDashboard.displayNewButton"
              v-model="activeDashboard.newEntityFormId"
              label="New Entity Form"
              :items="this.formOptions"
            ></v-select>

            <v-switch
              v-model="activeDashboard.disableDashboardFilter"
              label="Disable Dashboard Filter"
              persistent-hint
              hint="Turn this on if you want this dashboard to display entities from all dashboards in the workspace rather than entities currently on this dashboard."
            ></v-switch>

            <v-switch
                v-model="activeDashboard.displayDuration"
                label="Display color-coded date Column"
                hint="Displays the date and time that an entity was added to this dashboard"
            ></v-switch>

            <v-select
              v-if="activeDashboard.displayDuration"
              v-model="activeDashboard.durationField"
              label="The field on which you wish to display the color-coded duration chip"
              :items="dateFields"
            ></v-select>
            <v-divider></v-divider>

            <MultiRangePicker
              v-if="activeDashboard.displayDuration"
              :ranges="activeDashboard.durationModel.ranges"
              :units="activeDashboard.durationModel.units"
              :out-of-range-color="activeDashboard.durationModel.outOfRangeColor"
              @change="onRangePickerChanged"
            ></MultiRangePicker>

            <v-divider class="mt-4"></v-divider>
            <div v-text="`Conditional Logic`" class="text-h6"></div>

            <v-switch
              v-model="activeDashboard.hasConditionalLogic"
              label="Conditional Logic"
            ></v-switch>

            <DashboardConditionBuilder
              v-if="activeDashboard.hasConditionalLogic == true"
              :dashboard="activeDashboard"
              :dataSource="dataSource"
              :key="activeDashboard.id"
              @change="onConditionalLogicChanged"
            ></DashboardConditionBuilder>

            <br><br>
            <v-divider></v-divider>
            <v-textarea
              :value="JSON.stringify(activeDashboard, undefined, 4)"
              auto-grow
              readonly
              label="Dashboard JSON"
            >
            </v-textarea>

          </v-container>
        </v-tab-item>

        <!-- Column list -->
        <v-tab-item :key="'tab-columns'">
          <v-list>

            <v-list-item>
              <!-- Button adn Dialog to add a new dashboard column -->
              <DataSourceColPickerBtn :workspace="workspace" @selected="addColumn"></DataSourceColPickerBtn>

            </v-list-item>
            <v-divider></v-divider>
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
          </v-list>

          <!-- JSON schema preview -->
          <v-textarea
            :value="JSON.stringify(activeDashboard, undefined, 4)"
            auto-grow
            readonly
            label="Header Schema"
          >
          </v-textarea>
        </v-tab-item>
      </v-tabs-items>

    <!-- end dashboard properties -->

    <!-- when an element is clicked, this should slide out -->
      <v-navigation-drawer
          v-model="drawer"
          app
          right
          temporary
          width="420"
      >
        <v-list-item>
          <v-list-item-avatar>
            <v-icon>mdi-page-layout-header</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <!-- Display the value, which is the link to the datasource-->
            <v-list-item-title>{{ activeDashboardElement.value }}</v-list-item-title>
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
                :counter="20"
                label="Name"
                required
            ></v-text-field>

            <v-switch
              v-model="activeDashboardElement.editable"
              :readonly="!isActiveElementEditable()"
              label="Is Editable?"
              ></v-switch>

            <v-text-field
              v-model="activeDashboardElement.width"
              label="Width"
              hint="100px"
            ></v-text-field>

            <v-row>
              <v-col cols="7">
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
              </v-col>
              <v-col class="text-right">
                <v-btn
                  plain
                  color="error"
                  class="mr-4"
                  @click="deleteActiveDashboardElement"
                >
                  <v-icon>mdi-delete</v-icon>
                  Delete
                </v-btn>
              </v-col>
            </v-row>

          </v-container>
        </v-form>
      </v-navigation-drawer>
  </v-container>

</template>

<script>
import { createNamespacedHelpers } from 'vuex'

import { GET_FORMS } from '../store/types-workspace'
const { mapActions: mapWorkspaceActions, mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')

import { GET_DASHBOARD, SET_DASHBOARD } from '../store/types-dashboard'
const { mapActions: mapDashboardActions, mapGetters: mapDashboardGetters } = createNamespacedHelpers('dashboard')
const { mapGetters: mapFormGetters } = createNamespacedHelpers('form')

import draggable from "vuedraggable";
import MultiRangePicker from './MultiRangePicker'
import DashboardPreviewButton from './DashboardPreviewButton'
import { ALL_FORMS } from '../store/types-form'
import { humanizeDataSourceString } from '../display-helpers'
import DataSourceColPickerBtn from './DataSourceColPickerBtn'
import DashboardConditionBuilder from './DashboardConditionBuilder'


export default {
  name: "DashboardBuilder",
  components: {
    DashboardConditionBuilder,
    DataSourceColPickerBtn,
    DashboardPreviewButton,
    MultiRangePicker,
    draggable
  },
  props: {
    workspace: {
      type: Object,
      required: true
    },
    dashboard: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isDirty: false,
      tab: null,
      drawer: null,
      activeDashboardElement: {},
      validElement: true, // true if the properties of a new or modified column are valid
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
      getFormsByWorkspaceId: GET_FORMS
    }),
    ...mapDashboardGetters({
      getDashboard: GET_DASHBOARD
    }),
    ...mapFormGetters({
      allForms: ALL_FORMS,
    }),
    dataSource() {
      return this.workspace.dataSource
    },
    dataSourceColumns() {
      return this.dataSource.spec.columns
    },
    formOptions() {
      // This gathers up all the lists in { text: '', value: '' } format for the select box
      const forms = Object.values(this.getFormsByWorkspaceId(this.workspace.id))
      let formOptions = []
      forms.forEach(form => {
        const option = { text: form.title, value: form.id }
        formOptions.push(option)
      })
      return formOptions
    },
    dateFields () {
      // List all the date fields on the data source
      let dateFields = []
      Object.values(this.dataSourceColumns).forEach(column => {
        if (column.type == 'date' || column.type == 'datetime') {
          dateFields.push({
            text: column.name,
            value: column.name
          })
        }
      })
      return dateFields
    }
  },
  methods: {
    ...mapWorkspaceActions,
    ...mapDashboardActions({
      setDashboard: SET_DASHBOARD
    }),
    /**
     * When a data source column is selected to be added as a dashboard header, this function is called
     *
     **/
    addColumn: function(column) {

      let extra = {}
      if (column.type == 'list') {
        extra['listId'] = column.extra.listId
      }

      // Map the data source column's properties on to the dashboard element
      this.activeDashboardElement = {
        text: humanizeDataSourceString(column.name),
        value: column.name,
        type: column.type,
        description: column.comment,
        extra: extra,
        databaseTable: column.databaseTable
      }

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
    /**
     * We use this to prevent setting non-direct data source columns to editable (like patient_data columns)
     */
    isActiveElementEditable() {
      if (this.activeDashboardElement &&
        this.activeDashboardElement.value != undefined) {
        const column = this.dataSourceColumns[this.activeDashboardElement.value]
        if (column != undefined &&
          column.databaseTable == '') {
          return true
        }
      }
      return false
    },
    /**
     * This function is called whenever the Multi-Range Picker is changed, so we update our duration model
     */
    onRangePickerChanged(model) {
      this.activeDashboard.durationModel = model
    },
    dashboardElementClicked(element) {
      this.$emit('dashboard-element-clicked', element)
      this.activeDashboardElement = element
      console.log(element)
      this.drawer = true
    },
    onConditionalLogicChanged(conditionalLogic) {
      // We use $set api here because the dashboard model may not have
      // a conditionalLogic key. This adds the key and makes it reactive,
      // so we trigger the 'dirty' watcher when it changes
      this.$set(this.activeDashboard, 'conditionalLogic', conditionalLogic);
      //this.activeDashboard.conditionalLogic = conditionalLogic
    },

    /**
     * Save the active element locally to data
     */
    storeActiveDashboardElement()
    {
      // if this is a newly added element, push it
      const found = this.activeDashboard.headers.find(header => {
        if (header.value == this.activeDashboardElement.value) {
          return true
        }
        return false
      })
      if(!found) {
        this.activeDashboard.headers.push(this.activeDashboardElement)
      }
      console.log('save clicked')
      this.drawer = false
    },
    deleteActiveDashboardElement() {
      let index = this.activeDashboard.headers.findIndex((e) => e.value==this.activeDashboardElement.value)

      if (index !== -1) {
        // remove the element from the headers
        this.activeDashboard.headers.splice(index, 1)
      }

      this.drawer = false
    }
  },
  mounted () {
    console.log('Dashboard Builder Mounted')
  }
}
</script>
<style scoped></style>
