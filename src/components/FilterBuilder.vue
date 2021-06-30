<template>
  <AndOr :options="options" :is-first="isFirst"></AndOr>
</template>

<script>
import AndOr from "./AndOR"

export default {
  name: "FilterBuilder",
  components: {
    AndOr
  },
  data () {
    return {
      options: {
        keys: this.keys,

        operators: [{
          name: 'Choose Operator',
          id: -99
        },{
          name: 'more',
          id: '>'
        },{
          name: 'equal',
          id: '='
        },{
          name: 'less',
          id: '<'
        }]
      },

      isFirst: true,
      showQueryModal: false,

      showFillModal: false,

      fetchedQuery: '',

      filledQuery: ''
    }
  },
  computed: {
    keys () {
      return this.$store.state.workspace.schema.options.keys
    }
  }
}
</script>

<style scoped>

</style>