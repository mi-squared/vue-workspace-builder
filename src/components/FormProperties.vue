<template>
  <v-card flat min-height="268" class="mt-2 p-4">
    <v-card-title>Form Properties <v-spacer></v-spacer></v-card-title>

    <v-card-text>
      <v-text-field
        label="Title"
        :rules="['required']"
        hide-details="auto"
        v-model="form.title"
      ></v-text-field>
    </v-card-text>

  </v-card>
</template>

<script>
import "@koumoul/vjsf/dist/main.css";

export default {
  name: "FormProperties",
  components: {},
  props: {
    form: {
      type: Object,
      required: true,
    }
  },
  methods: {},
  computed: {
    schema() {
      return this.form;
    },
    options() {
      return this.form.options;
    },
  },
  data: () => ({
    model: {},
    dialog: false,
  }),
};
</script>

<style scoped></style>
