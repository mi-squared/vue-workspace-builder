<template>
  <div class="patient-picker" id="patient-picker">
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
        <span v-if="activeLocked == false">
          <span class="text-h6" >{{ matches.length }}</span> potential matches
        </span>
        </div>

        <v-spacer></v-spacer>
        <v-btn icon v-if="activeLocked" @click="activeLocked = false"><v-icon>mdi-lock</v-icon></v-btn>
        <v-btn icon v-else @click="activeLocked = true"><v-icon>mdi-lock-open</v-icon></v-btn>
      </v-system-bar>

      <v-container>
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <v-text-field
                  class="uppercase"
                  v-model="activePatient.fname"
                  label="First name"
                  required
                  @keyup="activePatient.fname = uppercase(activePatient.fname)"
                  @input="onPatientChanged"
                  :readonly="readonly"
                  :disabled="readonly"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  class="uppercase"
                  v-model="activePatient.lname"
                  label="Last name"
                  required
                  @keyup="activePatient.lname = uppercase(activePatient.lname)"
                  @input="onPatientChanged"
                  :readonly="readonly"
                  :disabled="readonly"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>

                <v-text-field
                  v-mask="'##/##/####'"
                  hint="mm/dd/yyyy"
                  persistent-hint
                  v-model="formattedDOB"
                  label="DOB"
                  @blur="activePatient.DOB = formatDOBMysql(formattedDOB)"
                  @input="onPatientChanged"
                  :readonly="readonly"
                  :disabled="readonly"
                >
                  <span slot="prepend">
                    <v-icon
                    >
                      mdi-calendar
                    </v-icon>
                  </span>
                </v-text-field>

              </v-col>
              <v-col>
                <v-select
                  label="sex"
                  :items="listOptions.sex.data"
                  v-model="activePatient.sex"
                  :readonly="readonly"
                  :disabled="readonly"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col>

                <v-text-field
                  v-mask="'###-###-####'"
                  hint="555-555-5555"
                  persistent-hint
                  v-model="activePatient.phone_home"
                  label="Phone Home"
                  @input="onPatientChanged"
                >
                </v-text-field>

              </v-col>
              <v-col>
                <v-text-field
                  v-mask="'###-###-####'"
                  hint="555-555-5555"
                  persistent-hint
                  v-model="activePatient.phone_cell"
                  @input="onPatientChanged"
                  label="Phone Cell"
                >
                </v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field
                  readonly
                  disabled
                  label="OpenEMR PID"
                  v-model="activePatient.pid"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  readonly
                  disabled
                  label="Next Step ID"
                  v-model="activePatient.NextStepID"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="activeLocked == false">

            <v-card
              class="overflow-y-auto"
              max-height="400"
              min-height="400"
              min-width="360"
              max-width="520"
              elevation="1"
            >
              <v-banner>
                <v-list-item two-line class="pink--text">
                  <v-list-item-content>
                    <v-list-item-title>{{ activePatient.fname }} {{ activePatient.lname }}</v-list-item-title>
                    <v-list-item-subtitle>DOB: {{ formattedDOB }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-banner>

              <v-card-text>
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
                      <v-btn v-if="match.pid != activePatient.pid" text @click="applyMatch(match)">Apply Match</v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

          </v-col>
        </v-row>
      </v-container>



      <v-card-actions v-if="activeLocked == false">
        <v-btn
          @click="clearPatient"
        >
          Clear Patient
          <v-icon
            right
            dark
          >
            mdi-cancel
          </v-icon>
        </v-btn>
      </v-card-actions>

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
// import moment from 'moment-timezone'
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
    },
    patient: {
      type: Object,
      required: false
    },
    locked: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      loadingMatches: false,
      activeLocked: false,
      activePatient: {...this.patient }, // Reference to our patient prop, so it stays reactive
      DOB: "",
      formattedDOB: "",
      matches: [],
      loaded: false,
      modal: false, // DOB date-picker modal
      listOptions: {},
    }
  },
  computed: {
    ...mapUserGetters({
      getUserMeta: GET_USER_META
    }),
    readonly () {
      return this.activePatient.pid != "" && this.activePatient.pid != null
    }
  },
  methods: {
    ...mapListActions({
      fetchListsBulk: FETCH_LISTS_WITH_DATA_BULK
    }),
    clearPatient () {
      this.activePatient = {
        fname: "",
        lname: "",
        DOB: "",
        sex: "",
        pid: "",
        NextStepID: "",
        phone_home: "",
        phone_cell: "",
      }
      this.matches = []
    },
    formatDOBMysql(date) {
      // TODO date formatting should follow OpenEMR date format
      console.log(date)
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    uppercase(data) {
      if (data != undefined) {
        data = data.toUpperCase()
      } else {
        data = ''
      }
      return data
    },
    applyMatch(match) {

      this.formattedDOB = match.DOB
        this.activePatient = {
        ...match,
        DOB: this.formatDOBMysql(match.DOB)
      }
      this.$emit('changed', { patient: this.activePatient })
    },
    onPatientChanged () {
      //this.activePatient.DOB = moment(this.formattedDOB, 'mm/dd/YYYY').format('YYYY-MM-DD')
      this.activePatient.DOB = this.formatDOBMysql(this.formattedDOB)
      if (this.loaded) {
        this.$emit('changed', { patient: this.activePatient })
      }
    },
    /**
     * When fname or lname boxes are typed in (@keydown), or DOB is changed
     */
    fetchMatches() {
      if (this.activePatient != undefined &&
        (this.activePatient.fname.length > 2 ||
        this.activePatient.lname.length > 2 ||
        this.activePatient.DOB.length > 2)) {
        this.loadingMatches = true
        const userMeta = this.getUserMeta
        const patientRequest = {

          ...this.activePatient,
          DOB: this.formattedDOB, // Send DOB to server in format 10/01/1976
        }
        fetchPatients(patientRequest, userMeta).then(matches => {
          this.matches = matches
          console.log(matches)
          this.loadingMatches = false
        })
      }
    },
    debounce(callback, wait) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(function () { callback.apply(this, args); }, wait);
      };
    }

  },
  created () {
    if (this.locked != undefined) {
      this.activeLocked = this.locked
    } else {
      this.activeLocked = true
    }
  },
  mounted () {
    const listIdsForFetch = ['sex']
    this.fetchListsBulk({ arrayOfListIds: listIdsForFetch }).then(listOptions => {
      // We are basically copying all the lists to local state here (TODO we really only need the ones with IDs we identified)
      this.listOptions = listOptions

      // If we were passed a pid, load that patient model
      this.formattedDOB = formatDate(this.activePatient.DOB)

      this.loaded = true
    })

    let picker = document.getElementById('patient-picker')
    picker.addEventListener('keyup', this.debounce( () => {
      if (this.activeLocked == false) {
        // code you would like to run 1000ms after the keyup event has stopped firing
        // further keyup events reset the timer, as expected
        this.fetchMatches()
      }
    }, 500))
  }
}
</script>

<style scoped>
.uppercase {
  text-transform: uppercase;
}
</style>
