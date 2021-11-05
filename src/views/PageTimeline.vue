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
              v-for="(timelineItem, i) in timelineItems"
              :key="i"
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

                </v-card-title>
                <v-card-text>
                  <JsonFormTimelineView
                    v-if="timelineItem.form != null"
                    :form="timelineItem.form"
                    :model="timelineItem.entity"
                  >
                  </JsonFormTimelineView>
                </v-card-text>
                <v-card-actions>

                  <!-- DISPLAY the Main Form when edit clicked -->
                  <v-dialog
                    v-model="mainFormDialogs[i]"
                    fullscreen
                    hide-overlay
                  >
                    <template v-slot:activator="{ on, attrsMainForm }">
                      <v-btn
                        v-bind="attrsMainForm"
                        v-on="on"
                      >Edit</v-btn>
                    </template>
                    <v-card>
                      <v-toolbar
                        dark
                        color="primary"
                      >
                        <v-toolbar-title>
                          {{ timelineItem.entity.fname }} {{ timelineItem.entity.lname }}
                        </v-toolbar-title>
                        <v-subheader>{{ timelineItem.workspace.title }} : {{ timelineItem.dashboard.title }} {{ formatDatetime(timelineItem.entity.created_datetime) }}</v-subheader>
                        <v-spacer></v-spacer>
                        <v-btn
                          icon
                          dark
                          @click="mainFormDialogs[i] = false"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </v-toolbar>
                      <v-container v-if="timelineItem.dashboard.mainForm != null">
                        <v-card flat width="100%">
                          <v-card-text>
                            <!-- in case two timeline entities from different workspaces have same ID -->
                            <JsonForm
                              :key="timelineItem.entity.id + i"
                              :form="timelineItem.dashboard.mainForm"
                              :model="timelineItem.entity"
                              :schema="timelineItem.dashboard.mainForm.schema"
                              :options="timelineItem.dashboard.mainForm.options"
                              :pid="Number(timelineItem.entity.pid)"
                              :patient="timelineItem.entity"
                              @changed="onEntityChanged"
                            ></JsonForm>
                          </v-card-text>

                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="blue darken-1"
                              text
                              @click="mainFormDialogs[i] = false"
                            >
                              Close
                            </v-btn>
                            <v-btn
                              color="blue darken-1"
                              text
                              @click=onMainFormEntitySaved(timelineItem.entity)
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
                  <!---  - ----------------- - - - ----------->
                  <v-badge
                    v-if="timelineItem.notes.length > 0"
                    color="green"
                    :content="timelineItem.notes.length"
                    overlap
                  >
                    <v-btn
                      class="ml-2"
                      v-if="showNotes[i]"
                      @click="toggleNotes(i)"
                    >
                      Hide Notes
                      <v-icon>mdi-menu-up</v-icon>
                    </v-btn>
                    <v-btn
                      class="ml-2"
                      v-else
                      @click="toggleNotes(i)"
                    >
                      Show Notes
                      <v-icon>mdi-menu-down</v-icon>
                    </v-btn>
                  </v-badge>
                </v-card-actions>
                <v-card-text v-if="showNotes[i]">
                  <NoteHistoryTimeline :notes="timelineItem.notes" :activeUsersList="listOptions['active_users'].data"></NoteHistoryTimeline>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-container>
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
import { ALL_WORKSPACES } from '../store/types-workspace'
import { GET_FORM } from '../store/types-form'
import { GET_TIMELINE, GET_TIMELINE_FOR_PATIENT } from '../store/types-timeline'
import JsonFormTimelineView from '../components/JsonFormTimelineView'
import JsonForm from '../components/JsonForm'
import { setOpenEmrPatient } from '../api'
import moment from 'moment-timezone'
import NoteHistoryTimeline from '../components/NoteHistoryTimeline'
import { FETCH_LISTS_WITH_DATA_BULK, GET_LIST } from '../store/types-list'


const { mapGetters: mapTimelineGetters, mapActions: mapTimelineActions } = createNamespacedHelpers('timeline')
const { mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')
const { mapGetters: mapFormGetters } = createNamespacedHelpers('form')
const { mapGetters: mapListGetters, mapActions: mapListActions } = createNamespacedHelpers('list')

export default {
  name: 'PageTimeline',
  components: {
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
    mainFormDialogs: {},
    showNotes: [],
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
    }),
    ...mapFormGetters({
      getForm: GET_FORM
    }),
    ...mapListGetters({
      getList: GET_LIST
    }),
    timelineItems () {
      return this.timeline.items
    }
  },
  methods: {
    ...mapTimelineActions({
      getTimelineForPatient: GET_TIMELINE_FOR_PATIENT
    }),
    ...mapListActions({
      fetchListsBulk: FETCH_LISTS_WITH_DATA_BULK
    }),
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
    onEntityChanged ({ model, patient }) {
      this.activeEntityModel = model
      this.activePatientModel = patient
    },
    onMainFormEntitySaved() {

    }
  },
  mounted () {
    console.log("timeline mounted")
    document.title = "Timeline"
    this.getTimelineForPatient({ pid: this.pid }).then(timeline => {
      console.log(timeline)

      let listIdsForFetch = ['active_users']
      const that = this
      this.fetchListsBulk({ arrayOfListIds: listIdsForFetch }).then(listOptions => {
        // We are basically copying all the lists to local state here (TODO we really only need the ones with IDs we identified)
        that.listOptions = listOptions
        this.loaded = true
      })

    })
  }
}
</script>

<style scoped>

</style>
