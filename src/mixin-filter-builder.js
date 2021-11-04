// import * as moment from 'moment-timezone'

export const MixinFilterBuilder = {
  data: function () {
    return {
      conditionalLogic: {
        rules: [],
      }
    }
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
  }
}
