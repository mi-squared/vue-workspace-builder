<template>
  <v-app>
    <Page>
  </v-app>
</template>

<script>

export default {
  name: 'Dashboard',
  components: {
  },
  data () {
    return {
      dashboardId: null
    }
  },
  created() {
    console.log("Dashboard Created")
    // Fetch the dashboard from the server given an ID
    this.dashboardId = this.$route.params.id
    console.log(this.$route.params)
    this.$store.dispatch('fetchDashboard', { dashboardId: this.dashboardId })
      .then(dashboard => {
        document.title = dashboard.title
        console.log(dashboard)

      })
  }
}
</script>

<style>

</style>
