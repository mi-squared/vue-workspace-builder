<template>
  <v-card flat min-height="268" class="mt-2 p-4">
    <v-card-title>Form Properties <v-spacer></v-spacer></v-card-title>

    <v-card-text>
      <v-text-field
        label="Title"
        :rules="['required']"
        hide-details="auto"
        v-model="form.title"
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
import VJsf from "@koumoul/vjsf/lib/VJsf.js";
import "@koumoul/vjsf/dist/main.css";

export default {
  name: "FormProperties",
  components: { VJsf },
  props: {
    formId: {
      type: Number,
      required: true,
    },
    workspaceId: {
      type: Number,
      required: true,
    },
  },
  methods: {},
  computed: {
    schema() {
      return this.$store.getters.getFormById(this.workspaceId, this.formId)
        .formDefinition.schema;
    },
    form() {
      return this.$store.getters.getFormById(this.workspaceId, this.formId);
    },
    options() {
      return this.$store.getters.getFormById(this.workspaceId, this.formId)
        .formDefinition.options;
    },
  },
  data: () => ({
    model: {},
    dialog: false,
  }),
};
</script>

<style scoped></style>
