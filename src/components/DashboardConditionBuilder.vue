<template>
  <v-sheet>
    <v-card v-for="(rule, ruleIndex) in conditionalLogic.rules" :key="ruleIndex" class="mt-2" outlined elevation="2">
      <v-card-text>
        <v-row>
          <v-col>
            <v-select v-model="rule.logicalType" :items="logicalTypes"></v-select>
          </v-col>
          <v-col>
          </v-col>
          <v-col>
          </v-col>
          <v-col>
          </v-col>
        </v-row>

        <v-row v-for="(condition, index) in rule.conditions" :key="index">
          <v-col>
            <v-select :items="fieldOptions" v-model="condition.field"></v-select>
          </v-col>

          <v-col>
            <v-select :items="operators(condition.field)" v-model="condition.operator"></v-select>
          </v-col>

          <v-col>
            <v-text-field v-model="condition.value"></v-text-field>
          </v-col>

          <v-col>
            <v-toolbar dense>
              <v-btn
                icon
                @click="removeCondition(index)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-btn
                v-if="index == rule.conditions.length - 1"
                icon
                @click="addCondition(index)"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-toolbar>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select v-model="rule.action" :items="actions"></v-select>
          </v-col>
          <v-col>
          </v-col>
          <v-col>
          </v-col>
          <v-col>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-btn
      class="mt-4"
      outlined
      right
      @click="addRule"
    >
      + Add Conditional Logic
    </v-btn>
  </v-sheet>
</template>

<script>
export default {
  name: 'DashboardConditionBuilder',
  props: {
    dashboard: {
      type: Object,
      required: true
    },
    dataSource: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      conditionalLogic: {
        rules: [],
        ...this.dashboard.conditionalLogic
      }
    }
  },
  watch: {
    conditionalLogic: {
      // Watch the conditional logic and if it changes, bubble up to parent
      handler() {
        this.$emit('change', this.conditionalLogic)
      },
      deep: true
    }
  },
  computed: {
    actions() {
      return [
        'Show', 'Hide', 'Display Row Icon', 'Show Alert'
      ]
    },
    logicalTypes() {
      return [
        'Any', 'All'
      ]
    },
    fieldOptions() {
      let options = []
      Object.values(this.dashboard.headers).forEach(function(header) {
        options.push({
          text: header.text,  // title
          value: header.value // data source column
        })
      })

      return options
    },
  },
  methods: {
    operators(expressionField) {
      let operators = [
        '>', '<', '=', '!='
      ]
      if (expressionField) {
        const type = this.dataSource.spec.columns[expressionField].type
        if (type == 'date' || type == 'datetime') {
          operators.push('UNTIL NOW(minutes) <')
          operators.push('UNTIL NOW(minutes) >')
        } else if (type == 'patient') {
          // TODO we can get this info dynamically from workspace.dataTypes
          operators.push('Is High Utilizer')
        }
      }

      return operators

    },
    addRule() {
      this.conditionalLogic.rules.push({
        action: '',
        logicalType: '',
        conditions: [],
      })
    },
    /**
     * Remove a condition from the array by it's index using splice()
     * @param index
     */
    removeCondition(index) {
      if (index > -1) {
        this.conditionalLogic.rules[index].conditions.splice(index, 1);
      }
    },
    addCondition(index) {
      this.conditionalLogic.rules[index].conditions.push({
        field: '',
        operator: '',
        value: ''
      })
    }
  },
  mounted () {
    // If we don't have any rules, render the form for the first condition
    // to reduce clicking and conditional rendering on this template
    if (this.conditionalLogic.rules.length == 0) {
      this.addRule()

      // If we don't have any conditions, add a template condition to the rule we just added
      // at index 0
      if (this.conditionalLogic.rules[0].conditions.length == 0) {
        this.addCondition(0)
      }
    }
  }
}
</script>

<style scoped>

</style>
