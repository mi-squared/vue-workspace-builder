<template>

<div id="page-layouts">
  <v-tabs vertical>

    <v-menu
        bottom
        left
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

      <v-list class="grey lighten-3">
        <v-list-item>
          <v-icon>
            mdi-gr
          </v-icon>
          Form
        </v-list-item>

        <v-list-item>
          <v-icon>
            mdi-gr
          </v-icon>
          Dashboard
        </v-list-item>

        <v-list-item>
          <v-icon>
            mdi-gr
          </v-icon>
          Read-only View
        </v-list-item>

        <v-list-item>
          <v-icon>
            mdi-gr
          </v-icon>
          Report
        </v-list-item>

      </v-list>
    </v-menu>


    <v-tab>
      Report
    </v-tab>

    <v-tab>
      Form
    </v-tab>

    <v-tab>
      Dashboard
    </v-tab>

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
      showNewLayoutMenu: false
    }
  }
}
</script>

<style scoped>

</style>