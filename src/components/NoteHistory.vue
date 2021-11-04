<template>
  <v-timeline dense>
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
const { mapGetters: mapDashboardGetters, mapActions: mapDashboardActions } = createNamespacedHelpers('dashboard')

export default {
  name: 'NoteHistory',
  props: {
    entity: {
      type: Object,
      required: true
    },
    activeUsersList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapDashboardGetters({
      getNotesByEntityId: GET_NOTES_BY_ENTITY_ID
    }),
    notesNewestFirst () {
      return this.getNotesByEntityId(this.entity.id).reverse()
    }
  },
  methods: {
    ...mapDashboardActions({
      fetchNotesByEntityId: FETCH_NOTES_BY_ENTITY_ID
    }),
    displayUser(userId) {
      const user = this.activeUsersList.find(item => item.value == userId)
      return user.text
    },
    formatDatetime(datetime) {
      return formatDatetime(datetime)
    }
  },
  mounted () {
    // tell the API to fetch my notes
    this.fetchNotesByEntityId(this.entity.id)

  }
}
</script>

<style scoped>

</style>
