<template>
<v-sheet>
  <v-row>
    <v-col>
      <v-select v-model="conditionalLogic.action" :items="actions"></v-select>
    </v-col>
    <v-col>
      <p class="mt-4">this element if</p>
    </v-col>
    <v-col>
      <v-select v-model="conditionalLogic.logicalType" :items="logicalTypes"></v-select>
    </v-col>
  </v-row>

  <v-row v-for="(condition, index) in conditionalLogic.conditions" :key="index">
    <v-col>
      <v-select :items="fieldOptions" v-model="condition.field"></v-select>
    </v-col>

    <v-col>
      <v-select :items="operators" v-model="condition.operator"></v-select>
    </v-col>

    <v-col>
      <v-text-field v-model="condition.value"></v-text-field>
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
          v-if="index == conditionalLogic.conditions.length - 1"
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
      conditionalLogic: {
        action: '',
        logicalType: '',
        conditions: [],

        ...this.element.conditionalLogic
      }
    }
  },
  watch: {
    conditionalLogic: {
      // Watch the conditional logic and if it changes, bubble up to parent
      handler() {
        this.$emit('change', this.conditionalLogic)
      },
      deep: true
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
      let options = []
      Object.values(this.form.schema.properties).forEach(function(property) {
        options.push({
          text: property.title,
          value: property.dataSourceColumn
        })
      })

      return options
    },
    operators() {
      return [
        '>', '<', '=', '!='
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
        this.conditionalLogic.conditions.splice(index, 1);
      }
    },
    addCondition() {
      this.conditionalLogic.conditions.push({
        field: '',
        operator: '',
        value: ''
      })
    }
  },
  mounted () {
    // If we don't have any conditions, render the form for the first condition
    // to reduce clicking and conditional rendering on this template
    if (this.conditionalLogic.conditions.length == 0) {
      this.addCondition()
    }
  }
}
</script>

<style scoped>

</style>
