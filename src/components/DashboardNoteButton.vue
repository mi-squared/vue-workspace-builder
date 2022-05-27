<template>
  <div class="text-center relative-container">
    <v-dialog
      v-model="dialog"
      scrollable
      :close-on-content-click="false"
      max-width="600px"
      attach
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-badge
            :content="getNotesByEntityId({ entityId: entity.dashboard_entity_id, dashboardId: dashboard.id }).length"
            :value="getNotesByEntityId({ entityId: entity.dashboard_entity_id, dashboardId: dashboard.id }).length"
            color="green"
            overlap
          >
            <v-icon>mdi-note-multiple</v-icon>
          </v-badge>
        </v-btn>

      </template>

      <v-card>
        <v-toolbar
          flat
          dark
          color="primary"
        >
          <v-icon class="mr-1">mdi-note-multiple</v-icon>
          <v-toolbar-title>Notes - {{ entity.fname }} {{ entity.lname }} <span class="text--lighten-4">(#{{ entity.dashboard_entity_id }})</span> </v-toolbar-title>
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

            <v-list-item v-if="getNotesByEntityId({ entityId: entity.dashboard_entity_id, dashboardId: dashboard.id }).length">
              <NoteHistory
                :entity="entity"
                :key="entity.dashboard_entity_id"
                :dashboard="dashboard"
                :activeUsersList="activeUsersList"
                :notes="getNotesByEntityId({ entityId: entity.dashboard_entity_id, dashboardId: dashboard.id })"
              >
              </NoteHistory>
            </v-list-item>
            <v-list-item v-else>
              <v-list-item-subtitle>
                <h2>No notes found</h2>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            dark
            class="ma-2"
            @click="newNoteDialog = !newNoteDialog"
          >
            <v-icon>mdi-note-plus</v-icon>
            New Note
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

    <v-dialog v-model="newNoteDialog" max-width="400px">
      <v-card>
        <v-card-text>
            <v-textarea
              v-model="noteText"
              :autofocus="true"
            ></v-textarea>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="newNoteDialog = false"
          >
            Cancel
          </v-btn>
            <v-btn
              color="primary"
              text
              @click="save"
            >
              <v-icon>mdi-note-plus</v-icon>
              Save
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import { GET_NOTES_BY_ENTITY_ID } from '../store/types-dashboard'
import { createNamespacedHelpers } from 'vuex'
import NoteHistory from './NoteHistory'
const { mapGetters: mapDashboardGetters } = createNamespacedHelpers('dashboard')

export default {
  name: 'DashboardNoteButton',
  components: { NoteHistory },
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
      newNoteDialog: false,
      noteText: ''
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
      getNotesByEntityId: GET_NOTES_BY_ENTITY_ID
    }),
  },
  methods: {
    save() {
      // emit an event to the parent so the last note text can be updated adn note persisted
      this.$emit('save', {
        entity: this.entity,
        text: this.noteText,
        coordinatorKey: null
      })

      // Reset the note text
      this.noteText = ''

      // Close the modal
      this.newNoteDialog = false
    },
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
