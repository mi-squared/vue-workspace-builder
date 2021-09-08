<template>
  <v-edit-dialog
      :return-value.sync="item.name"
      @save="save"
      @cancel="cancel"
      @open="open"
      @close="close"
  >
    {{ item.name }}
    <template v-slot:input>
      <v-text-field
          v-model="item.name"
          :rules="[max25chars]"
          label="Edit"
          single-line
          counter
      ></v-text-field>
    </template>
  </v-edit-dialog>
</template>

<script>
export default {
  name: "SlotText",
  props: {
    options: {
      type: Object,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      max25chars: v => v.length <= 25 || 'Input too long!',
    }
  }
}
</script>

<style scoped>

</style>