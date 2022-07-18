<template>
  <div>
    <!-- need retain focus is false on parent and child otherwise
    get infinite recursion https://github.com/vuetifyjs/vuetify/issues/8459 -->
    <v-dialog
      v-model="dialog"
      scrollable
      :close-on-content-click="false"
      max-width="600px"
      :retain-focus="false"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-badge
            :content="getActionsPerformedByEntityId({ entityId: entity.dashboard_entity_id, dashboardId: dashboard.id }).length"
            :value="getActionsPerformedByEntityId({ entityId: entity.dashboard_entity_id, dashboardId: dashboard.id }).length"
            color="green"
            overlap
          >
            <v-icon>mdi-run</v-icon>
          </v-badge>
        </v-btn>

      </template>

      <v-card>
        <v-toolbar
          flat
          dark
          color="primary"
        >
          <v-icon class="mr-1">mdi-run</v-icon>
          <v-toolbar-title>Actions Performed - {{ entity.fname }} {{ entity.lname }} <span class="text--lighten-4">(#{{ entity.dashboard_entity_id }})</span> </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text style="height: 400px;">
          <v-list
            three-line
            subheader
          >

            <v-divider></v-divider>

            <v-list-item v-if="getActionsPerformedByEntityId({ entityId: entity.dashboard_entity_id, dashboardId: dashboard.id }).length">
              <ActionPerformedHistory
                :dense="true"
                :entity="entity"
                :key="entity.dashboard_entity_id"
                :actionsPerformed="getActionsPerformedByEntityId({ entityId: entity.dashboard_entity_id, dashboardId: dashboard.id })"
              >
              </ActionPerformedHistory>
            </v-list-item>
            <v-list-item v-else>
              <v-list-item-subtitle>
                <h2>No actions performed</h2>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>

      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import { GET_ACTIONS_PERFORMED_BY_ENTITY_ID } from '../store/types-dashboard'
import { createNamespacedHelpers } from 'vuex'
import ActionPerformedHistory from './ActionPerformedHistory'
const { mapGetters: mapDashboardGetters } = createNamespacedHelpers('dashboard')

export default {
  name: 'DashboardActionsPerformedButton',
  components: { ActionPerformedHistory },
  props: {
    entity: {
      type: Object,
      required: true
    },
    dashboard: {
      type: Object,
      required: true
    },
    activeUsersList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
    }
  },
  watch: {
    dialog: function () {
      if (this.dialog === true) {
        this.$emit("show", true)
      } else {
        this.$emit("show", false)
      }
    }
  },
  computed: {
    ...mapDashboardGetters({
      getActionsPerformedByEntityId: GET_ACTIONS_PERFORMED_BY_ENTITY_ID
    }),
  },
  methods: {
    onClose() {
      this.dialog = false
    }
  },
  mounted () {

  }
}
</script>

<style scoped>

</style>
