<template>

  <div id="page-forms">
    <v-navigation-drawer app clipped v-model="drawer">
      <v-list shaped>
        <v-list-item>
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
        <!-- End of the new layout dialog -->

        <v-divider class="ml-2 mb-4"></v-divider>

        <!-- this is the list of existing dashboards -->
        <v-list-item-group color="primary">
          <v-list-item
            v-for="(form, i) in forms"
            :key="i"
            :to="`/builder/workspace/${workspaceId}/forms/${form.id}`"
          >
            <v-list-item-content>
              <v-list-item-title> {{ form.title }} </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <!-- end of existing dashboards -->
      </v-list>
    </v-navigation-drawer>

    <router-view @hamburger-navigation-clicked="onNavigationClicked"></router-view>

  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { CREATE_FORM, GET_FORM } from '../../store/types-form'
import { GET_NAVIGATION } from '../../store/types-user'
import { GET_FORMS } from '../../store/types-workspace'
const { mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')
const { mapGetters: mapUserGetters } = createNamespacedHelpers('user')
const { mapState: mapFormState, mapActions: mapFormActions, mapGetters: mapFormGetters } = createNamespacedHelpers('form')

export default {
  name: "PageForms",
  components: {},
  props: {
    workspaceId: {
      type: Number,
      required: true
    },
    formId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      ...mapFormState,
      activeFormId: this.formId,
      drawer: true,
      showNewFormDialog: false,
      layouts: [],
      newFormModel: {},
      activeFormModel: {},
    };
  },
  computed: {
    ...mapWorkspaceGetters({
      getForms: GET_FORMS
    }),
    ...mapFormGetters({
      getForm: GET_FORM,
    }),
    ...mapUserGetters({
      navigation: GET_NAVIGATION
    }),

    /**
     * Get an array of forms using the WORKSPACE getter to get all forms for this workspace
     * @returns {*}
     */
    forms() {
      return this.getForms(this.workspaceId)
    }
  },
  methods: {
    ... mapFormActions({
      createForm: CREATE_FORM
    }),
    onNavigationClicked() {
      this.drawer = !this.drawer
    },
    saveNewForm() {
      // Save the new layout model that gets initial data from the modal, store it, and then
      // set it to the active layout model to edit.
      console.log("save new form!")
      this.showNewFormDialog = false;
      this.createForm({
        workspaceId: this.workspaceId,
        form: this.newFormModel,
      })
    },
  },
  mounted() {
    console.log("Forms mounted")
    if (!this.formId) {
      if (this.navigation.workspaces[this.workspaceId].form) {
        this.activeFormId = this.navigation.workspaces[this.workspaceId].form
      } else if (this.forms.length > 0) {
        this.activeFormId = this.forms[0].id
      }

      if (this.activeFormId) {
        this.$router.push({
          name: 'PageFormEdit',
          params: {
            workspaceId: this.workspaceId,
            formId: this.activeFormId
          }
        })
      }
    }
  },
}
</script>

<style scoped></style>
