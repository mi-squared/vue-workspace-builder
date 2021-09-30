<template>
  <v-dialog v-model="dialog" fullscreen>
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="mt-4 mr-2" color="primary" dark v-bind="attrs" v-on="on">
        Preview
      </v-btn>
    </template>
    <v-card>
      <v-toolbar
        dark
        color="primary"
      >
        <v-toolbar-title>{{ this.dashboard.title }} Preview</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          dark
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-container>
          <PageDashboard :preview="true" :key="Math.floor(Math.random() * 32768)" :dashboard-id="Number(dashboard.id)"></PageDashboard>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>

    </v-card>
  </v-dialog>
</template>

<script>

import PageDashboard from '../views/PageDashboard'

export default {
  name: "DashboardPreviewButton",
  components: { PageDashboard },
  props: {
    dashboard: {
      type: Object,
      required: true,
    }
  },
  methods: {},
  computed: {},
  data: () => ({
    model: {},
    dialog: false,
  }),
};
</script>

<style scoped></style>
