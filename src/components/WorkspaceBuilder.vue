<template>
  <v-container>
    <v-toolbar flat>
      <v-spacer></v-spacer>
        <v-btn class="right mt-4 mr-2" color="success" :disabled="!isDirty" @click="save">
          <v-icon>mdi-floppy</v-icon>
          Save
        </v-btn>
    </v-toolbar>

    <v-card flat>
      <v-card-title>Properties</v-card-title>

      <v-container fluid>
        <v-row dense>
            <v-col cols="6">
              <v-card-text>
                <v-form>
                  <v-text-field label="Title" v-model="activeWorkspace.title"></v-text-field>

                  <v-select
                    label="Default Dashboard"
                    v-model="activeWorkspace.defaultDashboard"
                    :items="dashboardOptions"
                    hint="The dashboard that entities are sent to when invoking the 'Send To Workspace' action."
                    persistent-hint
                  ></v-select>

                  <v-select
                    label="Timeline View Form"
                    v-model="activeWorkspace.timelineViewFormId"
                    :items="formOptions"
                    hint="The form that is displayed when an entity is clicked on in the timeline view."
                    persistent-hint
                  ></v-select>

                  <v-dialog
                    v-model="colorDialog"
                    width="500"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <div class="mt-4">
                        <div class="text-label text--lighten-1">Workspace Color</div>
                        <v-icon
                          :color="activeWorkspace.color"
                          v-bind="attrs"
                          v-on="on">
                          mdi-format-color-fill
                        </v-icon>
                      </div>
                    </template>

                    <v-card>
                      <v-card-title class="text-h5 grey lighten-2">
                        Select Color
                      </v-card-title>

                      <v-card-text>
                        <v-color-picker
                          v-model="activeWorkspace.color"
                          class="ma-2"
                          dot-size="31"
                          hide-inputs
                          show-swatches
                          swatches-max-height="200"
                        ></v-color-picker>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          text
                          @click="colorDialog = false"
                        >
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <v-select
                    label="Administrator"
                    v-model="activeWorkspace.administrator"
                    :items="administrators"
                    item-text="displayName"
                    item-value="userId"
                    hint="The administrator of this workspace"
                    persistent-hint
                  ></v-select>

                  <v-switch
                    v-model="activeWorkspace.displayOnPatientMenu"
                    label="Display as patient menu item"
                    ></v-switch>
                </v-form>
              </v-card-text>
            </v-col>
        </v-row>
      </v-container>
    </v-card>

    <v-card flat>
      <v-toolbar flat>
        <v-toolbar-title>Menu Items</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-card-text>
        <v-card-text class="text-left">This is the order that the dashboard views are displayed in the menu</v-card-text>
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                Title
              </th>
              <th class="text-left">
                Enabled
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="item in dashboardOptions"
                :key="item.id"
            >
              <td class="text-left">{{ item.text }}</td>
              <td class="text-left">{{ item.enabled }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-container>
<!--  <legend id="headingOne" class="mt-xl-5">-->
<!--    Views-->
<!--    <div class="dropdown pull-right m-1 ">-->
<!--      <button ref="showInputButton" @click="showInput=!showInput;" class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">-->
<!--        New-->
<!--      </button>-->
<!--      <div ref="dropdown" v-if="showInput"  class="dropdown-menu popover-custom" aria-labelledby="dropdownMenuButton">-->
<!--        <a class="dropdown-item" href="#">Form</a>-->
<!--        <a class="dropdown-item" href="#">Dashboard</a>-->
<!--        <a class="dropdown-item" href="#">Read-only</a>-->
<!--      </div>-->
<!--    </div>-->
<!--  </legend>-->

<!--  <table class="table table-hover">-->
<!--    <thead>-->
<!--    <tr>-->
<!--      <th scope="col">#</th>-->
<!--      <th scope="col">Title</th>-->
<!--      <th scope="col">Type</th>-->
<!--      <th scope="col">Enabled</th>-->
<!--      <th scope="col">&nbsp; &lt;!&ndash; actions &ndash;&gt;</th>-->
<!--    </tr>-->
<!--    </thead>-->
<!--    <tbody>-->
<!--    <tr>-->
<!--      <th scope="row">1</th>-->
<!--      <td>Triage</td>-->
<!--      <td>Main Dashboard</td>-->
<!--      <td><i class="fa fa-check"></i></td>-->
<!--      <td><i class="fa fa-copy"></i></td>-->
<!--    </tr>-->
<!--    <tr>-->
<!--      <th scope="row">2</th>-->
<!--      <td>CET</td>-->
<!--      <td>Dashboard</td>-->
<!--      <td><i class="fa fa-check"></i></td>-->
<!--      <td><i class="fa fa-copy"></i></td>-->
<!--    </tr>-->
<!--    <tr>-->
<!--      <th scope="row">3</th>-->
<!--      <td>Cigna</td>-->
<!--      <td>Dashboard</td>-->
<!--      <td><font-awesome-icon icon="check"></font-awesome-icon></td>-->
<!--      <td><font-awesome-icon icon="copy"></font-awesome-icon></td>-->
<!--    </tr>-->
<!--    </tbody>-->
<!--  </table>-->

<!--  <legend id="headingOne" class="mt-xl-5">Triggers<button type="button" class="pull-right m-1 btn btn-primary" data-toggle="modal" data-target="#noteModal"><i class="fa fa-plus"></i> New</button>-->
<!--  </legend>-->

<!--  <table class="table table-hover">-->
<!--    <thead>-->
<!--    <tr>-->
<!--      <th scope="col">#</th>-->
<!--      <th scope="col">Event</th>-->
<!--      <th scope="col">Filter</th>-->
<!--      <th scope="col">Action</th>-->
<!--    </tr>-->
<!--    </thead>-->
<!--    <tbody>-->
<!--    <tr>-->
<!--      <th scope="row">1</th>-->
<!--      <td>Attrition</td>-->
<!--      <td>&gt; 60 min.</td>-->
<!--      <td>Add Row Attribute "urgent"</td>-->
<!--    </tr>-->
<!--    <tr>-->
<!--      <th scope="row">2</th>-->
<!--      <td>On Create</td>-->
<!--      <td>From Cigna</td>-->
<!--      <td>Add Row Attribute "green"</td>-->
<!--    </tr>-->
<!--    <tr>-->
<!--      <th scope="row">2</th>-->
<!--      <td>On Create</td>-->
<!--      <td>DUP Check</td>-->
<!--      <td>Add Row Attribute "blue"</td>-->
<!--    </tr>-->
<!--    <tr>-->
<!--      <th scope="row">2</th>-->
<!--      <td>On Create</td>-->
<!--      <td>Is High Utilizer?</td>-->
<!--      <td>Set is_high_utilzer = true</td>-->
<!--    </tr>-->
<!--    </tbody>-->
<!--  </table>-->

</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { GET_FORMS, GET_WORKSPACE, SET_WORKSPACE } from '../store/types-workspace'
import { GET_DASHBOARD } from '../store/types-dashboard'
const { mapActions: mapWorkspaceActions, mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')
const { mapGetters: mapDashboardGetters } = createNamespacedHelpers('dashboard')

export default {
  name: "WorkspaceBuilder",
  props: {
    workspace: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isDirty: false,
      showInput: false,
      activeWorkspace: {
        color: 'grey',
        ...this.workspace
      },
      colorDialog: false
    }
  },
  watch: {
    activeWorkspace: {
      // Watch the activeWorkspace using a deep watch, and when it changes,
      // mark the model as dirty, which activates the "save" button
      handler() {
        this.isDirty = true
        // TODO should propagate an event up to let navigation know that there are unsaved changes on this builder
      },
      deep: true
    },
  },
  computed: {
    ...mapWorkspaceGetters({
      getWorkspace: GET_WORKSPACE,
      getFormsByWorkspaceId: GET_FORMS
    }),
    ...mapDashboardGetters({
      getDashboard: GET_DASHBOARD
    }),

    title () {
      return this.activeWorkspace.title
    },
    dashboards() {
      return Object.values(this.activeWorkspace.dashboards)
    },
    formOptions() {
      // This gathers up all the lists in { text: '', value: '' } format for the select box
      const forms = Object.values(this.getFormsByWorkspaceId(this.activeWorkspace.id))
      let formOptions = []
      forms.forEach(form => {
        const option = { text: form.title, value: form.id }
        formOptions.push(option)
      })
      return formOptions
    },
    dashboardOptions() {
      // return options for dashboard when entity is created outside, but we
      // don't want to fetch from API, just use getter
      let options = []
      Object.values(this.dashboards).forEach(dashboardId => {
        const dashboard = this.getDashboard(dashboardId)
        // If the dashboards haven't loaded from API yet, they will be undefined
        if (dashboard != undefined) {
          options.push({
            text: dashboard.title,
            value: dashboard.id,
            enabled: dashboard.enabled || true
          })
        }
      })
      return options
    },
    administrators () {
      return this.$store.state.administrators
    },
    views () {
      return this.activeWorkspace.views
    }
  },
  methods: {
    ...mapWorkspaceActions({
      setWorkspace: SET_WORKSPACE
    }),
    save() {
      let that = this
      this.setWorkspace({ workspaceId: this.activeWorkspace.id, workspace: this.activeWorkspace })
        .then(function () {
          that.isDirty = false
        })
    }
  },
  mounted () {
    console.log('WorkspaceBuilder Mounted')
  }
}
</script>

<style scoped>

</style>
