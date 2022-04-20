<template>
  <v-timeline dense v-if="loaded">
    <v-timeline-item
      v-for="(note, index) in notesNewestFirst"
      :key="index"
    >
      <v-card>
        <v-card-text>
          {{ note.text}}
        </v-card-text>
        <v-card-subtitle>{{ formatDatetime(note.createdDate) }} by {{ displayUser(note.createdBy) }}</v-card-subtitle>
      </v-card>

    </v-timeline-item>
  </v-timeline>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { FETCH_NOTES_BY_ENTITY_ID, GET_NOTES_BY_ENTITY_ID } from '../store/types-dashboard'
import { formatDatetime } from '../display-helpers'
import { GET_LIST } from '../store/types-list'
const { mapGetters: mapDashboardGetters, mapActions: mapDashboardActions } = createNamespacedHelpers('dashboard')
const { mapGetters: mapListGetters } = createNamespacedHelpers('list')

export default {
  name: 'NoteHistory',
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
      loaded: false
    }
  },
  computed: {
    ...mapListGetters({
      getList: GET_LIST
    }),
    ...mapDashboardGetters({
      getNotesByEntityId: GET_NOTES_BY_ENTITY_ID
    }),
    notesNewestFirst () {
      return this.getNotesByEntityId({
        entityId: this.entity.id,
        dashboardId: this.dashboard.id
      }).reverse()
    },
    activeUsersList() {
      return this.getList('active_users').data
    }
  },
  methods: {
    ...mapDashboardActions({
      fetchNotesByEntityId: FETCH_NOTES_BY_ENTITY_ID
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
    // tell the API to fetch my notes
    this.fetchNotesByEntityId({
      entityId: this.entity.id,
      dashboardId: this.dashboard.id
    }).then(() => {
      this.loaded = true
    })
  }
}
</script>

<style scoped>

</style>
