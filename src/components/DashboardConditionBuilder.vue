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
            <v-toolbar dense>
              <v-spacer></v-spacer>
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
            </v-toolbar>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-select
              v-model="rule.action"
              :items="actions"
            ></v-select>
          </v-col>
          <v-col>
            <v-select
              v-if="rule.action == 'Add Row Indicator'"
              v-model="rule.actionData.icon"
              :items="iconList"
            >
              <template v-slot:selection="{ item }">
                <v-icon  :color="rule.actionData.color">{{ item }}</v-icon>&nbsp; {{ item }}
              </template>

              <template v-slot:item="{ item }">
                <v-icon>{{ item }}</v-icon>&nbsp; {{ item }}
              </template>

            </v-select>
          </v-col>
          <v-col>
            <v-dialog
              v-if="rule.action == 'Add Row Indicator'"
              v-model="colorDialogs[ruleIndex]"
              width="500"
            >
              <template v-slot:activator="{ on, attrs }">
                <div class="mt-4">
                  <v-icon
                    :color="rule.actionData.color"
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
                    v-model="rule.actionData.color"
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
            <v-text-field label="Mouse-over note for indicator" v-model="rule.actionData.note"></v-text-field>
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
        'Show', 'Hide', 'Add Row Indicator'
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
        action: '',
        actionData: {
          icon: '',
          color: '',
          note: ''
        },
        logicalType: '',
        conditions: [],
      })
      this.addCondition(this.conditionalLogic.rules.length - 1)
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
