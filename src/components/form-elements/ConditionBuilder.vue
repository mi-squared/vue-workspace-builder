<template>
<v-sheet>
  <v-row>
    <v-col>
      <v-select :items="actions"></v-select>
    </v-col>
    <v-col>
      if
    </v-col>
    <v-col>
      <v-select :items="logicalTypes"></v-select>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-select :items="fieldOptions"></v-select>
    </v-col>

    <v-col>
      <v-select :items="operators"></v-select>
    </v-col>

    <v-col>
      <v-text-field></v-text-field>
    </v-col>
  </v-row>
</v-sheet>
</template>

<script>
export default {
  name: 'ConditionBuilder',
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      conditions: []
    }
  },
  computed: {
    actions() {
      return [
        'Show', 'Hide'
      ]
    },
    logicalTypes() {
      return [
        'Any', 'All'
      ]
    },
    fieldOptions() {
      return [
        {
          text: 'Patient',
          value: 'pid'
        },
        {
          text: 'Created At',
          value: 'created_datetime',
        },
        {
          text: 'Created By',
            value: 'created_by',
        }
      ]
    },
    operators() {
      return [
        '>', '<', '='
      ]
    },

  }
}
</script>

<style scoped>

</style>
