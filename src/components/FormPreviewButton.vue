<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="mt-4 mr-2" color="primary" dark v-bind="attrs" v-on="on">
        Preview
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Form Preview</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form>
            <v-jsf v-model="model" :key="form.id" :schema="schema" :options="options" />
          </v-form>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import VJsf from "@koumoul/vjsf/lib/VJsf.js";
import "@koumoul/vjsf/dist/main.css";

export default {
  name: "FormPreviewButton",
  components: { VJsf },
  props: {
    form: {
      type: Object,
      required: true,
    }
  },
  methods: {},
  computed: {
    schema() {
      return this.form;
    },
    options() {
      return this.form.options;
    },
  },
  data: () => ({
    model: {},
    dialog: false,
  }),
};
</script>

<style scoped></style>
