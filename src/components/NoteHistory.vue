<template>
  <v-timeline dense>
    <v-timeline-item
      v-for="(note, index) in notes"
      :key="index"
    >
      <v-card>
        <v-card-text>
          {{ note.text}}
        </v-card-text>
        <v-card-subtitle>{{ note.datetime }} by {{ note.createdBy }}</v-card-subtitle>
      </v-card>

    </v-timeline-item>
  </v-timeline>
</template>

<script>
export default {
  name: 'NoteHistory',
  props: {
    notes: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
