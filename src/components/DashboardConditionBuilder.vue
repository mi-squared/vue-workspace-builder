<template>
  <v-sheet>
    <v-card v-for="(rule, ruleIndex) in conditionalLogic.rules" :key="ruleIndex" class="mt-2" outlined elevation="2">
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="removeRule(ruleIndex)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-actions>
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

        <v-row v-for="(condition, conditionIndex) in rule.conditions" :key="conditionIndex">
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
            <v-btn-toggle dense>
              <v-btn
                icon
                @click="removeCondition(ruleIndex, conditionIndex)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-btn
                v-if="conditionIndex == rule.conditions.length - 1"
                icon
                @click="addCondition(ruleIndex)"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>

        <!-- Row for the action -->
        <v-row>
          <v-col>
            <v-select
              v-model="rule.action.name"
              :items="actions"
            ></v-select>
          </v-col>
          <v-col>
            <v-select
              v-if="rule.action.name == 'Add Row Indicator'"
              v-model="rule.action.actionData.icon"
              :items="iconList"
            >
              <template v-slot:selection="{ item }">
                <v-icon  :color="rule.action.actionData.color">{{ item }}</v-icon>&nbsp; {{ item }}
              </template>

              <template v-slot:item="{ item }">
                <v-icon>{{ item }}</v-icon>&nbsp; {{ item }}
              </template>

            </v-select>

            <!-- For the Move to Dashboard action -->
            <v-select
              v-else-if="rule.action.name == 'Move to Dashboard'"
              v-model="rule.action.actionData.dashboardId"
              :items="dashboards"
            >
            </v-select>

          </v-col>
          <v-col>
            <v-dialog
              v-if="rule.action.name == 'Add Row Indicator'"
              v-model="colorDialogs[ruleIndex]"
              width="500"
            >
              <template v-slot:activator="{ on, attrs }">
                <div class="mt-4">
                  <v-icon
                    :color="rule.action.actionData.color"
                    v-bind="attrs"
                    v-on="on">
                    mdi-format-color-fill
                  </v-icon>
                </div>
              </template>

              <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                  Select Color
                </v-card-title>

                <v-card-text>
                  <v-color-picker
                    v-model="rule.action.actionData.color"
                    class="ma-2"
                    dot-size="31"
                    hide-inputs
                    show-swatches
                    swatches-max-height="200"
                  ></v-color-picker>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    text
                    @click="colorDialogs[ruleIndex] = false"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <v-col>
            <v-text-field
              v-if="rule.action.name == 'Add Row Indicator'"
              label="Mouse-over note for indicator"
              v-model="rule.action.actionData.note"
            ></v-text-field>
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
import { humanizeDataSourceString } from '../display-helpers'

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
      colorDialogs: {},
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
    iconList() {
      return [
        'mdi-circle',
        'mdi-message-text',
        'mdi-email',
        'mdi-arrow-up-bold-box-outline'
      ];
    },
    actions() {
      return [
        'Archive',
        'Add Row Indicator',
        'Move to Dashboard'
      ]
    },
    logicalTypes() {
      return [
        'Any', 'All'
      ]
    },
    /**
     * For conditional logic, these are the fields that are available to do comparisons with
     */
    fieldOptions() {
      let options = []
      Object.values(this.dataSource.spec.columns).forEach(function(column) {
        options.push({
          text: humanizeDataSourceString(column.name),  // title
          value: column.name // data source column name
        })
      })

      return options
    },
    dashboards () {
      // Dashboard model has workspaces = { { id: title }, { id: title } } format for dashboards with ids as keys
      let dashboards = []
      Object.keys(this.dashboard.dashboardsInWorkspace).forEach(id => {
        if (Number(id) != Number(this.dashboard.id)) {
          dashboards.push({
            text: this.dashboard.dashboardsInWorkspace[id],
            value: id
          })
        }
      })
      return dashboards
    },
  },
  methods: {
    operators(expressionField) {
      let operators = [
        '>', '<', '=', '!='
      ]
      if (expressionField &&
        this.dataSource.spec.columns[expressionField] != undefined) {
        // TODO this doesn't drill down in to sub-fields like pid.DOB
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
        action: {
          name: '',
          actionData: {
            icon: '',
            color: '',
            note: ''
          }
        },
        logicalType: '',
        conditions: [],
      })
      this.addCondition(this.conditionalLogic.rules.length - 1)
    },
    removeRule(ruleIndex) {
      this.conditionalLogic.rules.splice(ruleIndex, 1)
    },
    /**
     * Remove a condition from the array by it's index using splice()
     * @param index
     */
    removeCondition(ruleIndex, conditionIndex) {
      if (ruleIndex > -1) {
        this.conditionalLogic.rules[ruleIndex].conditions.splice(conditionIndex, 1);
      }
    },
    addCondition(ruleIndex) {
      this.conditionalLogic.rules[ruleIndex].conditions.push({
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
