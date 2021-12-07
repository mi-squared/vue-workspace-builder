<template>
  <div class="json-form">
    <v-form v-if="loaded" v-model="valid">
      <v-jsf
        v-model="activeModel"
        :key="form.id"
        :schema="activeSchema"
        :options="optionsForForm"
        @input="onFormChange"
      >
        <!-- Templates for custom elements -->
        <template slot="custom-patient" slot-scope="context">
          <PatientPicker :pid="pid" :patient="activePatient" :locked="patientPickerLocked" v-bind="context" @changed="onPatientChanged"></PatientPicker>
    <!--      <v-date-picker v-bind="context"></v-date-picker>-->
        </template>

        <template slot="custom-user" slot-scope="context">
          <v-autocomplete v-bind="context" :items="listOptions['active_users'].data"></v-autocomplete>
        </template>
      </v-jsf>
    </v-form>
    <v-skeleton-loader v-else type="article, actions "></v-skeleton-loader>
  </div>
</template>

<script>
import VJsf from "@koumoul/vjsf/lib/VJsf.js";
import "@koumoul/vjsf/dist/main.css";
import PatientPicker from './form-elements/PatientPicker'
import { createNamespacedHelpers } from 'vuex'
import { FETCH_LISTS_WITH_DATA_BULK, GET_LIST } from '../store/types-list'
import { MixinLogicEvaluator } from '../mixin-logic-evaluator'
const { mapGetters: mapListGetters, mapActions: mapListActions } = createNamespacedHelpers('list')

export default {
  name: "JsonForm",
  mixins: [MixinLogicEvaluator],
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
    },
    patient: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      patientPickerLocked: false,
      loaded: false,
      valid: false,
      listOptions: {},
      /**
       * Options are cloned, and modified in the mounted() function to add some dynamic
       * capabilities like conditional rendering.
       */
      optionsForForm: { ...this.options },
      activeModel: { ...this.model },
      activePatient: { ...this.patient },
      activeSchema: { ...this.schema }
    }
  },
  computed: {
    ...mapListGetters({
      getList: GET_LIST
    })
  },
  methods: {
    ...mapListActions({
      fetchListsBulk: FETCH_LISTS_WITH_DATA_BULK
    }),
    onFormChange(param) {
      if (this.loaded) {
        this.$emit('changed', {
          model: this.activeModel,
          patient: this.activePatient
        })
        this.optionsForForm = this.calculateOptions()
        console.log("onFormChange(param)")
        console.log(param)
      } else {
        console.log("onFormChange: skipping notification parent")
      }
    },
    onPatientChanged(data) {
      const patient = data.patient
      this.activeModel.pid = patient.pid
      this.activePatient = patient
      this.onFormChange(this.activeModel.pid)
    },
    calculateOptions() {
      let that = this
      let options = { ...this.optionsForForm }
      // Need to combine the options stored in VUEX, and merge with computed options
      // so that we can provide the context for dynamic lists, or conditional rendering, etc. Here we process
      // the conditional logic and set the properties on the options object. We build context here
      options.idPrefix = 'example-_x-if-'
      options.context = {}
      Object.values(this.activeSchema.properties).forEach(function(properties) {

        // Get the string key for context object
        let contextKey = properties["x-if"]
        contextKey = contextKey.replace("context.", "")

        // Always set option to show by default
        options.context[contextKey] = true
        if (properties.hasConditionalLogic) {

          // First, if the action is to show, set show to true, otherwise set show to false
          let show = properties.conditionalLogic.action == 'Show'

          // Check to see if conditions are met to display this field
          // The form fields only have one rule, so use evaluateRule rather than evaluateCondition
          const performAction = that.evaluateRule(
            properties.conditionalLogic,
            that.activeModel,
            { timeZone: ''}
          )

          // If our condition failed, then we want to do the opposite of our action. If it was show, we want to hide.
          // If it was hide, we want to show :)
          if (performAction !== true) {
            show = !show
          }

          // If the result of our conditions are to "NOT SHOW" then we set our context key to false,
          // which will tell VJSF to not display the form using v-if directive
          if (!show) {
            options.context[contextKey] = false
          }

          console.log('Condition Result: show = ' + show)
        }

        // Done working on conditional logic
        // If we have to pull in data, pull it in!
        if (properties['listId'] != undefined) {
          // Get the context key by taking out 'context.'
          let listItemsContextKey = properties['x-fromData']
          listItemsContextKey = listItemsContextKey.replace("context.", "")
          const listId = properties['listId']
          const listOptions = that.listOptions[listId]
          if (listOptions != undefined) {
            // Get the array of text/value pairs
            const listOptionsData = listOptions.data
            options.context[listItemsContextKey] = listOptionsData
          } else {
            console.log("No list for listId = " + listId)
          }
        }
      })

      return options
    }
  },
  created () {
    if (this.pid != undefined && this.pid > 0) {
      this.patientPickerLocked = true
    } else {
      this.patientPickerLocked = false
    }
  },
  mounted () {
    console.log("JsonForm Mounted")

    // Sort the grid by Y and then by X so that the form components render
    // in the correct order. We have to clone the grid, because if we sort
    // the reactive property, it will trigger an infinite update loop!!!
    let grid = [...this.form.grid]
    grid.sort(function(a, b) {
      if (a.y > b.y) {
        return 1
      } else if (a.y < b.y) {
        return -1
      } else {
        if (a.x > b.x) {
          return 1
        } else if (a.x < b.x) {
          return -1
        }
      }

      return 0
    })

    // Need to rebuild the schema dynamically by index otherwise JSON elements may render out of order.
    this.activeSchema.properties = {}
    for (const row of grid) {
      this.activeSchema.properties[row.meta.name] = {
        ...this.schema.properties[row.meta.name]
      }
    }

    // Push all of the listIds of lists required for this form into an array, and fetch them all
    let listIdsForFetch = ['active_users']
    Object.values(this.schema.properties).forEach(function(properties) {
      if (properties['listId'] != undefined) {
        listIdsForFetch.push(properties['listId'])
      }
    })
    const that = this
    this.fetchListsBulk({ arrayOfListIds: listIdsForFetch }).then(listOptions => {
      // We are basically copying all the lists to local state here (TODO we really only need the ones with IDs we identified)
      that.listOptions = listOptions

      // These are the options passed to JSON Form
      that.optionsForForm = that.calculateOptions()
      that.loaded = true
    })

  }
}
</script>

<style>
/*
  TODO This is added to hide the "clear" X. The clear functionality (clearable prop in vuetify select)
  is tied to required fields. This is not implemented at this time, and they want to be able to leave
  fields blank until set and requires more thought on how to implement. for now, we hide.
 */
.v-input__icon--clear {
  display: none;
}
</style>
