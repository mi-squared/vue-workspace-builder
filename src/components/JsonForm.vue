<template>
<v-form v-model="valid">
  <v-jsf
    v-model="activeModel"
    :key="Math.floor(Math.random() * 32768)"
    :schema="schema"
    :options="activeOptions"
    @input="onFormChange"
    @input-child="onFormChange"
    @change="onFormChange"
    @change-child="onFormChange"
  >
    <!-- Templates for custom elements -->
    <template slot="custom-patient" slot-scope="context">
      <PatientPicker :pid="pid" v-bind="context"></PatientPicker>
<!--      <v-date-picker v-bind="context"></v-date-picker>-->
    </template>
  </v-jsf>
</v-form>
</template>

<script>
import VJsf from "@koumoul/vjsf/lib/VJsf.js";
import "@koumoul/vjsf/dist/main.css";
import PatientPicker from './form-elements/PatientPicker'

export default {
  name: "JsonForm",
  components: {
    PatientPicker,
    VJsf
  },
  props: {
    form: {
      type: Object,
      required: true
    },
    model: {
      type: Object,
      required: true,
    },
    schema: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      required: true
    },
    pid: {
      type: Number,
      required: false
    }
  },
  data () {
    return {
      valid: false,
      /**
       * Options are cloned, and modified in the mounted() function to add some dynamic
       * capabilities like conditional rendering.
       */
      optionsForForm: { ...this.options },
      activeModel: { ...this.model }
    }
  },
  computed: {
    activeOptions() {
      let that = this
      // Need to combine the options stored in VUEX, and merge with computed options
      // so that we can provide the context for conditional rendering. Here we process
      // the conditional logic and set the properties on the options object. We build context here
      that.optionsForForm.idPrefix = 'example-_x-if-'
      that.optionsForForm.context = {}
      Object.values(this.schema.properties).forEach(function(properties) {

        // Get the string key for context object
        let contextKey = properties["x-if"]
        contextKey = contextKey.replace("context.", "")

        // Always set option to show by default
        that.optionsForForm.context[contextKey] = true
        if (properties.hasConditionalLogic) {
          // Check to see if conditions are met to display this field

          // First, if the action is to show, set show to true, otherwise set show to false
          let show = properties.conditionalLogic.action == 'Show'

          // We are going to count the number of conditions that pass
          let passCount = 0
          properties.conditionalLogic.conditions.forEach(condition => {
            const fieldValue = that.activeModel[condition.field]
            let pass = false
            if (condition.operator === '>') {
              pass = (fieldValue > condition.value)
            } else if (condition.operator === '<') {
              pass = (fieldValue < condition.value)
            } else if (condition.operator === '=') {
              pass = (fieldValue == condition.value)
            } else if (condition.operator === '!=') {
              pass = (fieldValue != condition.value)
            } else {
              alert('invalid operator')
            }

            if (pass) {
              passCount++
            }

            console.log('Condition Passes? ' + pass + ' ' + condition)
          })

          console.log(passCount + ' out of ' + properties.conditionalLogic.conditions.length + ' conditions passed.')

          // If the logical type is set to all, and not all conditions pass, then
          // we invert the show property
          if (properties.conditionalLogic.logicalType == 'All' &&
            passCount < properties.conditionalLogic.conditions.length) {
            show = !show
          } else if (properties.conditionalLogic.logicalType == 'Any' &&
            passCount == 0) {
            show = !show
          }

          // If the result of our conditions are to "NOT SHOW" then we set our context key to false,
          // which will tell VJSF to not display the form using v-if directive
          if (!show) {
            that.optionsForForm.context[contextKey] = false
          }

          console.log('Condition Result: show = ' + show)
        }
      })

      return this.optionsForForm
    }
  },
  methods: {
    onFormChange(param) {
      console.log(param)
    }
  },
  mounted () {
  }
}
</script>

<style scoped>

</style>
