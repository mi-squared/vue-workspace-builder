<template>
  <div>
    <v-skeleton-loader v-if="!loaded" type="article@6"></v-skeleton-loader>
    <v-app v-else>
  <!--    <v-navigation-drawer app>-->
  <!--      &lt;!&ndash; &ndash;&gt;-->
  <!--    </v-navigation-drawer>-->

      <v-app-bar prominent fixed>
        <v-btn icon class="mt-8" @click="loadPatientDashboard"><v-icon>mdi-arrow-left</v-icon></v-btn>
        <!-- -->
        <v-row
          class="mt-4"
          align="center"
        >
          <v-col
            cols="12"
            sm="6"
          >
            <v-select
              v-model="workspaceSelection"
              :items="workspaces"
              label="Select"
              multiple
              chips
              hint="Select workspaces"
              persistent-hint
            >
              <template v-slot:selection="{ item }">
                <v-chip
                  :color="item.color"
                >
                  <span>{{ item.text }}</span>
                </v-chip>
              </template>

            </v-select>
          </v-col>

          <v-col>
            <v-menu
              ref="menu1"
              v-model="menu1"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  class="mt-2"
                  v-model="dateFormatted"
                  label="From Date"
                  hint="MM/DD/YYYY format"
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  @blur="date = parseDate(dateFormatted)"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                no-title
                @input="menu1 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col>
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  class="mt-2"
                  v-model="computedDateFormatted"
                  label="To Date"
                  hint="MM/DD/YYYY format"
                  persistent-hint
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                no-title
                @input="menu2 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>

      </v-app-bar>

      <!-- Sizes your content based upon application components -->
      <v-main class="mt-16">

        <!-- Provides the application the proper gutter -->
        <v-container fluid class="mt-12">
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
                  <v-btn>Edit</v-btn>
                  <v-btn>Show Notes</v-btn>
                </v-card-actions>
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
import { formatDatetime } from '../display-helpers'
import { ALL_WORKSPACES } from '../store/types-workspace'
import { GET_FORM } from '../store/types-form'
import { GET_TIMELINE, GET_TIMELINE_FOR_PATIENT } from '../store/types-timeline'
import JsonFormTimelineView from '../components/JsonFormTimelineView'
import { setOpenEmrPatient } from '../api'

const { mapGetters: mapTimelineGetters, mapActions: mapTimelineActions } = createNamespacedHelpers('timeline')
const { mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')
const { mapGetters: mapFormGetters } = createNamespacedHelpers('form')

export default {
  name: 'PageTimeline',
  components: { JsonFormTimelineView },
  props: {
    pid: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    loaded: false,
    workspaceSelection: [],
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
    timelineItems () {
      return this.timeline.items
    }
  },
  methods: {
    ...mapTimelineActions({
      getTimelineForPatient: GET_TIMELINE_FOR_PATIENT
    }),
    formatDatetime(datetime) {
      return formatDatetime(datetime)
    },
    loadPatientDashboard() {
      setOpenEmrPatient(this.pid)
    }
  },
  mounted () {
    console.log("timeline mounted")
    document.title = "Timeline"
    this.getTimelineForPatient({ pid: this.pid }).then(timeline => {
      console.log(timeline)
      this.loaded = true
    })
  }
}
</script>

<style scoped>

</style>
