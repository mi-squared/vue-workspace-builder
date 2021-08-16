<template>
  <v-card flat min-height="268" class="mt-2 p-4">
    <v-card-title>Form Properties <v-spacer></v-spacer></v-card-title>

    <v-card-text>
      <v-text-field
        label="Title"
        :rules="['required']"
        hide-details="auto"
        v-model="formModel.title"
      ></v-text-field>
    </v-card-text>

    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
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
              <v-jsf v-model="model" :schema="schema" :options="options" />
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
  </v-card>
</template>

<script>
import { get } from "vuex-pathify";

import VJsf from "@koumoul/vjsf/lib/VJsf.js";

export default {
  name: "FormProperties",
  components: { VJsf },
  props: {
    formModel: {
      type: Object,
      required: true,
    },
  },
  methods: {
    showPreview() {
      console.log("preview1");
    },
  },
  computed: {
    schema: get("workspaces[1].forms[0].formDefinition.schema"),
    options: get("workspaces[1].forms[0].formDefinition.options"),
  },
  data: () => ({
    model: {},
    dialog: false,
  }),
};
</script>

<style scoped></style>
