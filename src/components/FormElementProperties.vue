<template>
<v-list>
  <v-list-item>
    <v-list-item-avatar>
      <v-icon>mdi-page-layout-header</v-icon>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>{{ element.name }}</v-list-item-title>
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
        :value="element.type"
        label="Data Type"
        readonly
      ></v-text-field>
      <v-text-field
        :value="element['x-display']"
        label="Display Type"
      ></v-text-field>

      <v-text-field
        v-model="element.title"
        label="Label"
      ></v-text-field>
      <v-text-field
        v-model="element.description"
        label="Description"
      ></v-text-field>
      <!--          TODO need read-onlly to come from the data-source vuex module getter -->
      <v-checkbox
        v-model="element.readOnly"
        :readonly="false"
        label="Read-Only"
      ></v-checkbox>

      <v-checkbox
        v-model="element.hasConditions"
        label="Conditional Logic"
      ></v-checkbox>

      <ConditionBuilder
        v-if="element.hasConditions == true"
        :form="form"
        :element="element"
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
    }
  },
  methods: {
    onSaveClicked() {
      this.$emit('save', { element: this.element })
    },
    onCancelClicked() {
      this.$emit('cancel', { element: this.element })
    }

  },

}
</script>

<style scoped>

</style>
