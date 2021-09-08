<template>
  <v-app>
    <router-view></router-view>
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
    this.$store.dispatch('init')
        .then((response) => {
          console.log(response)
          // Fetch the dashboard from the server given an ID
          this.dashboardId = this.$route.params.id
            console.log(this.$route.params)
          this.$store.dispatch('fetchDashboard', { dashboardId: this.dashboardId })
              .then(dashboard => {
                document.title = dashboard.title
                console.log(dashboard)

              })
        })
  }
}
</script>

<style>

</style>
