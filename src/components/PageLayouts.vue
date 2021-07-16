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
    <v-tab>
      Report
    </v-tab>

    <v-tab>
      Form
    </v-tab>

    <v-tab>
      Dashboard
    </v-tab>
    <!-- end of existing layouts -->

    <v-tab-item>
      <v-card flat>
        <layout-builder></layout-builder>
      </v-card>
    </v-tab-item>

    <v-tab-item>
      <v-card flat>
        <v-card-text>
          <p>
            Morbi nec metus. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Nunc sed turpis.
          </p>

          <p>
            Suspendisse feugiat. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In hac habitasse platea dictumst. Fusce ac felis sit amet ligula pharetra condimentum.
          </p>

          <p>
            Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Nam commodo suscipit quam. In consectetuer turpis ut velit. Sed cursus turpis vitae tortor. Aliquam eu nunc.
          </p>

          <p>
            Etiam ut purus mattis mauris sodales aliquam. Ut varius tincidunt libero. Aenean viverra rhoncus pede. Duis leo. Fusce fermentum odio nec arcu.
          </p>

          <p class="mb-0">
            Donec venenatis vulputate lorem. Aenean viverra rhoncus pede. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. Fusce commodo aliquam arcu. Suspendisse enim turpis, dictum sed, iaculis a, condimentum nec, nisi.
          </p>
        </v-card-text>
      </v-card>
    </v-tab-item>

    <v-tab-item>
      <v-card flat>
        <DashboardBuilder></DashboardBuilder>
      </v-card>
    </v-tab-item>

  </v-tabs>
</div>
</template>

<script>
import LayoutBuilder from './LayoutBuilder'
import DashboardBuilder from "@/components/DashboardBuilder"

export default {
  name: "PageLayouts",
  components: {
    DashboardBuilder,
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