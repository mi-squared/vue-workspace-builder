<template>
  <div>
    <v-menu
      :close-on-click="true"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-badge
            :content="fileCount"
            :value="fileCount"
            color="orange"
            overlap
          >
            <v-icon>
              mdi-attachment
            </v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, index) in files"
          :key="index"
          @click="onClick(item)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>

    </v-menu>
  </div>
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
      required: false
    }
  },
  data () {
    return {
      menu: false
    }
  },
  computed: {
    fileCount () {
      //getFilessByEntityId({ entityId: item.id, dashboardId: dashboard.id }).length
      return this.files.length
    },
    files () {
      if (this.entity.attachments != null) {
        return Object.values(this.entity.attachments)
      } else {
        return []
      }
    }
  },
  methods: {
    onClick (item) {
      // If there is one file, then open the file, if there is more than one, open selector
      const pdf = '/openemr/controller.php?document&retrieve&patient_id=' +
        item.pid +
        '&document_id=' +
        item.metaValue;
      window.open(pdf);
    }
  }
}
</script>

<style scoped>

</style>
