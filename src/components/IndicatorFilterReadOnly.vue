<template>
<v-card>
  <v-card-title>
    <v-icon :color="rule.action.actionData.color">{{ rule.action.actionData.icon }} {{ rule.action.actionData.note }}</v-icon>
  </v-card-title>
  <v-card-subtitle>{{ rule.logicalType }}</v-card-subtitle>
  <v-card-text>
    <v-row v-for="(filter, filterIndex) in rule.conditions" :key="filterIndex">
      <v-col>
        <v-text-field readonly disabled :value="filter.field"></v-text-field>
      </v-col>

      <v-col>
        <v-text-field readonly disabled :value="filter.operator"></v-text-field>
      </v-col>

      <v-col>
        <v-text-field
          readonly disabled
          :value="filter.value"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-card-text>
</v-card>
</template>

<script>
export default {
  name: 'IndicatorFilterReadOnly',
  props: {
    rule: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
