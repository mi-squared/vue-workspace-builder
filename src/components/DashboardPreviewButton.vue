<template>
  <v-dialog v-model="dialog" fullscreen>
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="mt-4 mr-2" color="primary" dark v-bind="attrs" v-on="on" @click="changeKey">
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
          <Dashboard :key="dashboardKey" :dashboard="dashboard"></Dashboard>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>

    </v-card>
  </v-dialog>
</template>

<script>

import Dashboard from './Dashboard'

export default {
  name: "DashboardPreviewButton",
  components: { Dashboard },
  props: {
    dashboard: {
      type: Object,
      required: true,
    }
  },
  data: () => ({
    model: {},
    dialog: false,
    dashboardKey: Math.floor(Math.random() * 32768)
  }),
  computed: {
  },
  methods: {
    changeKey() {
      this.dashboardKey++
    }
  },
  mounted () {
    console.log("Dashboard Preview Button Mounted")
  }
}
</script>

<style scoped></style>
