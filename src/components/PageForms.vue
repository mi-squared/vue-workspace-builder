<template>

<div id="page-layouts">
  <!-- This is the dialog at the top for creating a new layout -->
  <v-tabs vertical>
    <v-dialog
        v-model="showNewLayoutDialog"
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
          New Layout
        </v-btn>
      </template>

      <v-card>
        <v-card-title>
          <span class="text-h5">New Layout</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
                v-model="newLayoutModel.title"
                label="Layout Title*"
                required
            ></v-text-field>
            <v-select
                v-model="newLayoutModel.type"
                :items="['Dashboard', 'Form', 'Read-only', 'Report']"
                label="Type*"
                required
            ></v-select>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click="showNewLayoutDialog = false"
          >
            Close
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
              @click="saveNewLayout"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End of the new layout dialog -->

    <!-- this is the list of existing layouts -->
    <v-tab v-for="form in forms" :key="form.id">
        {{ form.title }}
    </v-tab>
    <!-- end of existing forms -->

    <v-tab-item v-for="form in forms" :key="form.id">
      <v-card flat>
          Let's Build a Form
        <LayoutBuilder></LayoutBuilder>
      </v-card>
    </v-tab-item>


  </v-tabs>
</div>
</template>

<script>
import LayoutBuilder from './LayoutBuilder'

export default {
  name: "PageLayouts",
  components: {
    LayoutBuilder
  },
  data () {
    return {
      showNewLayoutDialog: false,
      layouts: [

      ],
      newLayoutModel: {},
      activeLayoutModel: {}
    }
  },
  computed: {
      activeWorkspace () {
          return this.$store.state.workspaces[this.$store.state.userState.activeWorkspace]
      },
     forms () {
         return this.activeWorkspace.forms
     }
  },
  methods: {
    saveNewLayout () {
      // Save the new layout model that gets initial data from the modal, store it, and then
      // set it to the active layout model to edit.
      this.showNewLayoutDialog = false
    }
  }
}
</script>

<style scoped>

</style>
