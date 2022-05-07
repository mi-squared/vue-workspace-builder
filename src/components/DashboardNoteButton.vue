<template>
  <div class="text-center relative-container">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      nudge-left="290px"
      min-width="320px"
      attach
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-email-plus</v-icon>
        </v-btn>

      </template>

      <v-card
        in-width="400px"
      >
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>New Note</v-list-item-title>
              <v-list-item-subtitle>{{ entity.fname }} {{ entity.lname }} <span class="text--lighten-4">(#{{ entity.dashboard_entity_id }})</span> </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-icon>mdi-email</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item>
            <v-textarea
              v-model="noteText"
              :autofocus="true"
            ></v-textarea>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text
            @click="onClose"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="save"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>

export default {
  name: 'DashboardNoteButton',
  props: {
    entity: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      menu: false,
      noteText: ''
    }
  },
  watch: {
    menu: function () {
      if (this.menu === true) {
        this.$emit("show", true)
      } else {
        this.$emit("show", false)
      }
    }
  },
  methods: {
    save() {
      // emit an event to the parent so the last note text can be updated adn note persisted
      this.$emit('save', {
        entity: this.entity,
        text: this.noteText
      })

      // Reset the note text
      this.noteText = ''

      // Close the modal
      this.menu = false
    },
    onClose() {
      this.menu = false
    }
  },
  mounted () {

  }
}
</script>

<style scoped>

</style>
