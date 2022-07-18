<template>
  <v-timeline
    :dense="dense || false">
    <v-timeline-item
      v-for="note in notesNewestFirst"
      :key="note.id"
    >
      <v-card>
        <v-card-text>
          {{ note.text }}
        </v-card-text>
        <v-card-subtitle>{{ formatDatetime(note.createdDate) }} by {{ displayUser(note.createdBy) }}</v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- need retain focus is false on parent and child otherwise
          get infinite recursion https://github.com/vuetifyjs/vuetify/issues/8459 -->
          <v-dialog
            v-model="reasonDialog"
            persistent
            max-width="600px"
            :retain-focus="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="red"
                outlined
                v-bind="attrs"
                v-on="on"
                x-small
              >
                <v-icon x-small>mdi-trash-can</v-icon>
                Delete
              </v-btn>
            </template>
            <v-form
              v-model="deleteReasonValid">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Reason for Delete</span>
                </v-card-title>
                <v-card-subtitle>This action will be logged</v-card-subtitle>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                      >
                        <v-textarea
                          label="Reason *"
                          :rules="[v => !!v || 'Reason is required']"
                          v-model="deleteReason"
                          required
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-container>
                  <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="closeReasonDialog()"
                  >
                    Close
                  </v-btn>
                  <v-btn
                    color="red darken-1"
                    text
                    @click="deleteNote(note)"
                    :disabled="!deleteReasonValid"
                  >
                    Confirm Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>
        </v-card-actions>
      </v-card>

    </v-timeline-item>
  </v-timeline>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { formatDatetime } from '../display-helpers'
import { GET_LIST } from '../store/types-list'
import { DELETE_META } from '../store/types-dashboard'
const { mapGetters: mapListGetters } = createNamespacedHelpers('list')
const { mapActions: mapDashboardActions } = createNamespacedHelpers('dashboard')

export default {
  name: 'NoteHistory',
  props: {
    dense: {
      type: Boolean,
      required: false
    },
    entity: {
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
      reasonDialog: false,
      deleteReason: '',
      deleteReasonValid: false,
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
    ...mapDashboardActions({
      deleteMeta: DELETE_META
    }),
    closeReasonDialog() {
      this.reasonDialog = false
      this.deleteReason = ''
    },
    deleteNote(note) {
      this.deleteMeta({
        endpoint: 'note',
        metaId: note.id,
        deleteReason: this.deleteReason
      }).then(() => {
        // alert(metaId + ' was deleted')
        this.closeReasonDialog()
      })
    },
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
