<template>
<v-form v-model="valid">
  <v-jsf v-model="model" :key="form.id" :schema="schema" :options="options">
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
    }
  },
  computed: {}
}
</script>

<style scoped>

</style>
