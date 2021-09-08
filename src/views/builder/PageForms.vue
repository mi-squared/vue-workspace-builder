<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-sheet rounded elevation="1">
          <v-list>
            <v-subheader>FORMS</v-subheader>
            <v-list-item
              v-for="(form, i) in forms"
              :key="i"
              :to="`/builder/workspace/${activeWorkspace.id}/forms/${form.id}`"
            >
              <v-list-item-content>
                <v-list-item-title> {{ form.title }} </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider class="my-2"></v-divider>

            <v-list-item link color="grey lighten-4">
              <v-list-item-content>
                <v-dialog
                  v-model="showNewFormDialog"
                  persistent
                  max-width="600px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      text
                      class="align-self-center mr-4"
                      v-bind="attrs"
                      v-on="on"
                    >
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
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-sheet>
      </v-col>

      <v-col>
        <v-sheet min-height="70vh" rounded="lg">
          <router-view></router-view>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "PageForms",
  components: {},
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
      return this.$store.state.workspaces[this.$route.params.workspaceId];
    },
    activeForm() {
      return this.activeWorspace.forms[this.$route.params.formId];
    },
    forms() {
      return this.activeWorkspace.forms;
    },
  },
  methods: {
    saveNewForm() {
      // Save the new layout model that gets initial data from the modal, store it, and then
      // set it to the active layout model to edit.
      console.log("save new form!");
      this.showNewFormDialog = false;
      this.$store.dispatch("createForm", {
        workspaceId: this.$route.params.workspaceId,
        form: this.newFormModel,
      });
    },
  },
  mounted() {
    console.log("Forms mounted");
  },
};
</script>

<style scoped></style>
