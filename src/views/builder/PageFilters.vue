<template>
  <div id="filter-builder">
    <!-- This is the dialog at the top for creating a new layout -->
    <v-tabs vertical>
      <v-dialog
          v-model="showNewFilterDialog"
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
            New Filter
          </v-btn>
        </template>

        <v-card>
          <v-card-title>
            <span class="text-h5">New Filter</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                  v-model="newFilterModel.title"
                  label="Filter Title*"
                  required
              ></v-text-field>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="showNewFilterDialog = false"
            >
              Close
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                @click="saveNewFilter"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- End of the new layout dialog -->

      <!-- this is the list of existing layouts -->
      <v-tab v-for="filter in filters" :key="filter.id">
        {{ filter.title }}
      </v-tab>
      <!-- end of existing forms -->

      <v-tab-item v-for="filter in filters" :key="filter.id">
        <v-card flat>
          <FilterTree></FilterTree>
        </v-card>
      </v-tab-item>


    </v-tabs>


  </div>
</template>

<script>
import FilterTree from "@/components/FilterTree"

export default {
  name: "PageFilters",
  components: {
    FilterTree
  },
  data () {
    return {
      showNewFilterDialog: false,
      newFilterModel: {},
      activeFilterModel: {}
    }
  },
  computed: {
    activeWorkspace () {
      return this.$store.state.workspaces[this.$store.state.userState.navigation.workspace]
    },
    filters () {
      return this.activeWorkspace.filters
    }
  },
  methods: {
    saveNewFilter () {
      // Save the new filter model that gets initial data from the modal, store it, and then
      // set it to the active filter model to edit.
      this.showNewFilterDialog = false
    }
  },
  mounted () {
    console.log("Filters mounted")
  }
}
</script>

<style scoped>

</style>
