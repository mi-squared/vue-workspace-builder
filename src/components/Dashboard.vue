<template>
  <div class="dashboard">
      <v-data-table
        :headers="headers"
        :items="rows"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        :options.sync="paginationOptions"
        :server-items-length="totalEntities"
        :loading="loading"
        item-key="id"
        :custom-group="customGroup"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        fixed-header
        height="720px"
      >

        <!-- This is the toolbar at the top of the table -->
        <template v-slot:top>
          <v-toolbar flat color="grey lighten-5">
            <v-toolbar-title>{{ dashboard.title }} <span class="text--lighten-1">(#{{ dashboard.id }})</span></v-toolbar-title>

            <v-btn icon @click="loadEntitiesApi">
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
              v-model="globalSearch"
            ></v-text-field>

            <DashboardFilters
              :dashboard="dashboard"
              :filter="filter"
              :listOptions="listOptions"
              @change="onFilterChanged"
            ></DashboardFilters>

            <v-switch
              class="mt-4"
              v-model="showArchives"
              label="Show Archives"
            >
            </v-switch>

            <v-chip>{{ clocktime }}</v-chip>

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
        <template v-slot:item="{ expand, index, item, isExpanded, isMobile, isSelected, select, headers }">
          <tr>
            <td v-for="(header, colIndex) in headers" :key="colIndex">

              <div v-if="header.value == 'id'">

                <!-- display the "main" form as full screen -->
                <v-dialog
                  v-model="mainFormDialogs[item.id]"
                  fullscreen
                  hide-overlay
                >
                  <template v-slot:activator="{ on, attrsMainForm }">
                    <a
                      class="mt-4 text-body-2 font-weight-light"
                      v-bind="attrsMainForm" v-on="on"
                    >
                      #{{ item.id }}
                    </a>
                  </template>
                  <v-card>
                    <v-toolbar
                      dark
                      color="primary"
                    >
                      <v-toolbar-title>{{ item.fname }} {{ item.lname }}</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn
                        icon
                        dark
                        @click="mainFormDialogs[item.id] = false"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-container v-if="mainForm != null">
                      <v-card flat width="100%">
                        <v-card-text>
                          <JsonForm
                            :key="item.id"
                            :form="mainForm"
                            :model="item"
                            :schema="mainForm.schema"
                            :options="mainForm.options"
                            :pid="Number(item.pid)"
                            :patient="item"
                            @changed="newEntityChanged"
                          ></JsonForm>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="blue darken-1"
                            text
                            @click="mainFormDialogs[item.id] = false"
                          >
                            Close
                          </v-btn>
                          <v-btn
                            color="blue darken-1"
                            text
                            @click=onMainFormEntitySaved(item)
                          >
                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-container>
                    <v-container v-else>
                      <v-alert>No Main Form Selected for this dashboard</v-alert>
                    </v-container>
                  </v-card>
                </v-dialog>
              </div>

              <div v-else-if="header.value == 'pid'">
                <a
                  v-if="item.pid"
                  class="mt-4"
                  @click="loadPatient(item)"
                >
                  <div>{{ item.fname }} {{ item.lname }}</div>
                  <div class="text-body-2 font-weight-light">(#{{ item.pubpid }})</div>

                </a>
                <span v-else>???</span>
              </div>

              <!-- Display the created_datetime within a chip that indicates how old (attrition) the row is -->
              <div v-else-if="header.value == 'moved_to_dashboard_date'">
                <v-chip
                  :key="currentTimestamp.unix()"
                  :color="getColor(item)"
                  dark
                >
                  <AppDate :timestamp="item.moved_to_dashboard_date" :timezone="timeZone"></AppDate>
                </v-chip>

              </div>

              <!-- Indicators -->
              <div v-else-if="header.value == 'data-indicators'">

                <v-tooltip
                  v-for="(indicator, index) in conditionalLogicIndicators(item)"
                  :key="index"
                  bottom
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      v-bind="attrs"
                      v-on="on"
                      :color="indicator.color"
                      class="d-inline"
                    >{{ indicator.icon }}</v-icon>
                  </template>
                  <span>{{ indicator.note }}</span>
                </v-tooltip>

                <!-- if this is an archived entity, show an indicator -->
                <v-icon
                  v-if="item.archived == 1"
                  class="d-inline"
                >mdi-archive</v-icon>

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

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      v-if="isSourceWorkspace(item)"
                      v-bind="attrs"
                      v-on="on"
                      :color="workspaceColor(item.source.extra.workspaceId)"
                      class="d-inline"
                    >mdi-bank-transfer-in</v-icon>
                  </template>
                  <span>{{ workspaceSource(item) }}</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      v-if="item.source != null && item.source.type == 'sentToWorkspace'"
                      v-bind="attrs"
                      v-on="on"
                      :color="workspaceColor(item.source.extra.workspaceId)"
                      class="d-inline"
                    >mdi-bank-transfer-out</v-icon>
                  </template>
                  <span>{{ workspaceSource(item) }}</span>
                </v-tooltip>

                <!-- now we check conditions to add indicators -->
                <!--          <v-icon v-if="item.something == 'dsafdsfad'" class="d-inline" color="green">mdi-circle</v-icon>-->
                <!--          <v-icon class="d-inline">mdi-circle</v-icon>-->
                <!--          <v-icon class="d-inline">mdi-airplane</v-icon>-->
              </div>

              <!-- The source column on it's own displays the source data -->
              <div v-else-if="header.value == 'source'">
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
              </div>


              <div v-else-if="header.value == 'data-notes'">
                <table>
                  <tr>
                      <td colspan="2" class="py-0 px-1 text-caption">
                        {{ lastNoteText(item) }}
                      </td>
                  </tr>
                </table>
                <table>
                  <tr>
                      <td class="py-0 px-1">
                        <DashboardNoteButton
                          :entity="item" @save="onNoteSaved"
                        >
                        </DashboardNoteButton>
                      </td>
                      <td class="py-0 px-1">

                        <v-btn icon @click="expand(!isExpanded)">
                          <v-badge
                            :content="getNotesByEntityId(item.id).length"
                            :value="getNotesByEntityId(item.id).length"
                            color="green"
                            overlap
                          >
                          <v-icon>
                            {{ isExpanded ? 'mdi-email-multiple-outline' : 'mdi-email-multiple' }}
                          </v-icon>
                          </v-badge>
                        </v-btn>
                      </td>
                  </tr>
                </table>
              </div>

              <!-- this renders the vertical elipsis, which triggers the action menu -->
              <div v-else-if="header.value == 'data-menu'">
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

                  <v-toolbar dense flat>
                    <v-toolbar-title>#{{ item.id }}</v-toolbar-title>
                    <v-toolbar-items>

<!--   TODO gmail indicator goes here                   <v-btn icon>-->
<!--                        <v-icon>mdi-gmail</v-icon>-->
<!--                      </v-btn>-->

                      <v-btn
                        icon
                        @click="archiveEntity(item)"
                      >
                        <v-icon>mdi-archive</v-icon>
                      </v-btn>

                    </v-toolbar-items>
                  </v-toolbar>

                  <v-divider></v-divider>

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
                      @click="sendToWorkspace(item, id)"
                    >
                      <v-list-item-title>{{ title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>

              <!-- Render form inputs for our editable elements -->
              <div v-else-if="header.editable == true">

                <div v-if="header.type == 'list'">
                  <v-tooltip :key="item.id + '-list-tooltip'" bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-autocomplete
                        v-bind="attrs"
                        v-on="on"
                        dense
                        :key="item.id"
                        v-model="item[header.value]"
                        :items="listOptionsForItem(header)"
                        @input="onEntityChanged(item)"
                      >
                      </v-autocomplete>
                    </template>
                    <span>{{ item[header.value] }}</span>
                  </v-tooltip>
                </div>

                <div v-if="header.type == 'user'">
                  <v-tooltip :key="item.id + '-user-tooltip'" bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-autocomplete
                        v-bind="attrs"
                        v-on="on"
                        dense
                        :key="item.id"
                        v-model="item[header.value]"
                        :items="activeUsersList"
                        @input="onEntityChanged(item)"
                      >
                      </v-autocomplete>
                    </template>
                    <span>{{ item[header.value] }}</span>
                  </v-tooltip>
                </div>

                <div v-if="header.type == 'string'">
                  <EditableString :key="item.id" :entity="item" :index="header.value" @save="onEntityChanged"></EditableString>
                </div>

                <div v-if="header.type == 'datetime'">

                  <DatetimePicker
                    v-model="item[header.value]"
                    timeFormat="HH:mm"
                    dateFormat="MM/dd/yyyy"
                    @input="onEntityChanged(item)"
                  >
                    <v-icon slot="dateIcon">mdi-calendar</v-icon>
                    <v-icon slot="timeIcon">mdi-clock</v-icon>
                  </DatetimePicker>
                </div>

                <div v-if="header.type == 'date'">

                  <v-menu
                    :ref="header.value"
                    v-model="menus[header.value + item.id]"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        :value="formatDate(item[header.value])"
                        v-bind="attrs"
                        @blur="item[header.value] = parseDate(item[header.value])"
                        v-on="on"
                        class="mt-4"
                        style="font-size: smaller;"
                      >
                        <v-icon slot="prepend-inner" small>mdi-calendar</v-icon>
                      </v-text-field>
                    </template>
                    <v-date-picker
                      v-model="item[header.value]"
                      no-title
                      @input="onEntityChanged(item)"
                    >
                    </v-date-picker>
                  </v-menu>
                </div>
              </div>

              <!-- NOT EDITABLE, JUST FORMAT -->

              <div v-else-if="header.type == 'date'">
                {{ formatDate(item[header.value]) }}
              </div>

              <!-- As a fallback, just display the value -->
              <div v-else>
                {{ item[header.value] }}
              </div>

            </td>
          </tr>


        </template>


        <!-- This is what gets displayed when the "expand" icon is clicked -->
        <template v-slot:expanded-item="{ headers, item }">
          <tr>
            <td :colspan="headers.length">
              <!-- pass in entity ID for key-->
              <NoteHistory :entity="item" :key="item.id" :activeUsersList="activeUsersList"></NoteHistory>

<!--              More info about {{ item }}-->
            </td>
          </tr>
        </template>

        <!--        <template v-for="slot in slots" v-slot:item.[slot.name]="props">-->
        <!--          <component :is="slot.component" :key="slot.key" :options="props"></component>-->
        <!--        </template>-->

        <!-- EditableTextField This renders our editable text elements -->
<!--        <template v-for="slot in slots" v-slot:[slot.slotName]="props">-->
<!--          <v-edit-dialog-->
<!--            :key="slot.key"-->
<!--            :return-value.sync="props.item[slot['fieldName']]"-->
<!--            @save="save"-->
<!--            @cancel="cancel"-->
<!--            @open="open"-->
<!--            @close="close"-->
<!--          >-->
<!--            {{ props.item[slot['fieldName']] }}-->
<!--            <template v-slot:input>-->
<!--              <v-text-field-->
<!--                v-model="props.item[slot['fieldName']]"-->
<!--                :rules="[max25chars]"-->
<!--                label="Edit"-->
<!--                single-line-->
<!--                counter-->
<!--              ></v-text-field>-->
<!--            </template>-->
<!--          </v-edit-dialog>-->
<!--        </template>-->


      </v-data-table>

      <!-- Form Dialog for NEW button-->
      <template>
        <v-row justify="center">
          <v-dialog
            v-model="dialog"
            persistent
            max-width="800px"
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
      <v-snackbar
        v-model="snackbar"
      >
        {{ snackbarText }}

        <template v-slot:action="{ attrs }">
          <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>

  </div>
</template>

<script>

import moment from 'moment-timezone'
import AppDate from '@/components/AppDate'
import JsonForm from '@/components/JsonForm'
import { newDashboardSourceDashboard, newDashboardSourceWorkspace } from '../model-builder'
import { createNamespacedHelpers } from 'vuex'

import { ALL_WORKSPACES, FETCH_ALL_WORKSPACES, GET_DASHBOARDS, GET_WORKSPACE } from '../store/types-workspace'

const { mapGetters: mapWorkspaceGetters, mapActions: mapWorkspaceActions } = createNamespacedHelpers('workspace')

import { FETCH_LISTS_WITH_DATA_BULK, GET_LIST } from '../store/types-list'

const { mapGetters: mapListGetters, mapActions: mapListActions } = createNamespacedHelpers('list')

import {
  ADD_NOTE,
  CREATE_ENTITY,
  FETCH_DASHBOARD,
  FETCH_DASHBOARD_ROWS, FETCH_ENTITIES,
  GET_DASHBOARD,
  GET_DASHBOARD_ROWS, GET_ENTITY_BY_ID, GET_NOTES_BY_ENTITY_ID, PUSH_ENTITY
} from '../store/types-dashboard'

const { mapGetters: mapDashboardGetters, mapActions: mapDashboardActions } = createNamespacedHelpers('dashboard')

import { GET_USER_META } from '../store/types-user'
const { mapGetters: mapUserGetters } = createNamespacedHelpers('user')

import { GET_FORM } from '../store/types-form'
import DashboardNoteButton from './DashboardNoteButton'
import NoteHistory from './NoteHistory'
const { mapGetters: mapFormGetters } = createNamespacedHelpers('form')
import { formatDate, formatDatetime } from '../display-helpers'
import { MixinLogicEvaluator } from '../mixin-logic-evaluator'
import { setOpenEmrPatient } from '../api'
import DatetimePicker from './DatetimePicker'
import EditableString from './EditableString'
import DashboardFilters from './DashboardFilters'

export default {
  name: 'Dashboard',
  mixins: [MixinLogicEvaluator],
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
    DashboardFilters,
    EditableString,
    DatetimePicker,
    NoteHistory,
    DashboardNoteButton,
    JsonForm,
    AppDate,
  },
  data () {
    return {
      timeZone: '',
      paginationOptions: {},
      listOptions: {}, // Stores the options for select lists fetched from API
      globalSearch: '',
      totalEntities: 0,
      entities: {},
      orderedEntities: [],
      newEntityModel: {},
      newPatientModel: {},
      mainFormDialogs: {},
      menus: {}, // v-models for the date picker dialogs, etc indexed by header.value
      formattedEntityValues: {}, // v-models for our formatted values like dates
      entityCreateKey: 0,
      loaded: false,
      snackbar: false,
      snackbarText: '',
      showArchives: false,
      isPreview: this.preview || false,
      skeletonLoaderAttrs: {
        class: 'mb-6',
        boilerplate: true,
        elevation: 2,
      },
      attrs: {},
      attrsMainForm: {},
      dialog: false,
      timer: '',
      updateTimer: '',
      currentTimestamp: null,
      expanded: [],
      singleExpand: false,
      entityTitle: 'Referral',
      max25chars: v => v.length <= 25 || 'Input too long!',
      // This is the filter containing conditions for sending to server
      filter: {
        conditions: [],
      },
      // these are the slots for the inline editable elements
      sortBy: 'moved_to_dashboard_date',
      sortDesc: true,
      // These are headers that are added by default
      idHeader: {
        "text": "ID",
        "value": "id",
        "groupable": false,
        "sortable": true,
      },
      indicatorsHeader: {
        "text": "",
        "value": "data-indicators",
        "groupable": false,
        "sortable": false,
      },
      noteHeader: {
        "text": "",
        "value": "data-notes",
        "groupable": false,
        "sortable": false,
        "width": "120px"
      },
      actionHeader: {
        "text": "",
        "value": "data-menu",
        "sortable": false,
        "groupable": false
      }
    }
  },
  watch: {
    paginationOptions: {
      handler () {
        this.loadEntitiesApi()
      },
      deep: true,
    },
    showArchives: {
      handler () {
        this.loadEntitiesApi()
      },
      deep: true,
    },
    globalSearch: {
      handler () {
        this.loadEntitiesApi()
      },
      deep: true,
    },
  },
  computed: {
    ...mapDashboardGetters({
      getDashboard: GET_DASHBOARD,
      getDashboardRows: GET_DASHBOARD_ROWS,
      getEntityById: GET_ENTITY_BY_ID,
      getNotesByEntityId: GET_NOTES_BY_ENTITY_ID
    }),
    ...mapUserGetters({
      getUserMeta: GET_USER_META
    }),
    ...mapWorkspaceGetters({
      allWorkspaces: ALL_WORKSPACES,
      getDashboards: GET_DASHBOARDS,
      getWorkspaceById: GET_WORKSPACE
    }),
    ...mapListGetters({
      getList: GET_LIST
    }),
    ...mapFormGetters({
      getForm: GET_FORM
    }),
    activeUsersList () {
      if (this.listOptions['active_users'] != undefined) {
        return this.listOptions['active_users'].data
      }
      return []
    },
    newEntityForm() {
      let form = null
      if (this.dashboard.newEntityFormId) {
        const formId = this.dashboard.newEntityFormId
        form =  this.getForm(formId)
      }

      return form
    },
    mainForm() {
      let form = null
      if (this.dashboard.mainFormId) {
        const formId = this.dashboard.mainFormId
        form =  this.getForm(formId)
      }

      return form
    },
    headers () {
      // We use spread operator to clone headers, otherwise we'd keep appending expand and action headers!
      let headers = [
        this.idHeader,
        this.indicatorsHeader,
        ...this.dashboard.headers
      ]
      headers.push(this.noteHeader)
      // headers.push(this.expandHeader) we removed the header definition for expand, and removed show-expand from data table definition
      headers.push(this.actionHeader)
      return headers
    },
    rows () {
      return this.orderedEntities.map(entityId => {
        return this.getEntityById(entityId)
      })
    },
    loading () {
      return !this.loaded
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
      let workspaces = {}
      Object.keys(this.dashboard.workspaces).forEach(id => {
        if (Number(id) != Number(this.dashboard.workspaceId)) {
          workspaces[id] = this.dashboard.workspaces[id]
        }
      })
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
    clocktime() {
      let m = this.currentTimestamp
      return m.tz(this.timeZone).format("MM/DD/YYYY HH:mm:ss")
    }
  },
  methods: {
    ...mapWorkspaceActions({
      fetchAllWorkspaces: FETCH_ALL_WORKSPACES
    }),
    ...mapDashboardActions({
      fetchDashboard: FETCH_DASHBOARD,
      fetchDashboardRows: FETCH_DASHBOARD_ROWS,
      fetchEntities: FETCH_ENTITIES,
      createEntity: CREATE_ENTITY,
      pushEntity: PUSH_ENTITY,
      addNote: ADD_NOTE
    }),
    ...mapListActions({
      fetchListsBulk: FETCH_LISTS_WITH_DATA_BULK
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
    onFilterChanged (filter) {
      // Need to send a new request to server and reload results with new filter
      // TODO
      console.log(filter)
      this.filter = filter
      this.loadEntitiesApi()
    },
    formatDate (date) {
      if (date == null) return ''
      // Use the format date display helper to format dates
      return formatDate(date)
    },
    parseDate (date) {
      // parse date back to mysql
      return moment(date).format('YYYY-MM-DD')
    },
    formatDatetime (datetime) {
      // Use the format date display helper to format dates
      return formatDatetime(datetime)
    },
    parseDatetime (datetime) {
      // parse date back to mysql
      return moment(datetime).format('YYYY-MM-DD HH:mm')
    },
    loadPatient (entity) {
      // Load the OpenEMR patient in a new OpenEMR tab
      setOpenEmrPatient(entity.pid)
    },
    listOptionsForItem (header) {
      // Using the list ID for this header, return the options
      if (header.extra.listId != undefined) {
        if (this.listOptions[header.extra.listId] != undefined) {
          return this.listOptions[header.extra.listId].data
        } else {
          console.log("ERROR no list data for header: " + header.value)
        }
      } else {
        console.log("ERROR no list Id for header: " + header.value)
        return []
      }
    },
    saveNewEntity () {
      // Save the entity
      console.log("Saving New Entity: " + this.newEntityModel)

      let that = this
      this.createEntity({
        workspaceId: this.dashboard.workspaceId,
        dashboardId: this.dashboard.id,
        entity: this.newEntityModel,
        patient: this.newPatientModel
      }).then(() => {

        // TODO we shouldn't have to do this if the API returned the correctly formatted entity on the create endpoint
        that.loadEntitiesApi()
        // Reset the model
        that.newEntityModel = {}
        that.newPatientModel = {}
        that.entityCreateKey++

        that.dialog = false
      })

    },
    newEntityChanged({ model, patient }) {
      this.newEntityModel = model
      this.newPatientModel = patient
    },
    onMainFormEntitySaved(entity) {
      // When save button is clicked on main form, we call this, grab the entity model we were using to store data,
      // and then call the onEntityChanged to persist data
      const updatedEntity = {
        ...entity,
        ...this.newEntityModel
      }
      this.onEntityChanged(updatedEntity)
    },
    onNoteSaved(payload) {
      console.log("note saved with text:" + payload.text)
      this.addNote({
        workspaceId: this.dashboard.workspaceId,
        dashboardId: this.dashboard.id,
        entityId: payload.entity.id,
        pid: payload.entity.pid,
        text: payload.text
      })
    },
    lastNoteText(entity) {
      const notes = this.getNotesByEntityId(entity.id)
      if (notes.length > 0) {
        const noteText = notes[notes.length - 1].text
        if (noteText.length > 60) {
          return noteText.substring(0, 60) + ' ...'
        } else {
          return noteText
        }
      } else {
        return ''
      }
    },
    conditionalLogicIndicators(entity) {
      // Evaluate conditional logic and get indicators
      let indicators = []
      if (this.dashboard.hasConditionalLogic) {
        this.dashboard.conditionalLogic.rules.forEach(rule => {

          const performAction = this.evaluateRule(rule, entity, {});
          if (performAction) {
            if (rule.action.name == 'Add Row Indicator') {
              // console.log("Evaluating indicator for entity: " + entity.id)
              indicators.push(rule.action.actionData)
            } else if (rule.action.name == 'Move to Dashboard') {
              if (rule.action.actionData.dashboardId != undefined) {
                this.moveToDashboard(entity, rule.action.actionData.dashboardId)
              }
            }
          }
        })
      }
      return indicators
    },
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
    isSourceWorkspace(entity) {
      if (entity.source != undefined) {
        if (entity.source.type == 'workspace') {
          return true
        }
      }
    },
    workspaceSource(entity) {
      if (entity.source != undefined &&
        entity.source.type != undefined &&
        entity.source.extra != undefined) {
        let text = ""
        if (entity.source.type == 'sentToWorkspace') {
          text = text + "Sent to workspace "
        } else {
          text = text + "Sent from workspace "
        }
        const workspaceTitle = this.dashboard.workspaces[entity.source.extra.workspaceId]
        if (workspaceTitle == undefined) {
          console.log("ERROR: we don't have a title for workspace: " + entity.source.extra.workspaceId  )
        }
        return text + workspaceTitle
      }

      return ""
    },
    workspaceColor(workspaceId)
    {
      if (workspaceId) {
        const workspace = this.getWorkspaceById(workspaceId)
        if (workspace != undefined && workspace.color != undefined) {
          return workspace.color
        }
      }

      return ''
    },
    removeEntityFromDashboard(entity) {
      // We want to remove the entity row from the table before VUEX mutates it, so let's remove it first
      let movedEntityIndex = this.orderedEntities.findIndex(entityId => {
        if (entity.id == entityId) {
          return true
        } else {
          return false
        }
      })
      this.orderedEntities.splice(movedEntityIndex, 1)
    },
    onEntityChanged(entity) {
      // Let the user know we're doing something
      this.loaded = false

      if (this.dashboard.hasConditionalLogic) {
        this.dashboard.conditionalLogic.rules.forEach(rule => {

          const performAction = this.evaluateRule(rule, entity, {});
          if (performAction) {
            if (rule.action.name == 'Archive') {
              this.removeEntityFromDashboard(entity)
              entity.archived = 1
              this.snackbarText = "Entity #" + entity.id + " Was archived [Conditional Logic Action]"
              this.snackbar = true
            }
          }
        })
      }

      // send the udpated entity to the server
      this.pushEntity({
        workspaceId: this.dashboard.workspaceId,
        dashboardId: this.dashboard.id,
        entityId: entity.id,
        entity
      }).then(() => {
        this.loaded = true
        this.loadEntitiesApi()
      })
    },
    archiveEntity(entity) {
      // Let the user know we're doing something
      this.loaded = false

      // We want to remove the entity row from the table before VUEX mutates it, so let's remove it first
      this.removeEntityFromDashboard(entity)

      entity.archived = 1

      // Now use our vuex action to push the entity via API, when we callback, reload the entities
      this.pushEntity({
        workspaceId: this.dashboard.workspaceId,
        dashboardId: this.dashboard.id,
        entityId: entity.id,
        entity
      }).then(() => {
        this.loaded = true
        //this.loadEntitiesApi()
      })
    },
    moveToDashboard(entity, dashboardId) {
      console.log("Moving Entity to dashboard: " + dashboardId)
      console.log(entity)

      // Let the user know we're doing something
      this.loaded = false

      // We want to remove the entity row from the table before VUEX mutates it, so let's remove it first
      this.removeEntityFromDashboard(entity)

      // We need to update the source field with our data, then send it to API for persist
      let source = newDashboardSourceDashboard(this.dashboard.id)
      entity.source = source

      // Now use our vuex action to create the push the update via API, when callback load data
      this.pushEntity({
        workspaceId: this.dashboard.workspaceId,
        dashboardId: dashboardId,
        entityId: entity.id,
        entity
      }).then(() => {
        this.loaded = true
        //this.loadEntitiesApi()
      })
    },
    sendToWorkspace(entity, workspaceId) {
      console.log("Sending Entity to workspace: " + workspaceId)

      const targetWorkspace = this.getWorkspaceById(workspaceId)

      if (targetWorkspace.defaultDashboard != undefined &&
        targetWorkspace.defaultDashboard > 0) {
        const defaultDashboardId = targetWorkspace.defaultDashboard

        // TODO this should be refactored into a more generic event/meta system where we track events that
        // occur in the meta table, or in a giant JSON
        entity.source = {
          ...entity.source,
          type: 'sentToWorkspace',
          workspaceId: workspaceId,
          extra: {
            workspaceId: workspaceId,
          }
        }

        this.onEntityChanged(entity)

        // We're going to clone this entity and modify the clone so we don't mess this one up.
        let newEntity = { ...entity }

        // We need to update the source field with our data, then send it to API for persist
        let source = newDashboardSourceWorkspace(this.dashboard.workspaceId, this.dashboard.id)
        newEntity.source = source

        // Here's a trick, since this entity is already created, and we need to create it on a new
        // workspace, we need to unset the id property
        delete newEntity.id

        // Now use our vuex action to create the entity via API, when callback show our snack
        // The service on the API side is smart enough to toss the fields that don't apply to the new workspace
        this.createEntity({
          workspaceId: workspaceId,
          dashboardId: defaultDashboardId,
          entity: newEntity,
          patient: null // We don't send the patient, because there should already be an existing PID in the entity
        }).then(() => {
          this.snackbarText = "Successfully Sent to Workspace " + this.workspaces[workspaceId]
          this.snackbar = true
        })
      } else {
        this.snackbarText = "ERROR: Workspace " + this.workspaces[workspaceId] + " doesn't have a default dashboard."
        this.snackbar = true
      }
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
      // Get the current timestamp
      return moment()
    },
    refreshAttrition: function () {
      this.timer = setInterval(() => {
        this.currentTimestamp = this.getCurrentTimestamp()
        //this.loadEntitiesApi()
      }, 1000)

      this.updateTimer = setInterval(() => {
        this.loadEntitiesApi(false)
      }, 5000)
    },
    cancelAutoUpdate () {
      clearInterval(this.updateTimer)
      clearInterval(this.timer)
    },
    getColor (entity) {
      // We need to calculate "now" based on the system timezone so our diff relative to the timestamp is correct
      let moved_to_dashboard_date = entity.moved_to_dashboard_date
      let a = moment().tz(this.timeZone)
      let b = moment.tz(moved_to_dashboard_date, this.timeZone)
      let minutes = a.diff(b, 'minutes')
      for (let i = 0; i < this.dashboard.durationModel.ranges.length; ++i) {
        const range = this.dashboard.durationModel.ranges[i]
        // Convert our ranges to seconds
        const minMinutes = moment.duration(range.range[0], this.dashboard.durationModel.units).asMinutes()
        // We add one to the max range before we convert so we make sure to cover the in-between
        // because the ranges are like 0-1, 2-5, 6-10 where the next min is one more than the previous max
        const maxMinutes = moment.duration(range.range[1] + 1, this.dashboard.durationModel.units).asMinutes()
        if (minutes >= minMinutes && minutes < maxMinutes) {
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
          val = this.getColor(item)
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
    },
    loadEntitiesApi (showLoader = true) {
      let that = this
      if (showLoader) {
        this.loaded = false;
      }
      this.fetchEntities({
        dashboardId: this.dashboard.id,
        dashboardFilterEnabled: true,
        archivedFilterEnabled: this.showArchives,
        search: this.globalSearch,
        filter: this.filter,
        paginationOptions: this.paginationOptions,
      }).then((response) => {
        this.totalEntities = Number(response.total)
        this.entities = response.entities
        this.orderedEntities = response.orderedEntities
        that.loaded = true
        // // start the counter that uses the current time to determine attrition
        // that.refreshAttrition()
      })
    },
  },
  mounted () {
    console.log("Dashboard Mounted")
    //this.loadEntitiesApi();

    // fetch all workspaces
    this.fetchAllWorkspaces().then(() => {
      // Push all of the listIds of lists required for this form into an array, and fetch them all
      let listIdsForFetch = ['active_users']
      this.dashboard.headers.forEach(function(header) {
        if (header.extra != undefined && header.extra.listId != undefined) {
          listIdsForFetch.push(header.extra.listId)
        }
      })
      const that = this
      this.fetchListsBulk({ arrayOfListIds: listIdsForFetch }).then(listOptions => {
        // We are basically copying all the lists to local state here (TODO we really only need the ones with IDs we identified)
        that.listOptions = listOptions

        // start the counter that uses the current time to determine attrition
        this.refreshAttrition()

      })
    })
  },
  unmounted () {
    this.cancelAutoUpdate()
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

    this.currentTimestamp = this.getCurrentTimestamp()
  },
  destroyed () {
    this.cancelAutoUpdate()
  },

}
</script>

<style>
.v-icon::before {
  display: inline;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td, .v-data-table > .v-data-table__wrapper > table > tbody > tr > th, .v-data-table > .v-data-table__wrapper > table > thead > tr > td, .v-data-table > .v-data-table__wrapper > table > thead > tr > th, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > th {
  padding: 0 8px;
}

</style>
