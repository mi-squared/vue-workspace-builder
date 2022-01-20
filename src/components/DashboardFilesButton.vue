<template>
  <div
    v-if="fileCount == 1"
  >
    <v-btn
      icon
      @click="onClick"
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
  </div>
  <div v-else>
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
          @click="onClick"
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
      required: true
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
      return 3
    },
    files () {
      return [
        { title: 'file 1' },
        { title: 'file 2' },
        { title: 'file 3' },
      ]
    }
  },
  methods: {
    onClick () {
      // If there is one file, then open the file, if there is more than one, open selector
      if (this.fileCount == 1) {
        const pdf = '/openemr/controller.php?document&retrieve&patient_id=165742&document_id=715412';
        window.open(pdf);
      } else {
        const pdf = '/openemr/controller.php?document&retrieve&patient_id=165742&document_id=715412';
        window.open(pdf);
      }
    }
  }
}
</script>

<style scoped>

</style>
