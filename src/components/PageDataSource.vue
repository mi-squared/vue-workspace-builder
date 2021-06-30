<template>

  <v-container>
    <v-card flat>
      <v-toolbar flat>
        <v-toolbar-title>Schema</v-toolbar-title>
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
                            :items="['Integer', 'String', 'Long Text', 'Date', 'Date Time', 'Patient', 'User', 'Facility', 'List', ]"
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
              v-for="column in schema.columns"
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

<!--
  <div class="container text-left">

    <legend id="headingOne" class="mt-xl-5">Table Structure<button type="button" class="pull-right m-1 btn btn-primary" data-toggle="modal" data-target="#noteModal"><i class="fa fa-plus"></i> New</button>
    </legend>

    <table class="table table-hover">
      <thead>
      <tr>
        <th scope="col">Column</th>
        <th scope="col">Type</th>
        <th scope="col">Comment</th>
      </tr>
      </thead>
      <tbody>
      <tr class="table-secondary">
        <th scope="row">id</th>
        <td>Integer</td>
        <td></td>
      </tr>
      <tr class="table-secondary">
        <th scope="row">date_created</th>
        <td>Datetime</td>
        <td></td>
      </tr>
      <tr class="table-secondary">
        <th scope="row">created_by</th>
        <td>Integer</td>
        <td>references users.id</td>
      </tr>
      <tr class="table-secondary">
        <th scope="row">date_updated</th>
        <td>Datetime</td>
        <td></td>
      </tr>
      <tr class="table-secondary">
        <th scope="row">updated_by</th>
        <td>Datetime</td>
        <td>references users.id</td>
      </tr>
      <tr class="table-secondary">
        <th scope="row">initial_status</th>
        <td>String</td>
        <td>status of the entity when added</td>
      </tr>
      <tr class="table-secondary">
        <th scope="row">status</th>
        <td>String</td>
        <td>current status</td>
      </tr>
      <tr>
        <th scope="row">facility</th>
        <td>String</td>
        <td>Facility we're sending client to</td>
      </tr>
      <tr>
        <th scope="row">date_sent</th>
        <td>Datetime</td>
        <td>Time sent to facility</td>
      </tr>
      </tbody>
    </table>

    <legend id="headingOne" class="mt-xl-5">Indexes</legend>

    <table class="table table-hover">
      <thead>
      <tr>
        <th scope="col">Type</th>
        <th scope="col">Column</th>
        <th scope="col">Name</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th scope="row">PRIMARY</th>
        <td>id</td>
        <td>PRIMARY</td>
      </tr>
      </tbody>
    </table>
  </div>
  -->
</template>

<script>
export default {
  name: "PageDataSource",
  data () {
    return {
      dialog: false,
      valid: false,
      model: {},
      max25chars: v => v.length <= 25 || 'Input too long!',
      noSpaces: v => v.split(' ').length - 1 === 0 || 'No spaces allowed',
      required: v => !!v || 'Field cannot be empty'
    }
  },
  methods:{
    save() {
      this.dialog = false
      this.$emit('save', this.model)
      this.$store.dispatch('createDataSourceColumn', {
        workspaceId: this.activeWorkspace,
        column: this.model
      })
      this.model = {}
    }
  },
  computed: {
    activeWorkspace () {
      return this.$store.state.userState.activeWorkspace
    },
    schema () {
      return this.$store.state.workspaces[this.activeWorkspace].dataSource.schema
    }
  }
}
</script>

<style scoped>

</style>