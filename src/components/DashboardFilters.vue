<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="900px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-bind="attrs"
        v-on="on"
      >
        <v-badge
          color="green"
          overlap
          :value="validConditionsCount"
          :content="validConditionsCount"
        >
          <v-icon>
            mdi-filter
          </v-icon>
        </v-badge>

      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Filters</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-btn-toggle
              v-model="toggle_indicator_filters"
              dense
              multiple
            >
              <v-btn v-for="(rule, index) in dashboardIndicatorFilterRules" :key="index">
                <v-icon :color="rule.action.actionData.color">{{ rule.action.actionData.icon }}</v-icon>
              </v-btn>

            </v-btn-toggle>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
          <IndicatorFilterReadOnly
            class="mb-2"
            v-for="(indicatorFilterRule, index) in activeIndicatorFilters"
            :key="index"
            :rule="indicatorFilterRule"
          ></IndicatorFilterReadOnly>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn
              class="mt-4"
              outlined
              color="primary"
              v-if="activeFilter.conditions.length == 0"
              @click="addFilter()"
            >
              Add Filter
            </v-btn>
          </v-col>
          <v-col>
          </v-col>
          <v-col>
          </v-col>
          <v-col>
          </v-col>
        </v-row>

        <v-card v-if="activeFilter.conditions.length > 0">
          <v-card-text>
            <v-row>
              <v-col>
                <v-select v-model="activeFilter.logicalType" :items="logicalTypes"></v-select>
              </v-col>
              <v-col>
              </v-col>
              <v-col>
              </v-col>
              <v-col>
              </v-col>
            </v-row>

            <v-row v-for="(filter, filterIndex) in activeFilter.conditions" :key="filterIndex">
              <v-col>
                <v-select :items="fieldOptions" v-model="filter.field"></v-select>
              </v-col>

              <v-col>
                <v-select :items="operators(filter.field)" v-model="filter.operator"></v-select>
              </v-col>

              <!-- If the filter field type is a list, render the list options -->
              <v-col>
                <v-autocomplete
                  v-if="isList(filter.field)"
                  v-model="filter.value"
                  :items="listOptionsForField(filter.field)"
                ></v-autocomplete>

                <v-text-field
                  v-else
                  v-model="filter.value"
                ></v-text-field>
              </v-col>

              <v-col cols="2">
                <v-btn-toggle dense>
                  <v-btn
                    icon
                    @click="removeFilter(filterIndex)"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="filterIndex == activeFilter.conditions.length - 1"
                    icon
                    @click="addFilter(filterIndex)"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <!-- -->
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="blue darken-1"
          text
          @click="clearFilters"
        >
          Clear
        </v-btn>
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
          @click="applyFilter"
        >
          Done
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import IndicatorFilterReadOnly from './IndicatorFilterReadOnly'
export default {
  name: 'DashboardFilters',
  components: { IndicatorFilterReadOnly },
  props: {
    dashboard: {
      type: Object,
      required: true
    },
    customFilter: {
      type: Object,
      required: true
    },
    indicatorFilters: {
      type: Array,
      required: false
    },
    listOptions: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dialog: false,
      toggle_indicator_filters: [],
      activeIndicatorFilters: [...this.indicatorFilters],
      activeFilter: {
        logicalType: 'All',
        ...this.customFilter
      }
    }
  },
  watch: {
    toggle_indicator_filters: {
      // Watch the indicator buttons and if they change, add or remove their associated filters from the dashbaord filters
      handler() {
        let that = this
        this.activeIndicatorFilters = []
        this.dashboardIndicatorFilterRules.forEach((rule, index) => {
          if (that.toggle_indicator_filters.includes(index)) {
            that.activeIndicatorFilters.push(rule)
          }
        })
        this.mergeFiltersAndEmit()
      },
      deep: true
    }
  },
  computed: {
    headers () {
      return this.dashboard.headers
    },
    logicalTypes() {
      return [
        'Any', 'All'
      ]
    },
    fieldOptions () {
      let fieldOptions = [
        { text: 'Referral.ID', value: 'Referral.ID' },
        { text: 'Patient.fname', value: 'Patient.fname' },
        { text: 'Patient.lname', value: 'Patient.lname' },
        { text: 'Patient.NextStepID', value: 'Patient.NextStepID' },
        { text: 'Patient.PID', value: 'Patient.PID' },
      ]

      // Now append the field headers
      this.headers.forEach(header => {
        // TODO for now we skip patient types because we have the hard-coded elements above
        if (header.type != 'patient') {
          fieldOptions.push({
            text: header.text,
            value: header.value
          })
        }
      })

      return fieldOptions
    },
    validConditionsCount () {
      let customFilterConditions = this.activeFilter.conditions.filter(filter => {
        if (filter.field && filter.operator) {
          return filter
        }
      })

      return customFilterConditions.length + this.activeIndicatorFilters.length
    },
    dashboardIndicatorFilterRules () {
      let rules = []
      this.dashboard.conditionalLogic.rules.forEach(rule => {
        if (rule.action.name == 'Add Row Indicator') {
          rules.push(rule)
        }
      })
      return rules
    },
  },
  methods: {
    mergeFiltersAndEmit () {
      let mergedFilters = {
          indicatorFilters: this.activeIndicatorFilters,
          customFilter: this.activeFilter
      }

      this.$emit('change', mergedFilters)
    },
    operators (expressionField) {
      let operators = [
        '=', 'contains'
      ]
      if (expressionField) {
        // TODO this doesn't drill down in to sub-fields like pid.DOB
        const header = this.headers.find(header => header.value == expressionField)
        // Header could be undefined if it's a manufactured filter type like Patient.fname
        if (header != undefined) {
          if (header.type == 'date' || header.type == 'datetime') {
            operators.push('UNTIL NOW(minutes) <')
            operators.push('UNTIL NOW(minutes) >')
            operators.push('UNTIL NOW(days) <')
            operators.push('UNTIL NOW(days) >')
            operators.push('UNTIL NOW(years) <')
            operators.push('UNTIL NOW(years) >')
          }
        }
        // else if (header.type == 'patient') {
        //   // TODO we can get this info dynamically from workspace.dataTypes
        //   operators.push('Is High Utilizer')
        // }
      }

      return operators
    },
    isList (field) {
      let retval = false
      if (field) {
        const header = this.headers.find(header => header.value == field)
        if (header != undefined) {
          retval = (header.type == 'list')
        }
      }

      return retval
    },
    listOptionsForField (field) {
      const header = this.headers.find(header => header.value == field)
      return this.listOptionsForHeader(header)
    },
    listOptionsForHeader (header) {
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
    removeFilter (filterIndex) {
      if (filterIndex > -1) {
        this.activeFilter.conditions.splice(filterIndex, 1)
      }
    },
    addPopulatedFilter (field, operator, value) {
      this.activeFilter.conditions.push({
        field: field,
        operator: operator,
        value: value
      })
    },
    addFilter () {
      this.activeFilter.conditions.push({
        field: '',
        operator: '',
        value: ''
      })
    },
    clearFilters () {
      this.activeFilter = {
        conditions: []
      }
      this.mergeFiltersAndEmit()
    },
    applyFilter () {
      this.dialog = false
      this.mergeFiltersAndEmit()
    }
  },
}
</script>

<style scoped>

</style>
