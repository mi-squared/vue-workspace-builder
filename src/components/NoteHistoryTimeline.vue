<template>
  <v-list dense>
    <v-subheader>NOTES</v-subheader>
    <v-list-item
      v-for="(note, index) in notes"
      :key="index"
    >
      <v-list-item-content>
        {{ note.text}}

        <v-list-item-subtitle>{{ formatDatetime(note.createdDate) }} by {{ displayUser(note.createdBy) }}</v-list-item-subtitle>
      </v-list-item-content>

    </v-list-item>
  </v-list>
</template>

<script>

import { formatDatetime } from '../display-helpers'
import { createNamespacedHelpers } from 'vuex'
import { GET_LIST } from '../store/types-list'
const { mapGetters: mapListGetters } = createNamespacedHelpers('list')

export default {
  name: 'NoteHistoryTimeline',
  props: {
    notes: {
      type: Array,
      required: true
    },
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
    ...mapListGetters({
      getList: GET_LIST
    }),
    activeUsersList () {
      if (this.getList('active_users') != undefined) {
        return this.getList('active_users').data
      }
      return []
    },
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
  mounted () { }
}
</script>

<style scoped>

</style>
