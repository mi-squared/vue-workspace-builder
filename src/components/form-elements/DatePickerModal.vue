<template>
<div class="date-picker-modal relative-container">
  <v-menu
    :key="id"
    :ref="index"
    v-model="menu"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="auto"
    :close-on-content-click="false"
    attach
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        dense
        :value="formatDate(myValue)"
        v-bind="attrs"
        @blur="myValue = parseDate(myValue)"
        v-on="on"
        class="mt-4"
        style="font-size: smaller;"
      >
        <v-icon slot="prepend-inner" small>mdi-calendar</v-icon>
      </v-text-field>
    </template>
    <v-card>
      <v-date-picker
        v-model="myValue"
        no-title
      ></v-date-picker>

      <v-card-actions>

        <v-spacer></v-spacer>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="onSave"
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
              @click="onClear"
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
</div>
</template>

<script>
import { formatDate } from '../../display-helpers'
import moment from 'moment-timezone'

export default {
  name: 'DatePickerModal',
  props: {
    id: {
      type: String,
      required: true
    },
    model: {
      type: Object,
      required: true
    },
    index: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      menu: false,
      activeModel: this.model,
      myValue: null,
    }
  },
  watch: {
    menu: function () {
      if (this.menu === true) {
        this.$emit("show", true)
        // If
        if (this.myValue == undefined ||
          this.myValue == null) {
          this.myValue = moment().format('YYYY-MM-DD')
        }
      } else {
        this.$emit("show", false)
      }
    }
  },
  methods: {
    onSave () {
      this.activeModel[this.index] = this.myValue
      this.$emit('changed', {
        entity: this.activeModel,
        fieldKey: this.index
      })
      this.menu = false
    },
    onClose () {
      this.myValue = this.model[this.index]
      this.menu = false
    },
    onClear () {
      this.myValue = null
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
  },
  mounted () {
    if (this.activeModel[this.index] !== undefined &&
      this.activeModel[this.index] !== null) {
      this.myValue = this.activeModel[this.index]
    }
  },
  beforeDestroy () {
    this.activeModel = null
  }
}
</script>

<style scoped>

</style>
