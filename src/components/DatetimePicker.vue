<template>
  <v-menu
    v-model="display"
    transition="scale-transition"
    offset-y
    max-width="340px"
    min-width="340px"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        style="font-size: smaller;"
        v-bind="textFieldProps"
        :disabled="disabled"
        :loading="loading"
        :label="label"
        :value="formattedDatetime"
        v-on="on"
        readonly
      >
        <template v-slot:progress>
          <slot name="progress">
            <v-progress-linear color="primary" indeterminate absolute height="2"></v-progress-linear>
          </slot>
        </template>

        <v-icon slot="prepend-inner" small>mdi-clock</v-icon>
      </v-text-field>
    </template>

    <v-card>
      <v-card-text class="px-0 py-0">
        <v-tabs fixed-tabs v-model="activeTab">
          <v-tab key="calendar">
            <slot name="dateIcon">
              <v-icon>event</v-icon>
            </slot>
          </v-tab>
          <v-tab key="timer" :disabled="dateSelected">
            <slot name="timeIcon">
              <v-icon>access_time</v-icon>
            </slot>
          </v-tab>
          <v-tab-item key="calendar">
            <v-date-picker
              class="rounded-0"
              v-model="date"
              v-bind="datePickerProps"
              @input="showTimePicker"
              full-width
            ></v-date-picker>
          </v-tab-item>
          <v-tab-item key="timer">
            <v-time-picker
              format="24hr"
              ref="timer"
              class="v-time-picker-custom rounded-0"
              v-model="time"
              v-bind="timePickerProps"
              full-width
            ></v-time-picker>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="okHandler"
              class="btn-sm"
              icon
              color="primary"
              v-bind="attrs"
              v-on="on"
            ><v-icon>mdi-check-bold</v-icon></v-btn>
          </template>
          <!-- button tooltip -->
          <span>Save</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="clearHandler"
              class="btn-sm"
              icon
              v-bind="attrs"
              v-on="on"
            ><v-icon>mdi-cancel</v-icon></v-btn>
          </template>
          <!-- button tooltip -->
          <span>Clear</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="onClose"
              class="btn-sm"
              icon
              v-bind="attrs"
              v-on="on"
            ><v-icon>mdi-close</v-icon></v-btn>
          </template>
          <!-- button tooltip -->
          <span>Cancel</span>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import { format, parse } from 'date-fns'

// We need to return a string in correct TZ
import moment from 'moment-timezone'

const DEFAULT_DATE = null
const DEFAULT_TIME = null
const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd'
const DEFAULT_TIME_FORMAT = 'HH:mm:ss'
const DEFAULT_CLEAR_TEXT = 'CLEAR'
const DEFAULT_OK_TEXT = 'OK'

export default {
  name: 'DatetimePicker',
  model: {
    prop: 'datetime',
    event: 'input'
  },
  props: {
    datetime: {
      type: [Date, String],
      default: null
    },
    timeZone: {
      type: String,
      default: 'America/Phoenix'
    },
    disabled: {
      type: Boolean
    },
    loading: {
      type: Boolean
    },
    label: {
      type: String,
      default: ''
    },
    dateFormat: {
      type: String,
      default: DEFAULT_DATE_FORMAT
    },
    timeFormat: {
      type: String,
      default: 'HH:mm'
    },
    clearText: {
      type: String,
      default: DEFAULT_CLEAR_TEXT
    },
    okText: {
      type: String,
      default: DEFAULT_OK_TEXT
    },
    textFieldProps: {
      type: Object
    },
    datePickerProps: {
      type: Object
    },
    timePickerProps: {
      type: Object
    }
  },
  data() {
    return {
      display: false,
      activeTab: 0,
      date: DEFAULT_DATE,
      time: DEFAULT_TIME,
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    dateTimeFormat() {
      return this.dateFormat + ' ' + this.timeFormat
    },
    defaultDateTimeFormat() {
      return DEFAULT_DATE_FORMAT + ' ' + DEFAULT_TIME_FORMAT
    },
    formattedDatetime() {
      return this.selectedDatetime ? format(this.selectedDatetime, this.dateTimeFormat) : ''
    },
    selectedDatetime() {
      if (this.date && this.time) {
        let datetimeString = this.date + ' ' + this.time
        if (this.time.length === 5) {
          datetimeString += ':00'
        }
        return parse(datetimeString, this.defaultDateTimeFormat, new Date())
      } else {
        return null
      }
    },
    dateSelected() {
      return !this.date
    }
  },
  methods: {
    init() {
      let initDateTime

      // If no datetime is set, initialize to "now"
      if (!this.datetime) {
        if (this.display == true) {
          initDateTime = new Date()
        } else {
          return
        }
      }

      if (this.datetime instanceof Date) {
        initDateTime = this.datetime
      } else if (typeof this.datetime === 'string' || this.datetime instanceof String) {
        // see https://stackoverflow.com/a/9436948
        // KCC on init, use the default (mysql) date time format to parse
        initDateTime = parse(this.datetime, this.defaultDateTimeFormat, new Date())
      }

      const date = format(initDateTime, DEFAULT_DATE_FORMAT)
      this.date = date
      const time = format(initDateTime, DEFAULT_TIME_FORMAT)
      this.time = time

      if (this.display === true) {
        this.$emit("show", true)
      } else {
        this.$emit("show", false)
      }
    },
    okHandler() {
      this.resetPicker()
      let outputDatetime = this.selectedDatetime
      if (outputDatetime instanceof Date) {
        outputDatetime = moment(this.selectedDatetime).format('YYYY-MM-DD HH:mm:ss')
      }
      this.$emit('input', outputDatetime)
      this.display = false
    },
    clearHandler() {
      this.resetPicker()
      this.date = DEFAULT_DATE
      this.time = DEFAULT_TIME
      //this.$emit('input', null)
    },
    onClose () {
      let initDateTime = null
      if (this.datetime instanceof Date) {
        initDateTime = this.datetime
      } else if (typeof this.datetime === 'string' || this.datetime instanceof String) {
        // see https://stackoverflow.com/a/9436948
        // KCC on init, use the default (mysql) date time format to parse
        initDateTime = parse(this.datetime, this.defaultDateTimeFormat, new Date())
      }

      if (initDateTime) {
        const date = format(initDateTime, DEFAULT_DATE_FORMAT)
        this.date = date
        const time = format(initDateTime, DEFAULT_TIME_FORMAT)
        this.time = time
      } else {
        this.date = null
        this.time = null
      }
      this.resetPicker()
      this.display = false
    },
    resetPicker() {
      //this.display = false
      this.activeTab = 0
      if (this.$refs.timer) {
        this.$refs.timer.selectingHour = true
      }
    },
    showTimePicker() {
      this.activeTab = 1
    }
  },
  watch: {
    datetime: function() {
      this.init()
    },
    display: function () {
      this.init()
    }
  }
}
</script>
