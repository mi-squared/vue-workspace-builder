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
        Data Source Elements
      </v-card-title>

      <v-card-text>
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
      showDashboardColumnSelector: false
    }
  },
  computed: {
    dataSourceColumns () {
      return this.workspace.dataSource.spec.columns
    }
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
