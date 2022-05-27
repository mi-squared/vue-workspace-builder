<template>
  <div>
    <v-skeleton-loader v-if="!loaded" type="article@6" class="p-4"></v-skeleton-loader>
    <v-app v-else>
  <!--    <v-navigation-drawer app>-->
  <!--      &lt;!&ndash; &ndash;&gt;-->
  <!--    </v-navigation-drawer>-->

      <v-app-bar dense fixed>
        <v-btn @click="loadPatientDashboard"><v-icon>mdi-arrow-left</v-icon>Back To Patient</v-btn>
        <!-- -->
<!--        <v-row-->
<!--          class="mt-4"-->
<!--          align="center"-->
<!--        >-->
<!--          <v-col-->
<!--            cols="12"-->
<!--            sm="6"-->
<!--          >-->
<!--            <v-select-->
<!--              v-model="workspaceSelection"-->
<!--              :items="workspaces"-->
<!--              label="Select"-->
<!--              multiple-->
<!--              chips-->
<!--              hint="Select workspaces"-->
<!--              persistent-hint-->
<!--            >-->
<!--              <template v-slot:selection="{ item }">-->
<!--                <v-chip-->
<!--                  :color="item.color"-->
<!--                >-->
<!--                  <span>{{ item.text }}</span>-->
<!--                </v-chip>-->
<!--              </template>-->

<!--            </v-select>-->
<!--          </v-col>-->

<!--          <v-col>-->
<!--            <v-menu-->
<!--              ref="fromDateMenu"-->
<!--              v-model="fromDateMenu"-->
<!--              :close-on-content-click="false"-->
<!--              transition="scale-transition"-->
<!--              offset-y-->
<!--              max-width="290px"-->
<!--              min-width="auto"-->
<!--            >-->
<!--              <template v-slot:activator="{ on, attrs }">-->
<!--                <v-text-field-->
<!--                  class="mt-2"-->
<!--                  v-model="fromDateFormatted"-->
<!--                  label="From Date"-->
<!--                  hint="MM/DD/YYYY format"-->
<!--                  persistent-hint-->
<!--                  prepend-icon="mdi-calendar"-->
<!--                  v-bind="attrs"-->
<!--                  @blur="fromDate = parseDate(fromDateFormatted)"-->
<!--                  v-on="on"-->
<!--                ></v-text-field>-->
<!--              </template>-->
<!--              <v-date-picker-->
<!--                v-model="fromDate"-->
<!--                no-title-->
<!--                @input="fromDateMenu = false"-->
<!--              ></v-date-picker>-->
<!--            </v-menu>-->
<!--          </v-col>-->

