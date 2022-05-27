<template>
  <v-timeline dense>
    <v-timeline-item
      v-for="note in notesNewestFirst"
      :key="note.id"
    >
      <v-card>
        <v-card-text>
          {{ note.text }}
        </v-card-text>
        <v-card-subtitle>{{ formatDatetime(note.createdDate) }} by {{ displayUser(note.createdBy) }}</v-card-subtitle>
      </v-card>

    </v-timeline-item>
  </v-timeline>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { formatDatetime } from '../display-helpers'
import { GET_LIST } from '../store/types-list'
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
    },
    notes: {
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
    notesNewestFirst () {
      const notes =  { ...this.notes }
      return Object.values(notes).reverse()
    },
    activeUsersList() {
      return this.getList('active_users').data
    }
  },
  methods: {
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
