<template>
  <!-- Button adn Dialog to add a new dashboard column -->
  <v-dialog v-model="showDashboardColumnSelector" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on">
        + Add Element
      </v-btn>
    </template>

    <v-card>

      <v-card-title class="text-h5 grey lighten-2">
        Data Source Elements
      </v-card-title>

      <v-card-text>
        <v-list>

          <v-list-item
            two-line
            v-for="(column, i) in dataSourceColumns"
            :key="i"
            link
            @click="addColumn(column)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ column.name }}</v-list-item-title>
              <v-list-item-subtitle>{{
                  column.comment
                }}</v-list-item-subtitle>
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
  name: 'FormElementPickerBtn',
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
    /**
     * Get data source columns that don't have any database columns
     * @returns {unknown[]}
     */
    dataSourceColumns () {
      return Object.values(this.workspace.dataSource.spec.columns)
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
