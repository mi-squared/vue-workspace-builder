<template>
  <v-dialog
    :value="show"
    width="500"
  >
    <v-card>
      <v-card-title class="text-wrap text-h6 grey lighten-2 warning">
        Confirm Delete - #{{ entityId }}: {{ entityName }}
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-text-field
              hint="Type DELETE to confirm. This operation cannot be undone!"
              class="ma-4"
              placeholder="Type DELETE"
              v-model="confirmDeleteText"
            ></v-text-field>
          </v-row>
          <v-row justify="end">
            <v-col cols="3">
              <v-btn :disabled="confirmDeleteText !== 'DELETE'" @click="handleConfirm">Confirm</v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn @click="handleCancel">Cancel</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DashboardDeleteEntityDialog",
  props: {
    show: {
      type: Boolean,
      required: true
    },
    entityId: {
      type: String,
      required: false,
    },
    entityName: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    confirmDeleteText: ''
  }),
  computed: {
  },
  methods: {
    handleCancel() {
      this.confirmDeleteText = ''
      this.$emit('cancel')
    },
    handleConfirm() {
      this.confirmDeleteText = ''
      this.$emit('confirm')
    }
  },
}
</script>

<style scoped></style>
