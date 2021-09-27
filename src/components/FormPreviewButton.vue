<template>
  <v-dialog v-model="dialog" fullscreen>
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="mt-4 mr-2" color="primary" dark v-bind="attrs" v-on="on" @click="count++">
        Preview
      </v-btn>
    </template>
    <v-card>
      <v-toolbar
        dark
        color="primary"
      >
        <v-toolbar-title>Form Preview</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          dark
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-container>
          <JsonForm :key="count" :form="form" :model="model" :schema="schema" :options="options"></JsonForm>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>

    </v-card>
  </v-dialog>
</template>

<script>

import JsonForm from './JsonForm'

export default {
  name: "FormPreviewButton",
  components: { JsonForm },
  props: {
    form: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      count: 0,
      model: {},
      dialog: false,
    }
  },
  methods: {},
  computed: {
    schema() {
      return this.form.schema;
    },
    options() {
      return this.form.options;
    },
  },
}
</script>

<style scoped></style>
