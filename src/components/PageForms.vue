<template>
  <v-container>
    <v-row align="start">
      <!-- This is the dialog at the top for creating a new layout -->
      <v-tabs vertical>
        <v-dialog v-model="showNewFormDialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text class="align-self-center mr-4" v-bind="attrs" v-on="on">
              <v-icon left>
                mdi-plus
              </v-icon>
              New Form
            </v-btn>
          </template>

          <v-card>
            <v-card-title>
              <span class="text-h5">New Form</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-text-field
                  v-model="newFormModel.title"
                  label="Form Title*"
                  required
                ></v-text-field>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="showNewFormDialog = false"
              >
                Close
              </v-btn>
              <v-btn color="blue darken-1" text @click="saveNewForm">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- End of the new layout dialog -->

        <!-- this is the list of existing layouts -->
        <v-tab v-for="form in forms" :key="form.id">
          {{ form.title }}
        </v-tab>
        <!-- end of existing forms -->

        <v-tab-item v-for="form in forms" :key="form.id">
          <v-card flat>
            <FormBuilder :form="form"></FormBuilder>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-row>
  </v-container>
</template>

<script>
import FormBuilder from "./FormBuilder";

export default {
  name: "PageForms",
  components: {
    FormBuilder,
  },
  data() {
    return {
      showNewFormDialog: false,
      layouts: [],
      newFormModel: {},
      activeFormModel: {},
    };
  },
  computed: {
    activeWorkspace() {
      return this.$store.state.workspaces[
        this.$store.state.userState.activeWorkspace
      ];
    },
    forms() {
      return this.activeWorkspace.forms;
    },
  },
  methods: {
    saveNewForm() {
      // Save the new layout model that gets initial data from the modal, store it, and then
      // set it to the active layout model to edit.
      this.showNewFormDialog = false;
    },
  },
  mounted() {
    console.log("Forms mounted");
  },
};
</script>

<style scoped></style>
