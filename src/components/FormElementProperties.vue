<template>
<v-list>
  <v-list-item>
    <v-list-item-avatar>
      <v-icon>mdi-page-layout-header</v-icon>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-subtitle>Data Source Column</v-list-item-subtitle>
      <v-list-item-title>{{ activeElement.dataSourceColumn }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>

  <v-divider></v-divider>

  <v-form
    ref="form"
    v-model="validElement"
    lazy-validation
  >
    <v-container>

      <v-text-field
        :value="activeElement.type"
        label="Data Type"
        readonly
      ></v-text-field>
      <v-text-field
        :value="activeElement['x-display']"
        label="Display Type"
      ></v-text-field>

      <v-text-field
        v-model="activeElement.title"
        label="Label"
      ></v-text-field>
      <v-text-field
        v-model="activeElement.description"
        label="Description"
      ></v-text-field>
      <!--          TODO need read-onlly to come from the data-source vuex module getter -->
      <v-checkbox
        v-model="activeElement.readOnly"
        :readonly="false"
        label="Read-Only"
      ></v-checkbox>

      <v-checkbox
        v-model="activeElement.hasConditionalLogic"
        label="Conditional Logic"
      ></v-checkbox>

      <ConditionBuilder
        v-if="activeElement.hasConditionalLogic == true"
        :form="form"
        :element="activeElement"
        :key="form.id + activeElement.name"
        @change="onConditionalLogicChanged"
        ></ConditionBuilder>

      <v-checkbox label="Show on Read-Only View"></v-checkbox>

      <v-btn
        color="success"
        class="mr-4"
        @click="onSaveClicked"
      >
        Save
      </v-btn>
      <v-btn
        color="secondary"
        class="mr-4"
        @click="onCancelClicked"
      >
        Cancel
      </v-btn>
    </v-container>
  </v-form>
</v-list>
</template>

<script>
import ConditionBuilder from './form-elements/ConditionBuilder'
export default {
  name: 'FormElementProperties',
  components: { ConditionBuilder },
  props: {
    form: {
      type: Object,
      required: true
    },
    dataSource: {
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
      validElement: true, // true if the properties of a new or modified element are valid
      activeElement: { ...this.element } // Copy the element prop into our local data for modification
    }
  },
  methods: {
    onSaveClicked() {
      this.$emit('save', { key: this.activeElement.dataSourceColumn, element: this.activeElement })
    },
    onCancelClicked() {
      this.$emit('cancel', { key: this.activeElement.dataSourceColumn, element: this.activeElement })
    },
    onConditionalLogicChanged(conditionalLogic) {
      this.activeElement.conditionalLogic = conditionalLogic
    }

  },
  mounted () {
    console.log("FormElementProperties mounted()")
  }

}
</script>

<style scoped>

</style>
