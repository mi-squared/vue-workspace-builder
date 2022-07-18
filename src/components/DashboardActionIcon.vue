<template>
  <v-list-item-avatar tile size="24">
    <v-icon v-if="dashboardAction.iconType == 'icon'">{{ dashboardAction.icon }}</v-icon>
    <v-img
      v-else-if="dashboardAction.iconType == 'image'"
      :alt="dashboardAction.title"
      :src="dashboardAction.icon"
    >
    </v-img>
  </v-list-item-avatar>
</template>

<script>
export default {
  name: 'DashboardActionIcon',
  props: {
    dashboardAction: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
