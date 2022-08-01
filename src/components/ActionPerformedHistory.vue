<template>
  <v-timeline
    :dense="dense || false">
    <v-timeline-item
      v-for="actionPerformed in actionsPerformedNewestFirst"
      :key="actionPerformed.id"
    >
      <v-card>
        <v-card-title>
          <div v-if="actionPerformed.action != null">
            <DashboardActionIcon
              :dashboardAction="actionPerformed.action">
            </DashboardActionIcon>
            {{ actionPerformed.action.title }}
          </div>
          <div v-else>
            {{ actionPerformed.action.handle }}
          </div>
        </v-card-title>
        <v-card-text>{{ actionPerformed.action.description }}</v-card-text>
        <v-card-text class="font-weight-light">{{ formatDatetime(actionPerformed.createdDate) }} by {{ displayUser(actionPerformed.createdBy) }}</v-card-text>
      </v-card>

    </v-timeline-item>
  </v-timeline>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { formatDatetime } from '../display-helpers'
import { GET_LIST } from '../store/types-list'
import { DELETE_META } from '../store/types-dashboard'
import DashboardActionIcon from './DashboardActionIcon'
const { mapGetters: mapListGetters } = createNamespacedHelpers('list')
const { mapActions: mapDashboardActions } = createNamespacedHelpers('dashboard')

export default {
  name: 'ActionPerformedHistory',
  components: { DashboardActionIcon },
  props: {
    dense: {
      type: Boolean,
      required: false
    },
    entity: {
      type: Object,
      required: true
    },
    actionsPerformed: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapListGetters({
      getList: GET_LIST
    }),
    actionsPerformedNewestFirst () {
      const actionPerformed =  { ...this.actionsPerformed }
      const sorted = Object.values(actionPerformed).sort((a, b) => {
        return new Date(b.createdDate) - new Date(a.createdDate)
      })
      return sorted
    },
    activeUsersList() {
      return this.getList('active_users').data
    }
  },
  methods: {
    ...mapDashboardActions({
      deleteMeta: DELETE_META
    }),
    displayUser(userId) {
      const user = this.activeUsersList.find(item => item.value == userId)
      if (user != undefined) {
        return user.text
      } else {
        return "Unknown"
      }
    },
    formatDatetime(datetime) {
      return formatDatetime(datetime)
    }
  },
  mounted () {
    console.log("note history mounted")
  }
}
</script>

<style scoped>

</style>
