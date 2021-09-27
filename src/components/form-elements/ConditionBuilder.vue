<template>
<v-sheet>
  <v-row>
    <v-col>
      <v-select :items="actions"></v-select>
    </v-col>
    <v-col>
      <p class="mt-4">this element if</p>
    </v-col>
    <v-col>
      <v-select :items="logicalTypes"></v-select>
    </v-col>
  </v-row>

  <v-row v-for="(condition, index) in conditions" :key="index">
    <v-col>
      <v-select :items="fieldOptions" :value="condition.field"></v-select>
    </v-col>

    <v-col>
      <v-select :items="operators" :value="condition.operator"></v-select>
    </v-col>

    <v-col>
      <v-text-field :value="condition.value"></v-text-field>
    </v-col>

    <v-col>
      <v-toolbar dense>
        <v-btn
          icon
          @click="removeCondition(index)"
        >
          <v-icon >mdi-close</v-icon>
        </v-btn>
        <v-btn
          v-if="index == conditions.length - 1"
          icon
          @click="addCondition"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-toolbar>
    </v-col>
  </v-row>
</v-sheet>
</template>

<script>
export default {
  name: 'ConditionBuilder',
  props: {
    form: {
      type: Object,
      required: true
    },
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

  },
  methods: {
    /**
     * Remove a condition from the array by it's index using splice()
     * @param index
     */
    removeCondition(index) {
      if (index > -1) {
        this.conditions.splice(index, 1);
      }
    },
    addCondition() {
      this.conditions.push({
        field: '',
        operator: '',
        value: ''
      })
    }
  },
  mounted () {
    // If we don't have any conditions, render the form for the first condition
    // to reduce clicking and conditional rendering on this template
    if (this.conditions.length == 0) {
      this.addCondition()
    }
  }
}
</script>

<style scoped>

</style>
