<template>
<v-row>
  <v-col
    v-for="(element, i) in elements"
    :key="i"
    :cols="element['x-cols']"
  >
    <p class="font-weight-light mb-0">
      {{ element.title }}
    </p>
    <p class="font-weight-medium">
      {{ activeModel[element.dataSourceColumn] }}
    </p>
  </v-col>
</v-row>
</template>

<script>
export default {
  name: 'JsonFormTimelineView',
  props: {
    form: {
      type: Object,
      required: true
    },
    model: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      activeModel: this.model
    }
  },
  computed: {
    elements () {
      let elements = []
      let that = this
      if (this.form.grid != undefined && this.form.schema.properties != undefined) {
        elements = this.form.grid.filter(element => {
          const property = that.form.schema.properties[element.meta.name]
          if ((property.visibleOnTimeline != undefined && property.visibleOnTimeline) ||
            property.visibleOnTimeline == undefined) {
            return element
          }
        }).map(element => {
          return that.form.schema.properties[element.meta.name]
        })
      }
      return elements
    }
  }
}
</script>

<style scoped>

</style>
