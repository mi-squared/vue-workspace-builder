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
        <v-card-subtitle>{{ note.createdDate }} by {{ note.createdBy }}</v-card-subtitle>
      </v-card>

    </v-timeline-item>
  </v-timeline>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { FETCH_NOTES_BY_ENTITY_ID, GET_NOTES_BY_ENTITY_ID } from '../store/types-dashboard'

const { mapGetters: mapDashboardGetters, mapActions: mapDashboardActions } = createNamespacedHelpers('dashboard')

export default {
  name: 'NoteHistory',
  props: {
    entity: {
      type: Object,
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
      return this.getNotesByEntityId(this.entity.id)
    }
  },
  methods: {
    ...mapDashboardActions({
      fetchNotesByEntityId: FETCH_NOTES_BY_ENTITY_ID
    }),
  },
  mounted () {
    // tell the API to fetch my notes
    this.fetchNotesByEntityId(this.entity.id)

  }
}
</script>

<style scoped>

</style>
