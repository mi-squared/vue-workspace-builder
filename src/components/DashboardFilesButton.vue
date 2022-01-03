<template>
  <v-btn icon>
    <v-badge
      :content="getFilesByEntityId({ entityId: item.id, dashboardId: dashboard.id }).length"
      :value="getFilessByEntityId({ entityId: item.id, dashboardId: dashboard.id }).length"
      color="green"
      overlap
    >
      <v-icon>
        mdi-attachment
      </v-icon>
    </v-badge>
  </v-btn>
</template>

<script>
export default {
  name: 'DashboardFilesButton',
  props: {
    entity: {
      type: Object,
      required: true
    },
    dashboard: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
