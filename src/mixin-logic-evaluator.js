import * as moment from 'moment-timezone'

export const MixinLogicEvaluator = {
  methods: {
    evaluateConditionalLogic(conditionalLogic, model, options) {

      let results = []
      conditionalLogic.rules.forEach(rule => {

        const action = rule.action
        const performAction = this.evaluateRule(rule, model, options)
        const result = {
          action: action,
          result: performAction
        }

        results.push(result)
      })

      return results
    },
    evaluateRule(rule, model, options) {
      const timeZone = options.timeZone || 'America/Phoenix'
      let performAction = false
      // We are going to count the number of conditions that pass
      let passCount = 0
      rule.conditions.forEach(condition => {

        const fieldValue = model[condition.field]
        let pass = false
        if (condition.operator === '>') {
          pass = (fieldValue > condition.value)
        } else if (condition.operator === '<') {
          pass = (fieldValue < condition.value)
        } else if (condition.operator === '=') {
          pass = (fieldValue == condition.value)
        } else if (condition.operator === '!=') {
          pass = (fieldValue != condition.value)
        } else if (condition.operator === 'UNTIL NOW(minutes) <') {
          // This passes if the difference between now and then is less than the condition value
          const rightNow = moment().tz(timeZone).toISOString()
          const then = moment(fieldValue).toISOString()
          pass = false
          if (moment(rightNow).diff(then, 'minute') < condition.value) {
            pass = true
          }
        } else if (condition.operator === 'UNTIL NOW(minutes) >') {
          // This passes if the difference between now and then is greater than the condition value
          const rightNow = moment().tz(timeZone).toISOString()
          const then = moment(fieldValue).toISOString()
          pass = false
          if (moment(rightNow).diff(then, 'minute') > condition.value) {
            pass = true
          }
        } else {
          alert('invalid operator')
        }

        if (pass) {
          passCount++
        }

        console.log('Condition Passes? ' + pass + ' ' + condition)
      })

      // If the logical type is set to all, and not all conditions pass, then
      // we do not perform the action
      if (rule.logicalType == 'All' &&
        passCount == rule.conditions.length) {
        performAction = true
      } else if (rule.logicalType == 'Any' &&
        passCount > 0) {
        performAction = true
      }

      return performAction
    },
  }
}
