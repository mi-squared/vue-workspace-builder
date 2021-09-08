<template>
  <div id="dashboard">
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
            <v-toolbar-title>CET Triage Dashboard</v-toolbar-title>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
            <v-spacer></v-spacer>


            <v-spacer></v-spacer>

              <v-btn
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
              <v-icon>mdi-heart</v-icon>
            </v-btn>

            <v-switch
                v-model="singleExpand"
                label="Single expand"
                class="mt-6"
            ></v-switch>

            <v-btn icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-toolbar>

        </template>
        <!-- end of the tooolbar -->


        <!-- Header Row template - with column filters -->
        <template v-slot:body.prepend>
          <!-- Hide on screens smaller than "small" otherwise display as table-row -->
          <tr class='d-none d-sm-table-row'>

            <td>&nbsp;</td>
            <td>
              <v-text-field v-model="filters.firstName" type="text" label="First Name"></v-text-field>
            </td>
            <td>
              <v-text-field v-model="filters.lastName" type="text" label="Last Name"></v-text-field>
            </td>
            <td>
              <v-text-field v-model="filters.DOB" type="number" label="Less than"></v-text-field>
            </td>
            <td>
              <v-select
                  :items="facilities"
                  item-text="title"
                  item-value="value"
                  v-model="filters.facility"
                  label="Facilities"
              ></v-select>
            </td>
            <td>
              <v-text-field v-model="filters.status" type="number" label="Less than"></v-text-field>
            </td>
            <td>
              <v-text-field v-model="filters.completion" type="number" label="Exact number"></v-text-field>
            </td>
            <td>

            </td>
            <td>
              <v-spacer></v-spacer>
            </td>
          </tr>
        </template>

        <!-- Display the created_datetime within a chip that indicates how old (attrition) the row is -->
        <template v-slot:item.created_datetime="{ item }">
          <v-chip
              :key="currentTimestamp"
              :color="getColor(item.created_datetime)"
              dark
          >
            <AppDate :timestamp="item.created_datetime"></AppDate>
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
              <v-list-item><v-list-item-title>Move To Workspace</v-list-item-title></v-list-item>
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

      <!-- FOrm Dialog -->
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
                  <JsonForm></JsonForm>
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
                    @click="dialog = false"
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
import AppDate from "@/components/AppDate"
import JsonForm from "@/components/JsonForm"

export default {
  name: 'PageDashboard',
  components: {
    JsonForm,

    AppDate

  },
  computed: {
    facilities () {
        return this.$store.getters.dashboardLists.facilities
    },
    workspaces () {
        return this.$store.getters.dashboardLists.workspaces
    },
    headers () {
        return this.$store.getters.dashboardHeaders
    },
    rows () {
        return this.$store.getters.dashboardRows
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
  data () {
    return {
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
      attrition: [
        {
          title: 'New',
          color:'green',
          low: {
            value: 0,
            units: 'days'
          },
          high: {
            value: 2,
            units: 'days'
          },
        },
        {
          title: 'Needs Attention',
          color:'red',
          low: {
            value: 61,
            units: 'minutes'
          },
          high: {
            value: 200,
            units: 'minutes'
          },
        },
        {
          title: 'Stale',
          color:'yellow',
          low: {
            value: 201,
            units: 'minutes'
          },
          high: {
            value: 500,
            units: 'minutes'
          },
        },
      ],
    }
  },
  created () {
      // start the counter that uses the current time to determine attrition
      this.refreshAttrition();
  },
  methods: {

    save() {
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
    },
    cancel() {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
    },
    open() {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Dialog opened'
    },
    close() {
      console.log('Dialog closed')
    },
    getCurrentTimestamp () {
      return moment().format('X')
    },
    refreshAttrition: function () {
      setInterval(() => {
        this.currentTimestamp = this.getCurrentTimestamp()
      }, 1000);
    },
    cancelAutoUpdate() {
      clearInterval(this.timer);
    },
    getColor(timestamp) {
      let a = moment()
      let b = moment(timestamp, 'X');
      let seconds = a.diff(b, 'seconds')
      for (const attr in this.attrition) {
        // Convert our ranges to seconds
        const minSeconds = moment.duration(this.attrition[attr].low.value, this.attrition[attr].low.units).asSeconds();
        const maxSeconds = moment.duration(this.attrition[attr].high.value, this.attrition[attr].high.units).asSeconds();
        if (seconds > minSeconds && seconds <= maxSeconds) {
          return this.attrition[attr].color
        }
      }
      return 'dark'
    },
    customGroup(items, groupBy, groupDesc) {
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
  destroyed () {
    this.cancelAutoUpdate();
  }
}
</script>

<style>

</style>
