<template>
<div class="date-picker-modal">
  <v-menu
    :key="id"
    :ref="index"
    v-model="menu"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="auto"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        dense
        :value="formatDate(activeModel[index])"
        v-bind="attrs"
        @blur="activeModel[index] = parseDate(activeModel[index])"
        v-on="on"
        class="mt-4"
        style="font-size: smaller;"
      >
        <v-icon slot="prepend-inner" small>mdi-calendar</v-icon>
      </v-text-field>
    </template>
    <v-card>
      <v-date-picker
        v-model="activeModel[index]"
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
      activeModel: { ...this.model },
    }
  },
  watch: {
    menu: function () {
      if (this.menu === true) {
        // If
        if (this.activeModel[this.index] == undefined ||
          this.activeModel[this.index] == null) {
          this.activeModel[this.index] = moment().format('YYYY-MM-DD')
        }
      }
    }
  },
  methods: {
    onSave () {
      this.$emit('changed', this.activeModel)
      this.menu = false
    },
    onClose () {
      this.activeModel = this.model
      this.menu = false
    },
    onClear () {
      this.activeModel[this.index] = null
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

  }
}
</script>

<style scoped>

</style>
