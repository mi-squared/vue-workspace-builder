<template>
  <v-card
      flat
      min-height="268"
      class="mt-2 p-4"
  >
    <v-card-title>Form Properties <v-spacer></v-spacer><v-btn>Preview</v-btn></v-card-title>

    <v-card-text>
      <v-text-field
          label="Title"
          :rules="['required']"
          hide-details="auto"
          v-model="formModel.title"
      ></v-text-field>

    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'FormProperties',
  props: {
    formModel: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>