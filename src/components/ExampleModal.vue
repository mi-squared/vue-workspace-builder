<template>
  <modal name="example-modal" height="auto">
    <div class="card">
      <div class="card-header">
        Featured
      </div>
      <div class="card-body">
        <FormElementSelector></FormElementSelector>
      </div>
    </div>
  </modal>
</template>

<script>
import FormElementSelector from './FormElementSelector'


export default {
  name: 'ExampleModal',
  components: {
    FormElementSelector
  },
  methods: {
    show () {
      this.$modal.show('example-modal');
    },
    hide () {
      this.$modal.hide('example-modal');
    }
  },
  mount () {
    this.hide()
  }
}
</script>

<style></style>
