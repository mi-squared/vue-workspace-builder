<template>

  <v-container>
    <v-card flat>
      <v-toolbar flat>
        <v-toolbar-title>Specification (schema)</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog
            v-model="dialog"
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
              <v-icon>
                mdi-plus
              </v-icon>
              New
            </v-btn>
          </template>

          <!-- THis is the new column modal -->

            <v-card>
              <v-form v-model="valid">
                <v-card-title>
                  <span class="text-h5">New Column</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                          cols="12"
                          sm="6"
                      >
                        <v-text-field
                            v-model="model.name"
                            label="Name*"
                            :rules="[noSpaces, max25chars, required]"
                            required
                        ></v-text-field>
                      </v-col>
                      <v-col
                          cols="12"
                          sm="6"
                      >
                        <v-select
                            v-model="model.type"
                            :items="['Integer', 'String', 'Long Text', 'Date', 'Date Time', 'Patient', 'User', 'List']"
                            label="Type"
                            :rules="[required]"
                            required
                        ></v-select>
                      </v-col>

                      <v-col cols="12">
                        <v-text-field
                            v-model="model.comment"
                            label="Comment"
                        ></v-text-field>
                      </v-col>

                    </v-row>
                  </v-container>
                  <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      color="blue darken-1"
                      text
                      @click="dialog = false"
                  >
                    Close
                  </v-btn>
                  <v-btn
                      color="blue darken-1"
                      text
                      @click="save"
                      :disabled="!valid"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </v-toolbar>

      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">
              Column
            </th>
            <th class="text-left">
              Type
            </th>
            <th class="text-left">
              Comment
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="column in spec.columns"
              :key="column.name"
              :class="{ 'grey': (column.extra.createdBy == 'system')}"
          >
            <td class="text-left">{{ column.name }}</td>
            <td class="text-left">{{ column.type }}</td>
            <td class="text-left">{{ column.comment }}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "PageDataSource",
  data () {
    return {
      dialog: false,
      valid: false,
      model: {
        name: '',
        type: '',
        comment: ''
      },
      max25chars: v => v.length <= 25 || 'Input too long!',
      noSpaces: v => (v || '').indexOf(' ') < 0 || 'No spaces allowed',
      required: v => !!v || 'Field cannot be empty'
    }
  },
  methods: {
    save() {
      // When the user clicks on the save button on the dialog, we need to create a new column.
      // This method hides the dialog, then dispatches a message to the store to create the data-source column.
      this.dialog = false
      this.$emit('save', this.model)
      this.$store.dispatch('createDataSourceColumn', {
        workspaceId: this.activeWorkspace,
        column: this.model
      })
      // Reset the model for the next new column
      this.model = {
        name: '',
        type: '',
        comment: ''
      }
    }
  },
  computed: {
    activeWorkspace () {
      return this.$store.state.userState.activeWorkspace
    },
    spec () {
      return this.$store.state.workspaces[this.activeWorkspace].dataSource.spec
    }
  }
}
</script>

<style scoped>

</style>
