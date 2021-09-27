<template>
<v-form v-model="valid">
  <v-jsf v-model="model" :key="Math.floor(Math.random() * 32768)" :schema="schema" :options="optionsForForm">
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
      optionsForForm: { ...this.options }
    }
  },
  computed: {},
  mounted () {

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
        // let show = true
        let show = properties.conditionalLogic.action == 'Show'
        properties.conditionalLogic.conditions.forEach(condition => {
          console.log(condition)
        })

        if (!show) {
          that.optionsForForm.context[contextKey] = false
        }

        console.log('Condition Result: show = ' + show)
      }
    })

  }
}
</script>

<style scoped>

</style>