<!--          <v-col>-->
<!--            <v-menu-->
<!--              v-model="toDateMenu"-->
<!--              :close-on-content-click="false"-->
<!--              transition="scale-transition"-->
<!--              offset-y-->
<!--              max-width="290px"-->
<!--              min-width="auto"-->
<!--            >-->
<!--              <template v-slot:activator="{ on, attrs }">-->
<!--                <v-text-field-->
<!--                  class="mt-2"-->
<!--                  v-model="toDateFormatted"-->
<!--                  label="To Date"-->
<!--                  hint="MM/DD/YYYY format"-->
<!--                  persistent-hint-->
<!--                  prepend-icon="mdi-calendar"-->
<!--                  readonly-->
<!--                  v-bind="attrs"-->
<!--                  v-on="on"-->
<!--                ></v-text-field>-->
<!--              </template>-->
<!--              <v-date-picker-->
<!--                v-model="toDate"-->
<!--                no-title-->
<!--                @input="toDateMenu = false"-->
<!--              ></v-date-picker>-->
<!--            </v-menu>-->
<!--          </v-col>-->
<!--        </v-row>-->

      </v-app-bar>

      <!-- Sizes your content based upon application components -->
      <v-main class="mt-4">

        <!-- Provides the application the proper gutter -->
        <v-container fluid class="mt-4">
          <v-timeline>
            <v-timeline-item
              v-for="timelineItem in timelineItems"
              :key="timelineItem.index"
              :color="timelineItem.workspace.color"
              small
            >
              <span
                slot="opposite"
                :class="`headline font-weight-bold`"
                :style="`color: ${timelineItem.workspace.color}`"
                v-text="formatDatetime(timelineItem.entity.created_datetime)"
              ></span>

              <!-- display the read-only view of our form -->
              <v-card class="elevation-2">
                <v-card-title>
                  <span
                    class="headline font-weight-light"
                    :style="`color: ${timelineItem.workspace.color}`">
                    {{ timelineItem.workspace.title }}
                  </span>&nbsp;
                  <span class="mt-1 subtitle-1 font-weight-light">{{ timelineItem.dashboard.title }}</span>
                  &nbsp;
                  <span class="mt-1 subtitle-1 font-weight-light text--lighten-1">(#{{ timelineItem.entity.dashboard_entity_id }})</span>

                </v-card-title>
                <v-card-text>
                  <JsonFormTimelineView
                    :key="timelineItem.index"
                    v-if="timelineItem.form != null"
                    :form="timelineItem.form"
                    :model="timelineItem.entity"
                  >
                  </JsonFormTimelineView>
                </v-card-text>
                <v-card-actions>

                  <v-btn
                    @click="onEditClicked(timelineItem)"
                  >Edit</v-btn>

                  <!---  - ----------------- - - - ----------->
                  <v-badge
                    v-if="timelineNotes(timelineItem).length > 0"
                    color="green"
                    :content="timelineNotes(timelineItem).length"
                    overlap
                  >
                    <v-btn
                      class="ml-2"
                      v-if="showNotes[timelineItem.index]"
                      @click="toggleNotes(timelineItem.index)"
                    >
                      Hide Notes
                      <v-icon>mdi-menu-up</v-icon>
                    </v-btn>
                    <v-btn
                      class="ml-2"
                      v-else
                      @click="toggleNotes(timelineItem.index)"
                    >
                      Show Notes
                      <v-icon>mdi-menu-down</v-icon>
                    </v-btn>
                  </v-badge>
                  <v-spacer></v-spacer>
                  <DashboardFilesButton
                    :entity="timelineItem.entity"
                    :dashboard="timelineItem.dashboard"
                  ></DashboardFilesButton>
                </v-card-actions>
                <v-card-text v-if="showNotes[timelineItem.index]">
                  <NoteHistoryTimeline
                    :notes="timelineNotes(timelineItem)"
                    :entity="timelineItem.entity"
                  ></NoteHistoryTimeline>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-container>

        <template>
          <!-- DISPLAY the Main Form when edit clicked -->
          <v-dialog
            v-model="mainFormDialog"
            fullscreen
            hide-overlay
          >
            <v-card>
              <v-toolbar
                dark
                color="primary"
              >
                <v-toolbar-title>
                  {{ activeTimelineItem.entity.fname }} {{ activeTimelineItem.entity.lname }}
                </v-toolbar-title>
                <v-subheader>{{ activeTimelineItem.workspace.title }} : {{ activeTimelineItem.dashboard.title }} {{ formatDatetime(activeTimelineItem.entity.created_datetime) }} &nbsp; <span class="text--lighten-1">(#{{ activeTimelineItem.entity.dashboard_entity_id }})</span></v-subheader>
                <v-spacer></v-spacer>

                <v-switch
                  class="mt-5 mr-8"
                  label="Archived"
                  :input-value="activeTimelineItem.entity.archived == 1 ? true : false"
                  @change="archiveEntity(activeTimelineItem, 1 - activeTimelineItem.entity.archived)"
                ></v-switch>

                <v-btn
                  icon
                  dark
                  @click="onCancel"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-container v-if="activeTimelineItem.dashboard.mainForm != null">
                <v-card flat width="100%">
                  <v-card-text>
                    <!-- in case two timeline entities from different workspaces have same ID -->
                    <JsonForm
                      :key="activeTimelineItem.index"
                      :form="activeTimelineItem.dashboard.mainForm"
                      :model="activeTimelineItem.entity"
                      :schema="activeTimelineItem.dashboard.mainForm.schema"
                      :options="activeTimelineItem.dashboard.mainForm.options"
                      :pid="Number(activeTimelineItem.entity.pid)"
                      :patient="extractPatient(activeTimelineItem.entity)"
                      @save="onMainFormEntitySaved"
                      @cancel="onCancel"
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
      </v-main>

      <v-footer app>
        <!-- -->
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { formatDate, formatDatetime } from '../display-helpers'
import { ALL_WORKSPACES, FETCH_ALL_WORKSPACES, GET_DATA_TYPES } from '../store/types-workspace'
import { GET_FORM } from '../store/types-form'
import { GET_TIMELINE, GET_TIMELINE_FOR_PATIENT, SET_TIMELINE_ITEM_ENTITY } from '../store/types-timeline'
import JsonFormTimelineView from '../components/JsonFormTimelineView'
import JsonForm from '../components/JsonForm'
import { setOpenEmrPatient } from '../api'
import moment from 'moment-timezone'
import NoteHistoryTimeline from '../components/NoteHistoryTimeline'
import { FETCH_LISTS_WITH_DATA_BULK, GET_LIST } from '../store/types-list'
import {
  GET_NOTES_BY_ENTITY_ID,
  PUSH_ENTITY
} from '../store/types-dashboard'
import DashboardFilesButton from '../components/DashboardFilesButton'
import { INIT } from '../store/types-user'

const { mapGetters: mapTimelineGetters, mapActions: mapTimelineActions } = createNamespacedHelpers('timeline')
const { mapGetters: mapWorkspaceGetters, mapActions: mapWorkspaceActions } = createNamespacedHelpers('workspace')
const { mapGetters: mapFormGetters } = createNamespacedHelpers('form')
const { mapGetters: mapListGetters, mapActions: mapListActions } = createNamespacedHelpers('list')
const { mapGetters: mapDashboardGetters, mapActions: mapDashboardActions } = createNamespacedHelpers('dashboard')
const { mapActions: mapUserActions } = createNamespacedHelpers('user')
export default {
  name: 'PageTimeline',
  components: {
    DashboardFilesButton,
    NoteHistoryTimeline,
    JsonFormTimelineView,
    JsonForm
  },
  props: {
    pid: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    loaded: false,
    fromDateMenu: false,
    fromDate: '',
    fromDateFormatted: '',
    toDateMenu: false,
    toDate: '',
    toDateFormatted: '',
    mainFormDialog: false,
    showNotes: [],
    activeTimelineItem: {
      entity: {},
      workspace: {},
      dashboard: {},
      form: {},
      index: 0
    },
    activeEntityModel: {},
    activePatientModel: {},
    workspaceSelection: [],
    listOptions: [],
    workspaces: [
      {
        text: "WS 1",
        value: 1,
        color: "green"
      },
      {
        text: "WS 2",
        value: 2,
        color: "yellow"
      },
      {
        text: "WS 3",
        value: 3,
        color: "orange"
      },
    ],
    years: [
      {
        color: 'cyan',
        year: '1960',
      },
      {
        color: 'green',
        year: '1970',
      },
      {
        color: 'pink',
        year: '1980',
      },
      {
        color: 'amber',
        year: '1990',
      },
      {
        color: 'orange',
        year: '2000',
      },
    ],
  }),
  computed: {
    ...mapTimelineGetters({
      timeline: GET_TIMELINE
    }),
    ...mapWorkspaceGetters({
      allWorkspaces: ALL_WORKSPACES,
      getDataTypes: GET_DATA_TYPES,
    }),
    ...mapFormGetters({
      getForm: GET_FORM
    }),
    ...mapListGetters({
      getList: GET_LIST
    }),
    ...mapDashboardGetters({
      getNotesByEntityId: GET_NOTES_BY_ENTITY_ID
    }),
    timelineItems () {
      return this.timeline
    }
  },
  methods: {
    ...mapTimelineActions({
      getTimelineForPatient: GET_TIMELINE_FOR_PATIENT,
      setTimelineItemEntity: SET_TIMELINE_ITEM_ENTITY
    }),
    ...mapListActions({
      fetchListsBulk: FETCH_LISTS_WITH_DATA_BULK
    }),
    ...mapDashboardActions({
      pushEntity: PUSH_ENTITY,
    }),
    ...mapWorkspaceActions({
      fetchAllWorkspaces: FETCH_ALL_WORKSPACES
    }),
    ...mapUserActions({
      initUser: INIT
    }),
    onEditClicked(timelineItem) {
      this.activeTimelineItem = { ...timelineItem }
      this.mainFormDialog = true
    },
    toggleNotes(i) {
      // We must use $set here because since the values of the showNotes are not initialized,
      // they are not reactive by default
      if (this.showNotes[i] == undefined ||
        this.showNotes[i] == false) {
        this.$set(this.showNotes, i, true)
      } else {
        this.$set(this.showNotes, i, false)
      }
    },
    timelineNotes(timelineItem) {
      const notes =  this.getNotesByEntityId({
        entityId: timelineItem.entity.dashboard_entity_id,
        dashboardId: timelineItem.entity.dashboard_id
      })
      return notes
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
    loadPatientDashboard() {
      setOpenEmrPatient(this.pid)
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
    onCancel() {
      this.activeTimelineItem = {
        entity: {},
        workspace: {},
        dashboard: {},
        form: {},
        index: 0
      }
      this.activePatientModel = {}
      this.activeEntityModel = {}
      this.mainFormDialog = false
    },
    onMainFormEntitySaved({ entity, patient }) {
      document.getElementsByClassName('v-dialog--active')[0].scrollTop = 0
      this.activeTimelineItem.entity = {
        ...this.activeTimelineItem.entity,
        ...entity
      }
      this.activePatientModel = {
        ...this.extractPatient(this.activeTimelineItem.entity),
        ...patient
      }
      // Update the timeline model with the active model from the form
      this.pushEntity({
        workspaceId: this.activeTimelineItem.workspace.id,
        dashboardId: this.activeTimelineItem.dashboard.id,
        entityId: entity.dashboard_entity_id,
        entity: entity,
        patient: patient
      }).then((resolvedEntity) => {
        this.setTimelineItemEntity({
          entityId: resolvedEntity.dashboard_entity_id,
          dashboardId: resolvedEntity.dashboard_id,
          entity: resolvedEntity
        })

        this.onCancel(this.activeTimelineItem)
      })
    },
    archiveEntity(timelineItem, archive = 1) {

      timelineItem.entity.archived = archive

      // Now use our vuex action to push the entity via API, when we callback, reload the entities
      this.pushEntity({
        workspaceId: timelineItem.dashboard.workspaceId,
        dashboardId: timelineItem.dashboard.id,
        entityId: timelineItem.entity.dashboard_entity_id,
        entity: timelineItem.entity,
        patient: this.activePatientModel
      }).then((resolvedEntity) => {
        this.setTimelineItemEntity({
          entityId: resolvedEntity.dashboard_entity_id,
          dashboardId: resolvedEntity.dashboard_id,
          entity: resolvedEntity
        })
      })
    },
  },
  mounted () {
    console.log("timeline mounted")
    document.title = "Timeline"
    const that = this

    this.initUser().then(() => {

      that.getTimelineForPatient({ pid: that.pid }).then(timeline => {

        console.log(timeline)
        that.loaded = true

      })
    })
  }
}
</script>

<style scoped>

</style>
