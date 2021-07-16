<template>
  <v-card
      flat
      min-height="268"
      class="mt-2 p-4"
  >
    <v-card-title>Layout Properties <v-spacer></v-spacer><v-btn>Preview</v-btn></v-card-title>

    <v-card-text>
      <v-text-field
          label="Title"
          :rules="['required']"
          hide-details="auto"
          v-model="layoutModel.title"
      ></v-text-field>
      <v-text-field label="Another input"></v-text-field>

    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'LayoutProperties',
  props: {
    layoutModel: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>