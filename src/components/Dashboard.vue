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
      >

        <!-- This is the toolbar at the top of the table -->
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>{{ dashboard.title }}</v-toolbar-title>
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
        <template v-slot:item.data-menu>
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
                <v-list-item-title>Move To Workspace</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                v-for="(item, i) in workspaces"
                :key="i"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
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

import moment from 'moment'
import AppDate from '@/components/AppDate'
import JsonForm from '@/components/JsonForm'
import { createNamespacedHelpers } from 'vuex'

import { ALL_WORKSPACES } from '../store/types-workspace'

const { mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')

import { GET_LIST } from '../store/types-list'

const { mapGetters: mapListGetters } = createNamespacedHelpers('list')

import {
  CREATE_ENTITY,
  FETCH_DASHBOARD,
  FETCH_DASHBOARD_ROWS,
  GET_DASHBOARD,
  GET_DASHBOARD_ROWS
} from '../store/types-dashboard'

const { mapGetters: mapDashboardGetters, mapActions: mapDashboardActions } = createNamespacedHelpers('dashboard')

import { INIT } from '../store/types-user'
const { mapActions: mapUserActions } = createNamespacedHelpers('user')

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
      newEntityModel: {},
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
    }
  },
  computed: {
    ...mapDashboardGetters({
      getDashboard: GET_DASHBOARD,
      getDashboardRows: GET_DASHBOARD_ROWS
    }),
    ...mapWorkspaceGetters({
      allWorkspaces: ALL_WORKSPACES
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
      return this.dashboard.headers
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
      return Object.values(this.allWorkspaces)
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
      createEntity: CREATE_ENTITY
    }),
    ...mapUserActions({
      initUser: INIT
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
    saveNewEntity () {
      // Save the entity
      console.log("Saving New Entity: " + this.newEntityModel)
      this.createEntity({
        workspaceId: this.dashboard.workspaceId,
        dashboardId: this.dashboard.id,
        entity: this.newEntityModel
      })
      this.dialog = false
    },
    newEntityChanged(model) {
      this.newEntityModel = model
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
      return moment().format('X')
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
      let a = moment()
      let b = moment(timestamp)
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
  destroyed () {
    this.cancelAutoUpdate()
  }
}
</script>

<style>

</style>
