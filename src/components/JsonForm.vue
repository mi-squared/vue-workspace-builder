<template>
<v-form v-model="valid">
  <VJsf v-model="model" :schema="schema" :options="options"></VJsf>
</v-form>
</template>

<script>
import VJsf from '@koumoul/vjsf'
export default {
  name: "JsonForm",
  components: {
    VJsf
  },
  data () {
    return {
      valid: false,
      model: {},
      // Global Options
      options: {
        "timePickerProps": {
          "format": "24h"
        }
      },
      schema: {
        "properties": {
          "stringProp": {
            "type": "string",
            "title": "I'm a string",
            "format": "string",
            "x-cols": 6
          },
          "dateTimeProp": {
            "type": "string",
            "title": "I'm a date-time",
            "format": "date-time",
            "description": "This description is used as a help message.",
            "x-cols": 6
          },
          "stringTextareaProp": {
            "type": "string",
            "title": "I'm a string in a textarea",
            "x-display": "textarea"
          },
          "numberProp": {
            "type": "number",
            "title": "I'm a number"
          },
          "integerProp": {
            "type": "integer",
            "title": "I'm an integer"
          },
          "integerSliderProp": {
            "type": "integer",
            "title": "I'm an integer in a slider",
            "x-display": "slider",
            "minimum": 0,
            "maximum": 5
          },
          "booleanProp": {
            "type": "boolean",
            "title": "I'm a boolean",
            "description": "This description is used as a help message."
          },
          "booleanSwitchProp": {
            "type": "boolean",
            "title": "I'm a boolean with switch display",
            "x-display": "switch",
            "description": "This description is used as a help message."
          },
          "stringArrayProp": {
            "type": "array",
            "title": "I'm an array of strings",
            "items": {
              "type": "string"
            }
          },
          "integerArrayProp": {
            "type": "array",
            "title": "I'm an array of integers",
            "items": {
              "type": "integer"
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>

</style>