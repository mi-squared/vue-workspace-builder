<template>
  <div class="dashboard">
      <v-data-table
        :headers="headers"
        :items="rows"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        item-key="id"
        show-expand
        show-group-by
        :custom-group="customGroup"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
      >

        <!-- This is the toolbar at the top of the table -->
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>{{ dashboard.title }} <span class="text--lighten-1">(#{{ dashboard.id }})</span></v-toolbar-title>

            <v-btn icon @click="reloadEntities">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn
              v-if="dashboard.displayNewButton"
              color="primary"
              outlined
              dark
              v-bind="attrs"
              @click="dialog = true"
              class="mr-2"
            >
              <v-icon class="mr-2">mdi-plus-circle-outline</v-icon>
              New
            </v-btn>

            <v-text-field
              placeholder="Search"
              dense
              prepend-inner-icon="mdi-magnify"
              class="mt-6 expanding-search"
            ></v-text-field>

            <v-btn icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-toolbar>

        </template>
        <!-- end of the tooolbar -->


        <!-- Header Row template - with column filters -->
        <!-- TODO implement column filters based on columns -->
<!--        <template v-slot:body.prepend>-->
<!--          &lt;!&ndash; Hide on screens smaller than "small" otherwise display as table-row &ndash;&gt;-->
<!--          <tr class='d-none d-sm-table-row'>-->

<!--            &lt;!&ndash;            If we are showing the Date Added to Board, then this is the first column &ndash;&gt;-->
<!--            <td>&nbsp;</td>-->
<!--            <td>-->
<!--              <v-text-field v-model="filters.firstName" type="text" label="First Name"></v-text-field>-->
<!--            </td>-->
<!--            <td>-->
<!--              <v-text-field v-model="filters.lastName" type="text" label="Last Name"></v-text-field>-->
<!--            </td>-->
<!--            <td>-->
<!--              <v-text-field v-model="filters.DOB" type="number" label="Less than"></v-text-field>-->
<!--            </td>-->
<!--            <td>-->
<!--              <v-select-->
<!--                :items="facilities"-->
<!--                item-text="title"-->
<!--                item-value="value"-->
<!--                v-model="filters.facility"-->
<!--                label="Facilities"-->
<!--              ></v-select>-->
<!--            </td>-->
<!--            <td>-->
<!--              <v-text-field v-model="filters.status" type="number" label="Less than"></v-text-field>-->
<!--            </td>-->
<!--            <td>-->
<!--              <v-text-field v-model="filters.completion" type="number" label="Exact number"></v-text-field>-->
<!--            </td>-->
<!--            <td>-->

<!--            </td>-->
<!--            <td>-->
<!--              <v-spacer></v-spacer>-->
<!--            </td>-->
<!--          </tr>-->
<!--        </template>-->
        <template v-slot:item.id="{ item }">
          <span style="font-size: 16px" class="mt-4 font-weight-light">#{{ item.id }}</span>
        </template>

        <!-- Display indicators -->
        <template v-slot:item.data-indicators="{ item }">

          <!-- This should check the last source, and display an icon if it exists, ie: the last dashboard -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-if="isSourceDashboard(item)"
                v-bind="attrs"
                v-on="on"
                class="d-inline"
              >mdi-table</v-icon>
            </template>
            <span>{{ dashboardSource(item) }}</span>
          </v-tooltip>

          <!-- now we check conditions to add indicators -->
<!--          <v-icon v-if="item.something == 'dsafdsfad'" class="d-inline" color="green">mdi-circle</v-icon>-->
<!--          <v-icon class="d-inline">mdi-circle</v-icon>-->
<!--          <v-icon class="d-inline">mdi-airplane</v-icon>-->
        </template>

        <!-- Display the created_datetime within a chip that indicates how old (attrition) the row is -->
        <template v-slot:item.moved_to_dashboard_date="{ item }">
          <v-chip
            :key="currentTimestamp"
            :color="getColor(item.moved_to_dashboard_date)"
            dark
          >
            <AppDate :timestamp="item.moved_to_dashboard_date"></AppDate>
          </v-chip>
        </template>

        <!-- This is what gets displayed when the "expand" icon is clicked -->
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            More info about {{ item }}
          </td>
        </template>

        <!--        <template v-for="slot in slots" v-slot:item.[slot.name]="props">-->
        <!--          <component :is="slot.component" :key="slot.key" :options="props"></component>-->
        <!--        </template>-->

        <!-- EditableTextField This renders our editable text elements -->
        <template v-for="slot in slots" v-slot:[slot.slotName]="props">
          <v-edit-dialog
            :key="slot.key"
            :return-value.sync="props.item[slot['fieldName']]"
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            {{ props.item[slot['fieldName']] }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item[slot['fieldName']]"
                :rules="[max25chars]"
                label="Edit"
                single-line
                counter
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>

        <!-- this renders the vertical elipsis, which triggers the action menu -->
        <template v-slot:item.data-menu="{ item }">
          <v-menu
            bottom
            left
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-table</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="text-h6">Move To Dashboard</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                v-for="(title, id) in dashboards"
                :key="id"
                link
                @click="moveToDashboard(item, id)"
              >
                <v-list-item-title>{{ title }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-domain</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="text-h6">Send To Workspace</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                v-for="(title, id) in workspaces"
                :key="id"
                link
              >
                <v-list-item-title>{{ title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

      </v-data-table>

      <!-- Form Dialog for NEW button-->
      <template>
        <v-row justify="center">
          <v-dialog
            v-model="dialog"
            persistent
            max-width="600px"
          >

            <v-card>
              <v-card-title>
                <span class="text-h5">New {{ this.entityTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <JsonForm
                    v-if="newEntityForm"
                    :form="newEntityForm"
                    :key="entityCreateKey"
                    :model="newEntityModel"
                    :schema="newEntityForm.schema"
                    :options="newEntityForm.options"
                    @changed="newEntityChanged"
                  ></JsonForm>
                  <v-alert v-else dark color="red">No Form Selected For New Entity</v-alert>
                </v-container>
                <small>*indicates required field</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="dialog = false"
                >
                  Close
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="saveNewEntity"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </template>
  </div>
</template>

<script>

import moment from 'moment-timezone'
import AppDate from '@/components/AppDate'
import JsonForm from '@/components/JsonForm'
import { newDashboardSourceDashboard } from '../model-builder'
import { createNamespacedHelpers } from 'vuex'

import { ALL_WORKSPACES, GET_DASHBOARDS } from '../store/types-workspace'

const { mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')

import { GET_LIST } from '../store/types-list'

const { mapGetters: mapListGetters } = createNamespacedHelpers('list')

import {
  CREATE_ENTITY,
  FETCH_DASHBOARD,
  FETCH_DASHBOARD_ROWS,
  GET_DASHBOARD,
  GET_DASHBOARD_ROWS, PUSH_ENTITY
} from '../store/types-dashboard'

const { mapGetters: mapDashboardGetters, mapActions: mapDashboardActions } = createNamespacedHelpers('dashboard')

import { GET_USER_META } from '../store/types-user'
const { mapGetters: mapUserGetters } = createNamespacedHelpers('user')

import { GET_FORM } from '../store/types-form'
const { mapGetters: mapFormGetters } = createNamespacedHelpers('form')

export default {
  name: 'Dashboard',
  props: {
    dashboard: {
      type: Object,
      required: true
    },
    preview: {
      type: Boolean,
      required: false
    }
  },
  components: {
    JsonForm,
    AppDate
  },
  data () {
    return {
      timeZone: '',
      newEntityModel: {},
      entityCreateKey: 0,
      loaded: false,
      isPreview: this.preview || false,
      skeletonLoaderAttrs: {
        class: 'mb-6',
        boilerplate: true,
        elevation: 2,
      },
      attrs: {},
      dialog: false,
      timer: '',
      currentTimestamp: '',
      expanded: [],
      singleExpand: false,
      slotName: 'item.name',
      endpoint: '',
      entityTitle: 'Referral',
      max25chars: v => v.length <= 25 || 'Input too long!',
      filters: {
        firstName: [],
        lastName: [],
        DOB: [],
        facility: [],
        status: [],
        completion: []
      },
      // these are the slots for the inline editable elements
      slotsOld: [
        {
          key: 1,
          slotName: 'item.firstName',
          fieldName: 'firstName',
          component: 'Text'
        }
      ],
      sortBy: 'moved_to_dashboard_date',
      sortDesc: true,
      idHeader: {
        "text": "ID",
        "value": "id",
        "groupable": false,
        "sortable": true
      },
      indicatorsHeader: {
        "text": "",
        "value": "data-indicators",
        "groupable": false,
        "sortable": false
      },
      expandHeader: {
        "text": "",
        "value": "data-table-expand",
        "groupable": false
      },
      actionHeader: {
        "text": "",
        "value": "data-menu",
        "sortable": false,
        "groupable": false
      }
    }
  },
  computed: {
    ...mapDashboardGetters({
      getDashboard: GET_DASHBOARD,
      getDashboardRows: GET_DASHBOARD_ROWS,
    }),
    ...mapUserGetters({
      getUserMeta: GET_USER_META
    }),
    ...mapWorkspaceGetters({
      allWorkspaces: ALL_WORKSPACES,
      getDashboards: GET_DASHBOARDS
    }),
    ...mapListGetters({
      getList: GET_LIST
    }),
    ...mapFormGetters({
      getForm: GET_FORM
    }),
    newEntityForm() {
      let form = null
      if (this.dashboard.newEntityFormId) {
        const formId = this.dashboard.newEntityFormId
        form =  this.getForm(formId)
      }

      return form
    },
    headers () {
      // We use spread operator to clone headers, otherwise we'd keep appending expand and action headers!
      let headers = [this.idHeader, this.indicatorsHeader, ...this.dashboard.headers]
      headers.push(this.expandHeader)
      headers.push(this.actionHeader)
      return headers
    },
    rows () {
      return this.getDashboardRows(this.dashboard.id)
    },
    /**
     * Get an array of text/value objects representing facilities
     *
     * @returns {*}
     */
    facilities () {
      return this.getList('facilities').data
    },
    workspaces () {
      // Dashboard model has workspaces = { { id: title }, { id: title } } format for workspaces
      const workspaces = this.dashboard.workspaces
      return workspaces
    },
    dashboards () {
      // Dashboard model has workspaces = { { id: title }, { id: title } } format for dashboards with ids as keys
      let dashboards = {}
      Object.keys(this.dashboard.dashboardsInWorkspace).forEach(id => {
        if (Number(id) != Number(this.dashboard.id)) {
          dashboards[id] = this.dashboard.dashboardsInWorkspace[id]
        }
      })
      return dashboards
    },
    slots () {
      // Get the slot data for displaying editable content based on the header definition
      let slots = []
      let keyCount = 0
      this.headers.forEach((header) => {
        if (header.editable === true) {
          if (header.type === 'Text') {
            slots.push({
              key: ++keyCount,
              slotName: 'item.' + header.value,
              fieldName: header.value,
              component: 'Text'
            })
          } else {
            // Fallback to Text component
            slots.push({
              key: ++keyCount,
              slotName: 'item.' + header.value,
              fieldName: header.value,
              component: 'Text'
            })
          }
        }
      })

      return slots
    }
  },
  methods: {
    ...mapDashboardActions({
      fetchDashboard: FETCH_DASHBOARD,
      fetchDashboardRows: FETCH_DASHBOARD_ROWS,
      createEntity: CREATE_ENTITY,
      pushEntity: PUSH_ENTITY
    }),
    save () {
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
    },
    cancel () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
    },
    reloadEntities () {
      let that = this
      this.fetchDashboardRows({ dashboardId: this.dashboard.id }).then(() => {
        that.loaded = true
        // start the counter that uses the current time to determine attrition
        that.refreshAttrition()
      })
    },
    saveNewEntity () {
      // Save the entity
      console.log("Saving New Entity: " + this.newEntityModel)
      let that = this
      this.createEntity({
        workspaceId: this.dashboard.workspaceId,
        dashboardId: this.dashboard.id,
        entity: this.newEntityModel
      }).then(() => {

        // TODO we shouldn't have to do this if the API returned the correctly formatted entity on the create endpoint
        that.reloadEntities()
        // Reset the model
        that.newEntityModel = {}
        that.entityCreateKey++

        that.dialog = false
      })

    },
    newEntityChanged(model) {
      this.newEntityModel = model
    },
    // sendToWorkspace(entity) {
    //
    // },
    isSourceDashboard(entity) {
      if (entity.source != undefined) {
        if (entity.source.type == 'dashboard') {
          return true
        }
      }
    },
    dashboardSource(entity) {
      if (entity.source != undefined &&
        entity.source.type != undefined &&
        entity.source.extra != undefined) {
        return "Moved from " + entity.source.type + " " + this.dashboards[entity.source.extra.dashboardId]
      }

      return ""
    },
    moveToDashboard(entity, dashboardId) {
      console.log("Moving Entity to dashboard: " + dashboardId)
      console.log(entity)
      // We need to update the source field with our data, then send it to API for persist
      let source = newDashboardSourceDashboard(this.dashboard.id)

      entity.source = source
      this.pushEntity({
        workspaceId: this.dashboard.workspaceId,
        dashboardId: dashboardId,
        entityId: entity.id,
        entity
      })
    },
    open () {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Dialog opened'
    },
    close () {
      console.log('Dialog closed')
    },
    getCurrentTimestamp () {
      return moment().tz(this.timeZone).format('X')
    },
    refreshAttrition: function () {
      setInterval(() => {
        this.currentTimestamp = this.getCurrentTimestamp()
      }, 1000)
    },
    cancelAutoUpdate () {
      clearInterval(this.timer)
    },
    getColor (timestamp) {
      let a = moment().tz(this.timeZone)
      let b = moment(timestamp).tz(this.timeZone)
      let seconds = a.diff(b, 'seconds')
      for (let i = 0; i < this.dashboard.durationModel.ranges.length; ++i) {
        const range = this.dashboard.durationModel.ranges[i]
        // Convert our ranges to seconds
        const minSeconds = moment.duration(range.range[0], this.dashboard.durationModel.units).asSeconds()
        // We add one to the max range before we convert so we make sure to cover the in-between
        // because the ranges are like 0-1, 2-5, 6-10 where the next min is one more than the previous max
        const maxSeconds = moment.duration(range.range[1] + 1, this.dashboard.durationModel.units).asSeconds()
        if (seconds >= minSeconds && seconds < maxSeconds) {
          return range.color
        }
      }
      return this.dashboard.durationModel.outOfRangeColor
    },
    customGroup (items, groupBy, groupDesc) {
      console.log(groupDesc)
      const key = groupBy[0]
      let groups = []
      let current
      for (var i = 0; i < items.length; i++) {
        const item = items[i]
        let val

        if (key == 'timestamp') {
          val = this.getColor(item['timestamp'])
        } else {
          val = item[key]
        }

        if (current !== val) {
          current = val
          groups.push({
            name: val ?? '',
            items: [],
          })
        }
        groups[groups.length - 1].items.push(item)
      }

      return groups
    }
  },
  mounted () {

    console.log("Dashboard Mounted")
    let that = this
    this.fetchDashboardRows({ dashboardId: this.dashboard.id }).then(() => {
      that.loaded = true
      // start the counter that uses the current time to determine attrition
      that.refreshAttrition()
    })
  },
  created () {
    // Init and Set up our timeZone in created hook so it doesn't trigger reactivity in computed properties like getColo()
    // that work with the timeZone data
    const userMeta = this.getUserMeta
    if (userMeta.timeZone != undefined && userMeta.timeZone) {
      this.timeZone = userMeta.timeZone
    } else {
      this.timeZone = 'America/New_York'
    }
  },
  destroyed () {
    this.cancelAutoUpdate()
  }
}
</script>

<style scoped>
.v-icon::before {
  display: inline;
}
</style>
