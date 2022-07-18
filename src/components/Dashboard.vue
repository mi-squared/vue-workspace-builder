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
        :height="dashboardHeight()"
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
              @click="onNewEntityButtonClicked"
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
              :customFilter="customFilter"
              :indicatorFilters="indicatorFilters"
              :listOptions="listOptions"
              @change="onFilterChanged"
            ></DashboardFilters>

            <v-switch
              class="mt-4"
              v-model="showArchives"
              label="Show Archives"
            >
            </v-switch>

            <v-switch
              class="mt-4"
              v-model="backgroundRefresh"
              label="Background Refresh"
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

                <a
                  class="mt-4 text-body-2 font-weight-light"
                  @click="onEntityIdClick(item)"
                >
                  #{{ item.id }}
                </a>
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
              <div v-else-if="header.value == durationField">
                <v-chip
                  :key="item.id + 'app-date'"
                  :color="getColor(item)"
                  dark
                >
                  <AppDate v-if="header.type == 'datetime'" :timestamp="getDurationValue(item)" :timezone="timeZone"></AppDate>
                  <span v-else-if="header.type == 'date'">{{ formatDate(item[durationField]) || 'Date Not Set' }}</span>
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

              <div v-else-if="header.value == 'data-files'">
                <table>
                  <tr>
                    <td class="py-0 px-1">
                      <DashboardFilesButton
                        :key="item.dashboard_entity_id + '-attachments'"
                        :entity="item"
                        :dashboard="dashboard"
                      >
                      </DashboardFilesButton>
                    </td>
                  </tr>
                </table>
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
                          :entity="item"
                          :dashboard="dashboard"
                          :activeUsersList="activeUsersList"
                          @save="onNoteSaved"
                          @show="onDashboardComponentVisibilityChanged"
                        >
                        </DashboardNoteButton>
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

                      <v-btn
                        v-if="item.archived == 1"

                        icon
                        @click="archiveEntity(item, 0)"
                      >
                        <v-icon>mdi-archive-cancel-outline</v-icon>
                      </v-btn>
                      <v-btn
                        v-else
                        icon
                        @click="archiveEntity(item)"
                      >
                        <v-icon>mdi-archive</v-icon>
                      </v-btn>

                      <MailToButton
                        :entity="item"
                        :dashboard="dashboard"
                        :templateList="templateList"
                        @save="onNoteSaved"
                        @show="onDashboardComponentVisibilityChanged"
                      ></MailToButton>

                    </v-toolbar-items>
                  </v-toolbar>

                  <v-divider></v-divider>

                  <!-- display UI Actions registered on server -->
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="text-h6">
                          Actions
                        </v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <DashboardActionsPerformedButton
                          :entity="item"
                          :dashboard="dashboard"
                          :activeUsersList="activeUsersList"
                        ></DashboardActionsPerformedButton>
                      </v-list-item-action>
                    </v-list-item>
                    <v-divider></v-divider>

                    <v-list-item-group>
                      <v-list-item
                        v-for="dashboardAction in getDashboardActions"
                        :key="dashboardAction.handle"
                        @click="performAction(dashboardAction.handle, item)"
                      >

                        <DashboardActionIcon
                          :dashboardAction="dashboardAction">
                        </DashboardActionIcon>
                        <v-list-item-content>
                          <v-list-item-title>{{ dashboardAction.title }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>

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
                  <SelectModal
                    :key="generateKey(item, header)"
                    :id="item.id"
                    :index="header.value"
                    :model="item"
                    :listId="listIdForItem(header)"
                    @changed="onEntityChanged(item)"
                    @show="onDashboardComponentVisibilityChanged"
                  ></SelectModal>
                </div>

                <div v-if="header.type == 'user'">
                  <v-tooltip :key="item.id + '-user-tooltip'" bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-autocomplete
                        v-bind="attrs"
                        v-on="on"
                        dense
                        :key="generateKey(item, header)"
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
                  <EditableString
                    :key="generateKey(item, header)"
                    :entity="item"
                    :index="header.value"
                    @save="onEntityChanged(item)"
                    @show="onDashboardComponentVisibilityChanged"
                  ></EditableString>
                </div>

                <div v-if="header.type == 'datetime'">

                  <DatetimePicker
                    :key="generateKey(item, header)"
                    v-model="item[header.value]"
                    timeFormat="HH:mm"
                    dateFormat="MM/dd/yyyy"
                    @input="onEntityChanged(item)"
                    @show="onDashboardComponentVisibilityChanged"
                  >
                    <v-icon slot="dateIcon">mdi-calendar</v-icon>
                    <v-icon slot="timeIcon">mdi-clock</v-icon>
                  </DatetimePicker>
                </div>

                <div v-if="header.type == 'date'">
                  <DatePickerModal
                    :key="generateKey(item, header)"
                    :id="item.id"
                    :model="item"
                    :index="header.value"
                    @changed="onEntityChanged(item)"
                    @show="onDashboardComponentVisibilityChanged"
                  ></DatePickerModal>

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
      </v-data-table>

      <!-- Form Dialog for NEW button-->
      <template>
        <v-row justify="center">
          <v-dialog
            v-model="dialog"
            persistent
            max-width="800px"
          >
            <JsonForm
              v-if="newEntityForm"
              :form="newEntityForm"
              :key="entityCreateKey"
              :model="newEntityModel"
              :schema="newEntityForm.schema"
              :options="newEntityForm.options"
              @save="saveNewEntity"
              @cancel="onNewEntityModalClosed"
            ></JsonForm>
            <v-alert v-else dark color="red">No Form Selected For New Entity</v-alert>
          </v-dialog>
        </v-row>
      </template>

    <!-- display the "main" form as full screen -->
    <template>
      <v-dialog
        v-model="mainFormDialogs[mainEntityModel.dashboard_entity_id]"
        fullscreen
        hide-overlay
      >
        <v-card>
          <v-toolbar
            dark
            color="primary"
          >
            <v-toolbar-title>
              {{ mainEntityModel.fname }} {{ mainEntityModel.lname }}
              <span class="lighten-1">(#{{ mainEntityModel.id }})</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>
            <v-switch
              class="mt-5 mr-8"
              label="Archived"
              :input-value="mainEntityModel.archived == 1 ? true : false"
              @change="archiveEntity(mainEntityModel, 1 - mainEntityModel.archived)"
            ></v-switch>
            <v-btn
              icon
              dark
              @click="onMainFormClosed(mainEntityModel)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-container v-if="mainForm != null">
            <v-card flat width="100%">
              <v-card-text>
                <!-- was  v-if="mainFormDialogs[item.id]" -->
                <JsonForm
                  :key="'main-form-' + mainEntityModel.dashboard_entity_id"
                  :form="mainForm"
                  :model="mainEntityModel"
                  :schema="mainForm.schema"
                  :options="mainForm.options"
                  :pid="Number(mainEntityModel.pid)"
                  :patient="mainPatientModel"
                  @save="onMainFormEntitySaved"
                  @cancel="onMainFormClosed(mainEntityModel)"
                ></JsonForm>
              </v-card-text>

            </v-card>
          </v-container>
          <v-container v-else>
            <v-alert>No Main Form Selected for this dashboard</v-alert>
          </v-container>
        </v-card>
      </v-dialog>
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

    <v-dialog
      v-model="errorDialog"
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">

          <v-icon v-if="getErrorMessage.iconType == 'icon'">{{ getErrorMessage.icon }}</v-icon>
          <v-img
            v-else-if="getErrorMessage.iconType == 'image'"
            :src="getErrorMessage.icon"
          >
          </v-img>

          There was an error
        </v-card-title>

        <v-card-text>
          {{ getErrorMessage.message }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="setErrorMessage('')"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>

import moment from 'moment-timezone'
import AppDate from '@/components/AppDate'
import JsonForm from '@/components/JsonForm'
import { newDashboardSourceDashboard, newDashboardSourceWorkspace } from '../model-builder'
import { createNamespacedHelpers } from 'vuex'

import {
  GET_DATA_TYPES,
  GET_WORKSPACE
} from '../store/types-workspace'

const { mapGetters: mapWorkspaceGetters} = createNamespacedHelpers('workspace')

import { ALL_LISTS, FETCH_LISTS_WITH_DATA_BULK, GET_LIST } from '../store/types-list'

const { mapGetters: mapListGetters, mapActions: mapListActions } = createNamespacedHelpers('list')

import {
  ADD_NOTE,
  CREATE_ENTITY,
  FETCH_DASHBOARD,
  FETCH_ENTITIES,
  GET_DASHBOARD,
  GET_DASHBOARD_ACTIONS,
  GET_DASHBOARD_ROWS,
  GET_ENTITY_BY_ID, GET_ERROR_MESSAGE,
  GET_NOTES_BY_ENTITY_ID,
  INIT_DASHBOARD,
  PERFORM_DASHBOARD_ACTION,
  PUSH_ENTITY, SET_ERROR_MESSAGE,
  UPDATE_TEST
} from '../store/types-dashboard'

const { mapGetters: mapDashboardGetters, mapActions: mapDashboardActions } = createNamespacedHelpers('dashboard')

import { GET_USER_META } from '../store/types-user'
const { mapGetters: mapUserGetters } = createNamespacedHelpers('user')

import { GET_FORM } from '../store/types-form'
import DashboardNoteButton from './DashboardNoteButton'
const { mapGetters: mapFormGetters } = createNamespacedHelpers('form')
import { formatDate, formatDatetime } from '../display-helpers'
import { MixinLogicEvaluator } from '../mixin-logic-evaluator'
import { setOpenEmrPatient } from '../api'
import DatetimePicker from './DatetimePicker'
import EditableString from './EditableString'
import DashboardFilters from './DashboardFilters'
import SelectModal from './form-elements/SelectModal'
import DatePickerModal from './form-elements/DatePickerModal'
import DashboardFilesButton from './DashboardFilesButton'
import MailToButton from './MailToButton'
import DashboardActionsPerformedButton from './DashboardActionsPerformedButton'
import DashboardActionIcon from './DashboardActionIcon'

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
    DashboardActionIcon,
    DashboardActionsPerformedButton,
    MailToButton,
    DatePickerModal,
    SelectModal,
    DashboardFilesButton,
    DashboardFilters,
    EditableString,
    DatetimePicker,
    DashboardNoteButton,
    JsonForm,
    AppDate,
  },
  data () {
    return {
      lastUpdateTestDatetime: null,
      tableHeight: '',
      timeZone: '',
      paginationOptions: {},
      globalSearch: '',
      totalEntities: 0,
      orderedEntities: [],
      newEntityModel: {},
      newPatientModel: {},
      mainFormDialogs: {},
      mainEntityModel: {},
      mainPatientModel: {},
      menus: {}, // v-models for the date picker dialogs, etc indexed by header.value
      formattedEntityValues: {}, // v-models for our formatted values like dates
      entityCreateKey: 0,
      loaded: false,
      snackbar: false,
      snackbarText: '',
      showArchives: false,
      backgroundRefresh: true,
      backgroundRefreshTimer: true,
      changeCount: {}, // histogram of counts each compnenent changes
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
      currentDateObject: null,
      //currentUnixTimestamp: null,
      expanded: [],
      singleExpand: false,
      entityTitle: 'Referral',
      max25chars: v => v.length <= 25 || 'Input too long!',
      // This is the filter containing conditions for sending to server. Custom filter is the filter created
      // by the dashboard filter tool, and indicator filters are those filters engaged that are pre-defined by the
      // dashboard condition builder
      filter: [],
      customFilter: {
        logicalType: 'All',
        conditions: [],
      },
      indicatorFilters: [],
      // these are the slots for the inline editable elements
      sortBy: 'moved_to_dashboard_date',
      sortDesc: true,
      // These are headers that are added by default
      idHeader: {
        "text": "ID",
        "value": "id",
        "groupable": false,
        "sortable": true,
        width: "60px"
      },
      indicatorsHeader: {
        "text": "",
        "value": "data-indicators",
        "groupable": false,
        "sortable": false,
        width: "80px"
      },
      noteHeader: {
        "text": "",
        "value": "data-notes",
        "groupable": false,
        "sortable": false,
        "width": "100px"
      },
      filesHeader: {
        "text": "",
        "value": "data-files",
        "groupable": false,
        "sortable": false,
        "width": "40px"
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
      getNotesByEntityId: GET_NOTES_BY_ENTITY_ID,
      getDashboardActions: GET_DASHBOARD_ACTIONS,
      getErrorMessage: GET_ERROR_MESSAGE,
    }),
    ...mapUserGetters({
      getUserMeta: GET_USER_META
    }),
    ...mapWorkspaceGetters({
      getWorkspaceById: GET_WORKSPACE,
      getDataTypes: GET_DATA_TYPES,
    }),
    ...mapListGetters({
      getList: GET_LIST,
      allLists: ALL_LISTS
    }),
    ...mapFormGetters({
      getForm: GET_FORM
    }),
    errorDialog () {
      if (this.getErrorMessage.message) {
        return true
      }
      return false
    },
    listOptions () {
      return this.allLists
    },
    durationField () {
      if (this.dashboard.durationField) {
        return this.dashboard.durationField
      } else {
        return 'moved_to_dashboard_date'
      }
    },
    activeUsersList () {
      if (this.getList('active_users') != undefined) {
        return this.getList('active_users').data
      }
      return []
    },
    templateList () {
      if (this.getList('jotform_templates') != undefined) {
        return this.getList('jotform_templates').data
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
      headers.push(this.filesHeader)
      // headers.push(this.expandHeader) we removed the header definition for expand, and removed show-expand from data table definition
      headers.push(this.actionHeader)
      return headers
    },
    rows () {
      // We have to map the actual entities onto the order mapping, but sometimes like after a sort, the objects are not
      // in vuex yet, so we need to filter out undefined entites
      const rows = this.orderedEntities.map(entityId => {
        const row = this.getEntityById(entityId)
        return row
      }).filter(row => {
        if (row == undefined) {
          return false
        } else {
          return true
        }
      })

      return rows
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
      // let m = this.currentTimestamp
      // return m.tz(this.timeZone).format("MM/DD/YYYY HH:mm")
      return this.currentDateObject.toLocaleTimeString('en-US', {
        timeZone: this.timeZone,
        timeStyle: 'short'
      })
    }
  },
  methods: {
    ...mapDashboardActions({
      initDashboard: INIT_DASHBOARD,
      fetchDashboard: FETCH_DASHBOARD,
      fetchEntities: FETCH_ENTITIES,
      updateTest: UPDATE_TEST,
      createEntity: CREATE_ENTITY,
      pushEntity: PUSH_ENTITY,
      addNote: ADD_NOTE,
      setErrorMessage: SET_ERROR_MESSAGE,
      performDashboardAction: PERFORM_DASHBOARD_ACTION,
    }),
    ...mapListActions({
      fetchListsBulk: FETCH_LISTS_WITH_DATA_BULK
    }),
    /**
     * Generate a unique key in the table grid for a component, using the item id, it's object index (DB column name)
     * it's type and a count of how many times it's changed (this forces re-render of component when a field is changed
     * by the main form)
     */
    generateKey (item, header) {
      return item.id + '_' + header.value + '_' + header.type + '_' + this.changeCount[Number(item.id)]
    },
    getDurationValue(entity) {
      const durationField = this.durationField;
      if (entity[durationField] != undefined) {
        return entity[durationField]
      } else {
        // Doesn't have the value set, just return empty string
        return ''
      }
    },
    /**
     * Tell vuex that an action was triggered by the user
     * @param handle
     * @param entity
     */
    performAction(handle, entity) {
      this.performDashboardAction({
        handle: handle,
        pid: entity.pid,
        workspaceId: this.dashboard.workspaceId,
        dashboardId: this.dashboard.id,
        entityId: entity.dashboard_entity_id,
        context: null,
      })
    },
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
      this.customFilter = filter.customFilter
      this.indicatorFilters = filter.indicatorFilters
      this.filter = [...this.indicatorFilters]
      this.filter.push(this.customFilter)
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
    extractPatient (entity) {
      // Given an entity, which contains all patient data, extract only patient fields
      const dataTypes = this.getDataTypes
      const patientDatabaseColumns = dataTypes.patient.databaseColumns
      let patient = {}
      patientDatabaseColumns.forEach(column => {
        if (column.name != 'id') {
          if (entity[column.name]) {
            patient[column.name] = entity[column.name]
          } else {
            patient[column.name] = null
          }
        }
      })
      return patient
    },
    listIdForItem (header) {
      // Using the list ID for this header, return the options
      if (header.extra.listId != undefined) {
        return header.extra.listId
      } else {
        return ''
      }
    },
    listOptionsForItem (header) {
      // Using the list ID for this header, return the options
      if (header.extra.listId != undefined) {
        if (this.getList(header.extra.listId) != undefined) {
          // Call into list vuex module
          return this.getList(header.extra.listId).data
        } else {
          console.log("ERROR no list data for header: " + header.value)
        }
      } else {
        console.log("ERROR no list Id for header: " + header.value)
        return []
      }
    },
    onNewEntityButtonClicked () {
      this.backgroundRefreshTimer = false
      this.dialog = true
    },
    onNewEntityModalClosed () {
      this.backgroundRefreshTimer = true
      this.dialog = false
      this.newEntityModel = {}
      this.newPatientModel = {}
      this.entityCreateKey++
    },
    saveNewEntity ({ entity, patient }) {
      this.backgroundRefreshTimer = true
      // Save the entity
      console.log("Saving New Entity: " + this.newEntityModel)

      this.newEntityModel = {
        ...this.newEntityModel,
        ...entity
      }
      this.newPatientModel = {
        ...this.newPatientModel,
        ...patient
      }

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
        that.onNewEntityModalClosed()
      })
    },
    onEntityIdClick(entity) {
      console.log(entity.fname + " " + entity.lname)
      this.backgroundRefreshTimer = false // Pause the timer / background refresh while form is open
      this.mainEntityModel = { ...entity }
      this.mainPatientModel = { ...this.extractPatient(entity) }
      this.mainFormDialogs[entity.dashboard_entity_id] = true
    },
    onMainFormEntitySaved({ entity, patient }) {
      document.getElementsByClassName('v-dialog--active')[0].scrollTop = 0
      this.backgroundRefreshTimer = true
      this.mainEntityModel = {
        ...this.mainEntityModel,
        ...entity
      }
      this.mainPatientModel = {
        ...this.mainPatientModel,
        ...patient
      }
      this.onEntityChanged(this.mainEntityModel, this.mainPatientModel)
      this.onMainFormClosed(this.mainEntityModel)
      // this.loadEntitiesApi()
    },
    onMainFormClosed (entity) {
      document.getElementsByClassName('v-dialog--active')[0].scrollTop = 0
      this.backgroundRefreshTimer = true // un-Pause the timer / background refresh
      // Clear the entity and patient models when we close the main form
      this.mainEntityModel = {}
      this.mainPatientModel = {}
      this.mainFormDialogs[entity.dashboard_entity_id] = false
    },
    onNoteSaved(payload) {
      // console.log("note saved with text:" + payload.text)
      this.addNote({
        workspaceId: this.dashboard.workspaceId,
        dashboardId: this.dashboard.id,
        entityId: payload.entity.dashboard_entity_id,
        pid: payload.entity.pid,
        text: payload.text,
        coordinatorKey: payload.coordinatorKey
      })
    },
    lastNoteText(entity) {
      const notes = this.getNotesByEntityId({
        entityId: entity.dashboard_entity_id,
        dashboardId: this.dashboard.id
      })
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
      // console.log(entity)
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
        let workspaceTitle = ''
        if (this.dashboard.workspaces[entity.source.extra.workspaceId] != undefined) {
          workspaceTitle = this.dashboard.workspaces[entity.source.extra.workspaceId]
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
        if (entity.dashboard_entity_id == entityId) {
          return true
        } else {
          return false
        }
      })
      this.orderedEntities.splice(movedEntityIndex, 1)
    },
    onEntityChanged(entity, patient = null) {
      // Let the user know we're doing something
      this.loaded = false

      if (this.dashboard.hasConditionalLogic) {
        this.dashboard.conditionalLogic.rules.forEach(rule => {

          const performAction = this.evaluateRule(rule, entity, {});
          if (performAction) {
            if (rule.action.name == 'Archive') {
              this.removeEntityFromDashboard(entity)
              entity.archived = 1
              this.snackbarText = "Entity #" + entity.dashboard_entity_id + " Was archived [Conditional Logic Action]"
              this.snackbar = true
            }
          }
        })
      }

      // send the udpated entity to the server
      let patientModel = patient
      if (patientModel == null) {
        patientModel = this.extractPatient(entity)
      }

      this.pushEntity({
        workspaceId: this.dashboard.workspaceId,
        dashboardId: this.dashboard.id,
        entityId: entity.dashboard_entity_id,
        entity,
        patient: patientModel // Send the patient model along with the entity
      }).then(() => {
        // force update of the dashboard form components by incrementing change count, which they use as part of :key
        this.incrementChangeCount(Number(entity.dashboard_entity_id))
        this.loaded = true
        this.loadEntitiesApi()
      })
    },
    archiveEntity(entity, archive = 1) {
      // Let the user know we're doing something
      this.loaded = false

      // We want to remove the entity row from the table before VUEX mutates it, so let's remove it first
      this.removeEntityFromDashboard(entity)

      entity.archived = archive

      // Now use our vuex action to push the entity via API, when we callback, reload the entities
      this.pushEntity({
        workspaceId: this.dashboard.workspaceId,
        dashboardId: this.dashboard.id,
        entityId: entity.dashboard_entity_id,
        entity
      }).then(() => {
        this.loaded = true
        //this.loadEntitiesApi()
      })
    },
    moveToDashboard(entity, dashboardId) {
      // console.log("Moving Entity to dashboard: " + dashboardId)
      // console.log(entity)

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
        entityId: entity.dashboard_entity_id,
        entity
      }).then(() => {
        this.loaded = true
        //this.loadEntitiesApi()
      })
    },
    sendToWorkspace(entity, workspaceId) {
      // console.log("Sending Entity to workspace: " + workspaceId)

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
        delete newEntity.dashboard_entity_id

        // Now use our vuex action to create the entity via API, when callback show our snack
        // The service on the API side is smart enough to toss the fields that don't apply to the new workspace
        this.createEntity({
          workspaceId: workspaceId,
          dashboardId: defaultDashboardId,
          entity: newEntity,
          patient: null, // We don't send the patient, because there should already be an existing PID in the entity
          sourceEntityId: entity.dashbord_entity_id // source is the original entity
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
    refreshAttrition: function () {

      // Update the clock once per minute
      let time = new Date()
      let secondsRemaining = (60 - time.getSeconds()) * 1000;
      const that = this
      setTimeout(() => {
        that.timer = setInterval(() => {
          that.currentDateObject = new Date()
        }, 60000)
      }, secondsRemaining)

      this.updateTimer = setInterval(() => {
        if (that.backgroundRefresh === true &&
          that.backgroundRefreshTimer === true) {
          that.updateTest({
            dashboardId: that.dashboard.id,
            workspaceId: that.dashboard.workspaceId,
            entityIds: that.orderedEntities,
            lastUpdateTestDatetime: that.lastUpdateTestDatetime
          }).then(function (response) {
            that.lastUpdateTestDatetime = response.lastUpdateTestDatetime
            if (response.doUpdate === true) {
              that.loadEntitiesApi(false)
            }
          })
        }
      }, 5000)
    },
    cancelAutoUpdate () {
      clearInterval(this.updateTimer)
      clearInterval(this.timer)
    },
    getColor (entity) {
      // We need to calculate "now" based on the system timezone so our diff relative to the timestamp is correct
      let moved_to_dashboard_date = entity.moved_to_dashboard_date
      if (this.durationField) {
        moved_to_dashboard_date = entity[this.durationField]
      }
      const a = moment().tz(this.timeZone)
      const b = moment.tz(moved_to_dashboard_date, this.timeZone)
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
    dashboardHeight() {
      return this.tableHeight || document.body.scrollHeight - 64 - 60
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
        that.totalEntities = Number(response.total)
        that.orderedEntities = response.orderedEntities
        that.loaded = true

        // Force re-render of dashboard form components
        that.orderedEntities.forEach(entityId => {
          that.incrementChangeCount(Number(entityId))
        })
        // // start the counter that uses the current time to determine attrition
        // that.refreshAttrition()
      })
    },
    incrementChangeCount(entityId) {
      if (this.changeCount[entityId] == undefined) {
        this.changeCount[entityId] = 1
      } else {
        this.changeCount[entityId]++
      }
    },
    calculateTableHeight() {
      return document.querySelector('#app').clientHeight - 64 - 60
    },
    onResize() {
      this.tableHeight = this.calculateTableHeight()
      console.log("height: " + this.tableHeight)
    },
    onDashboardComponentVisibilityChanged (isShowing) {
      if (isShowing === true) {
        this.backgroundRefreshTimer = false
      } else {
        this.backgroundRefreshTimer = true
      }
    }
  },
  mounted () {
    console.log("Dashboard Mounted")

    // start the counter that uses the current time to determine attrition
    this.refreshAttrition()

    this.tableHeight = this.calculateTableHeight()
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
      this.timeZone = 'America/Phoenix'
    }

    this.currentDateObject = new Date()
    // init the last updated time (since we don't have one from the server yet)
    this.lastUpdateTestDatetime = this.currentDateObject.toISOString().slice(0, 19).replace('T', ' ')

    window.addEventListener("resize", this.onResize)

    // Pause the refresh when users are doing "stuff"
    // window.addEventListener("click", this.pauseRefresh)
    // window.addEventListener("keydown", this.pauseRefresh)
  },
  destroyed () {
    this.cancelAutoUpdate()
    window.removeEventListener("resize", this.onResize)
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

/* For making sure the menu on dashboard edit sticks to parent */
.relative-container {
  position: relative;
}

.v-select__slot {
  min-width: 180px;
}

</style>
