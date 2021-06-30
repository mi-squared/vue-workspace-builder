<template>
  <div>
    <ul class="nav nav-tabs">
      <li v-for="tab in tabs" :key="tab" class="nav-item">
        <a class="nav-link" :class="{ active: tab === selected }" @click="setTab(tab)"
        >{{ tab }}</a>
      </li>
      <li class="nav-item ml-auto">
        <button type="button" class="btn btn-secondary ml-2">Preview</button>
        <button type="button" class="btn btn-success ml-2 disabled">Publish</button>
      </li>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TabNav',
  props: {
    /* Holds all of the tabs data */
    tabs: {
      type: Array,
      required: true,
    },
    selected: {
      type: String,
      required: true,
    }
  },
  methods: {
    setTab(tab) {
      this.$emit('selected', tab)
    },
  },
}
</script>