<template>
  <v-main>
    <v-container>
      <v-card flat>
        <v-toolbar flat>
          <v-toolbar-title>Specification (schema)</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn text class="align-self-center mr-4" v-bind="attrs" v-on="on">
                <v-icon>
                  mdi-plus
                </v-icon>
                ADD COLUMN
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

                      <v-col cols="12" sm="6">
                        <v-select
                          v-model="model.type"
                          :items="dataTypes"
                          label="Type"
                          :rules="[required]"
                          required
                        ></v-select>
                      </v-col>

                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="model.name"
                          label="Database Name*"
                          :rules="[noSpaces, max25chars, required]"
                          required
                          hint="This will be the field name in the database. No spaces or special characters besides '_' are allowed."
                        ></v-text-field>
                      </v-col>

                      <v-col v-if="model.type == 'list'">
                        <v-autocomplete
                          :items="listSelectItems"
                          v-model="model.extra.list"
                          label="List*"
                          :rules="[required]"
                          required

                          hint="This list where the select input will pull options from."
                        ></v-autocomplete>
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
                  <v-btn color="blue darken-1" text @click="dialog = false">
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
                v-for="column in columns"
                :key="column.name"
                :class="getClassForColumn(column)"
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
  </v-main>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { CREATE_DATA_SOURCE_COLUMN, GET_DATA_TYPES, GET_WORKSPACE } from '../../store/types-workspace'
const { mapActions: mapWorkspaceActions, mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')
import { GET_USER_META } from '../../store/types-user'
const { mapGetters: mapUserGetters } = createNamespacedHelpers('user')
import { GET_LIST_SELECT_ITEMS } from '../../store/types-list'
const { mapGetters: mapListGetters } = createNamespacedHelpers('list')

export default {
  name: "PageDataSource",
  props: {
    workspaceId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      valid: false,
      model: {
        name: "",
        type: "",
        comment: "",
        extra: {}
      },
      max25chars: (v) => v.length <= 25 || "Input too long!",
      noSpaces: (v) => (v || "").indexOf(" ") < 0 || "No spaces allowed",
      required: (v) => !!v || "Field cannot be empty",
    };
  },
  computed: {
    ...mapWorkspaceGetters({
      getWorkspace: GET_WORKSPACE,
      getDataTypes: GET_DATA_TYPES,
    }),
    ...mapUserGetters({
      getUserMeta: GET_USER_META
    }),
    ...mapListGetters({
      listSelectItems: GET_LIST_SELECT_ITEMS
    }),
    dataTypes() {
      return Object.keys(this.getDataTypes)
    },
    activeWorkspace() {
      return this.getWorkspace(this.workspaceId)
    },
    spec() {
      return this.activeWorkspace.dataSource.spec
    },
    columns() {
      return Object.values(this.spec.columns)
    }
  },
  methods: {
    ...mapWorkspaceActions({
      createDataSourceColumn: CREATE_DATA_SOURCE_COLUMN
    }),
    save() {
      // When the user clicks on the save button on the dialog, we need to create a new column.
      // This method hides the dialog, then dispatches a message to the store to create the data-source column.
      this.dialog = false;
      this.$emit("save", this.model)
      this.createDataSourceColumn({
        userId: this.getUserMeta.id,
        workspaceId: this.workspaceId,
        column: {
          ...this.model,
        },
      })
      // Reset the model for the next new column
      this.model = {
        name: "",
        type: "",
        comment: "",
        extra: {}
      }
    },
    getClassForColumn(column) {
      if (column.extra != undefined &&
        column.extra.createdBy == 'system') {
        return 'grey'
      }
    }
  },
  mounted() {
    console.log("PageDataSource Mounted")
  }
}
</script>

<style scoped></style>
