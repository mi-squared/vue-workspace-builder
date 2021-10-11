<template>
  <div class="patient-picker">
    <v-card v-if="loaded == true" class="mx-auto" outlined>

      <v-system-bar height="36px">
        <v-spacer></v-spacer>

        <v-progress-linear
          v-if="loadingMatches"
          color="deep-purple accent-4"
          indeterminate
          rounded
          height="6"
        ></v-progress-linear>
        <div v-else>
        <span class="text-h6">{{ matches.length }}</span> potential matches
        </div>

        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon @click.stop="drawer = !drawer">mdi-dots-vertical</v-icon>
        </v-btn>
      </v-system-bar>

      <v-container>
        <v-row>
          <v-col>
            <v-text-field
              v-model="patient.fname"
              label="First name"
              required
              @keyup="uppercase(patient.fname)"
              @keydown="fetchMatches"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="patient.lname"
              label="Last name"
              required
              @keyup="uppercase(patient.lname)"
              @keydown="fetchMatches"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-dialog
              ref="dialog"
              v-model="modal"
              :return-value.sync="patient.DOB"
              persistent
              width="290px"
              @change="fetchMatches"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="patient.DOB"
                  label="DOB"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  @blur="formatDOB(patient.DOB)"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="patient.DOB"
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="modal = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.dialog.save(patient.DOB)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
          <v-col>
            <v-select
              label="sex"
              :items="listOptions.sex.data"
              v-model="patient.sex"
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              readonly
              disabled
              label="OpenEMR PID"
              v-model="patient.pid"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              readonly
              disabled
              label="Next Step ID"
              v-model="patient.NextStepID"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>

      <v-navigation-drawer
        absolute
        temporary
        right
        width="520px"
        v-model="drawer"
      >
        <template v-slot:prepend>
          <v-list-item two-line class="pink--text">
            <v-list-item-content>
              <v-list-item-title>{{ patient.fname }} {{ patient.lname }}</v-list-item-title>
              <v-list-item-subtitle>DOB: {{ patient.DOB }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-divider></v-divider>

        <v-list dense>
          <v-list-item
            three-line
            v-for="match in matches"
            :key="match.pid"
            color="blue lighten-5"
          >
            <v-list-item-content>
              <v-list-item-title>{{ match.fname }} {{ match.lname }}</v-list-item-title>
              <v-list-item-subtitle>DOB: {{ match.DOB }}</v-list-item-subtitle>
              <v-list-item-subtitle>sex: {{ match.sex }}</v-list-item-subtitle>
              <v-list-item-subtitle>pid: {{ match.pid }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-list-item-action-text v-text="match.text"></v-list-item-action-text>
              <!-- dont show "apply match if the patient is already set -->
              <v-btn v-if="match.pid != patient.pid" text @click="applyMatch(match)">Apply Match</v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-card>
    <v-card v-else>
      <v-skeleton-loader type="table-heading, table-thead, table-tfoot"></v-skeleton-loader>
    </v-card>
  </div>
</template>

<script>
import { fetchPatients } from '../../api'
import { formatDate } from '../../display-helpers'
import { createNamespacedHelpers } from 'vuex'
import { FETCH_LISTS_WITH_DATA_BULK } from '../../store/types-list'
import { GET_USER_META } from '../../store/types-user'
const { mapActions: mapListActions } = createNamespacedHelpers('list')
const { mapGetters: mapUserGetters } = createNamespacedHelpers('user')

export default {
  name: 'PatientPicker',
  props: {
    pid: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      loadingMatches: false,
      patient: {
        fname: "",
        lname: "",
        DOB: "",
        sex: "",
        pid: "",
        NextStepID: ""
      },
      matches: [],
      loaded: false,
      drawer: false, // Matching patients nav drawer
      modal: false, // DOB date-picker modal
      listOptions: {},
    }
  },
  computed: {
    ...mapUserGetters({
      getUserMeta: GET_USER_META
    })
  },
  methods: {
    ...mapListActions({
      fetchListsBulk: FETCH_LISTS_WITH_DATA_BULK
    }),
    formatDOB(date) {
      // TODO date formatting should follow OpenEMR date format
      console.log(formatDate(date))
    },
    uppercase(data) {
      data = data.toUpperCase()
     return data
    },
    applyMatch(match) {
      this.patient = { ...match }
      this.$emit('changed', { patient: this.patient })
      this.drawer = false
    },
    /**
     * When fname or lname boxes are typed in (@keydown), or DOB is changed
     */
    fetchMatches() {
      if (this.patient.fname.length > 2 ||
        this.patient.lname.length > 2 ||
      this.patient.DOB.length > 2) {
        this.loadingMatches = true
        const userMeta = this.getUserMeta
        const patientRequest = { ...this.patient }
        fetchPatients(patientRequest, userMeta).then(matches => {
          this.matches = matches
          console.log(matches)
          this.loadingMatches = false
        })
      }
    }
  },
  mounted () {
    const listIdsForFetch = ['sex']
    this.fetchListsBulk({ arrayOfListIds: listIdsForFetch }).then(listOptions => {
      // We are basically copying all the lists to local state here (TODO we really only need the ones with IDs we identified)
      this.listOptions = listOptions
      this.loaded = true
    })
  }
}
</script>

<style scoped>

</style>
