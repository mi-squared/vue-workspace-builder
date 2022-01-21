<template>
  <!-- Button adn Dialog to add a new dashboard column -->
  <v-dialog v-model="showDashboardColumnSelector" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on">
        + Add Column
      </v-btn>
    </template>

    <v-card>

      <v-card-title class="text-h5 grey lighten-2">
        Column Options
      </v-card-title>

      <v-card-text>
        <v-list>

          <v-list-item
            two-line
            v-for="(column, i) in specialColumns"
            :key="i"
            link
            @click="addColumn(column)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ column.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ column.type }}
              </v-list-item-subtitle>
              <v-list-item-content>{{ column.comment }}</v-list-item-content>
              <v-divider></v-divider>
            </v-list-item-content>
          </v-list-item>

          <!-- first list all the columns with joined subcolumns -->
          <v-list-group
            v-for="item in columnsWithSubcolumns"
            :key="item.column.name"
            v-model="activeSubcolumns[item]"
            no-action
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.column.name"></v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="child in item.subColumns"
              :key="child.name"
              @click="addColumn(child)"
            >
              <v-list-item-content>
                <v-list-item-title v-text="child.name"></v-list-item-title>
                <v-list-item-subtitle>{{
                    child.type
                  }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>

          <v-divider></v-divider>

          <v-list-item
            two-line
            v-for="(column, i) in dataSourceColumns"
            :key="i"
            link
            @click="addColumn(column)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ column.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ column.type }}
                <span v-if="column.type == 'list'">
                  List ID: {{ column.extra.listId }}
                </span>
              </v-list-item-subtitle>
              <v-list-item-content>{{ column.comment }}</v-list-item-content>
              <v-divider></v-divider>
            </v-list-item-content>
          </v-list-item>

        </v-list>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="showDashboardColumnSelector = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

import { GET_DATA_TYPES } from '../store/types-workspace'

const { mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')

export default {
  name: 'DataSourceColPickerBtn',
  props: {
    workspace: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showDashboardColumnSelector: false,
      activeSubcolumns: {}
    }
  },
  computed: {
    ...mapWorkspaceGetters({
      getDataTypes: GET_DATA_TYPES
      }
    ),
    specialColumns () {
      let dataTypes = this.getDataTypes

      let columns = dataTypes.filter(dataType => {
        if (dataType.mysql == 'has_many') {
          return dataType
        }
      }).map(dataType => {
        return { column: dataType.name }
      })

      return columns
    },
    /**
     * Get data source columns that don't have any database columns
     * @returns {unknown[]}
     */
    dataSourceColumns () {
      return Object.values(this.workspace.dataSource.spec.columns).sort(function (a, b) {
        const nameA = a.name.toUpperCase() // ignore upper and lowercase
        const nameB = b.name.toUpperCase() // ignore upper and lowercase
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }

        // names must be equal
        return 0
      })
    },
    columnsWithSubcolumns () {
      let dataTypes = this.getDataTypes
      // Look in the datatypes for this column type, and see if it has additional
      // database columns that it gets through a join, ie: patient.
      // First we filter based on type, then we map so the result contains both cols and subcols
      let colsWithSubcols = Object.values(this.workspace.dataSource.spec.columns).filter(column => {
        if (dataTypes[column.type] != undefined) {
          if (dataTypes[column.type].databaseColumns != undefined) {
            return column
          }
        } else {
          console.log("ERROR: No dataType specified for type: " + column.type)
        }
      }).map(column => {
          const subColumns = dataTypes[column.type].databaseColumns
          return { column: column, subColumns: subColumns }
      })

      return colsWithSubcols
    },
  },
  methods: {
    addColumn(column) {
      this.showDashboardColumnSelector = false
      // Emit the selected column
      this.$emit('selected', column)
    }
  }
}
</script>

<style scoped>

</style>
