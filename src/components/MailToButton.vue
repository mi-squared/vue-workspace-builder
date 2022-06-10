<template>
  <v-menu
    :close-on-click="true"
    v-model="dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-gmail</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-list v-if="templateList.length">
        <v-subheader>Forms</v-subheader>
        <v-list-item
          v-for="(item, index) in templateList"
          :key="index"
        >
          <v-list-item-title>
            <a @click="prepareAndOpenClient(item)">{{ item.text }}</a>
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list v-else>
        <v-list-item>
          <v-list-item-title>No JotForms in Jotforms List</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list v-if="coordinators.length">
        <v-subheader>History</v-subheader>
        <v-list-item v-for="coordinator in coordinators" :key="coordinator.id">
          <v-list-item-content>
            <v-list-item-title>{{ templateTitle(coordinator.metaValue) }}</v-list-item-title>
            <v-list-item-subtitle>{{ coordinator.updatedDate }} - {{ coordinator.status }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-icon><v-icon :color="coordinator.status == 'received' ? 'green' : 'grey'">mdi-check</v-icon></v-list-item-icon>
        </v-list-item>
      </v-list>
      <v-list v-else>
        <v-subheader>History</v-subheader>
        <v-list-item>No forms sent</v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { ADD_NOTE, CREATE_COORDINATOR, GET_COORDINATORS_BY_ENTITY_ID } from '../store/types-dashboard'
const { mapActions: mapDashboardActions, mapGetters: mapDashboardGetters } = createNamespacedHelpers('dashboard')

export default {
  name: 'MailToButton',
  props: {
    entity: {
      type: Object,
      required: true
    },
    dashboard: {
      type: Object,
      required: true
    },
    templateList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialog: false
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
      getCoordinatorsByEntityId: GET_COORDINATORS_BY_ENTITY_ID
    }),
    coordinators () {
      return this.getCoordinatorsByEntityId({
        entityId: this.entity.dashboard_entity_id,
        dashboardId: this.dashboard.id
      })
    }
  },
  methods: {
    ...mapDashboardActions({
      createCoordinator: CREATE_COORDINATOR,
      createNote: ADD_NOTE
    }),
    templateTitle(id) {
      return this.templateList.find(element => element.value == id).text
    },
    prepareAndOpenClient(item) {
      // create a "coordinator" key for receipt of form (round trip)
      const that = this
      this.createCoordinator({
        workspaceId: this.dashboard.workspaceId,
        dashboardId: this.dashboard.id,
        entityId: this.entity.dashboard_entity_id,
        pid: this.entity.pid,
        jotformId: item.value
      }).then((coordinator) => {
        // automatically create a note that will log this action
        const coordinatorKey = coordinator.id
        // build the mailto dynamically
        // window.location = "mailto:mlundeen@crisisprepandrecovery.com?subject=CPR%20E-Signature%20Consent%20Forms&body=Hi%20Amy.%20Please%20follow%20this%20link%20to%20E-Sign%20your%20consent%20forms%20for%20your%20upcoming%20appointment%20with%20CPR.%0A%0Ahttps%3A%2F%2Fform.jotform.com%2F210535749373157"
        const body = "Hi " + that.entity.fname + ", \n" +
          "Please follow this link to sign your " + item.text + "\n" +
          "https://form.jotform.com/" + item.value + "?oe_key=" + coordinatorKey
        const subject = item.text
        const mailto = "mailto:" +
          that.entity.email +
          "?subject=" + subject +
          "&body=" + body

        that.createNote({
          workspaceId: this.dashboard.workspaceId,
          dashboardId: this.dashboard.id,
          entityId: this.entity.dashboard_entity_id,
          pid: this.entity.pid,
          text: "A `" + item.text + "` was initiated.",
          coordinatorKey: coordinatorKey
        }).then(() => {
          window.open(encodeURI(mailto))
        })

      })

    }
  }
}
</script>

<style scoped>

</style>
