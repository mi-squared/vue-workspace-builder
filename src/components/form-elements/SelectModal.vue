<template>
<div class="select-modal">
  <div v-if="loaded && items != undefined">

    <v-menu
      top
      :close-on-content-click="false"
      v-model="menu"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          :key="id + index + 'select-modal'"
          v-model="activeModel[index]"
          readonly
          v-bind="attrs"
          v-on="on"
        >
          {{ activeModel[index] }}
        </v-text-field>
      </template>

      <!-- dialog content -->
      <v-toolbar dense>
        <v-autocomplete
          class="mt-2"
          :key="id"
          v-model="activeModel[index]"
          :items="items"
        >
        </v-autocomplete>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="onSave"
              class="btn-sm"
              icon
              color="primary"
              v-bind="attrs"
              v-on="on"
            ><v-icon>mdi-check-bold</v-icon></v-btn>
          </template>
          <!-- button tooltip -->
          <span>Save</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="onClear"
              class="btn-sm"
              icon
              v-bind="attrs"
              v-on="on"
            ><v-icon>mdi-cancel</v-icon></v-btn>
          </template>
          <!-- button tooltip -->
          <span>Clear</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="onClose"
              class="btn-sm"
              icon
              v-bind="attrs"
              v-on="on"
            ><v-icon>mdi-close</v-icon></v-btn>
          </template>
          <!-- button tooltip -->
          <span>Cancel</span>
        </v-tooltip>
      </v-toolbar>
    </v-menu>
  </div>
  <div v-else>
    <v-skeleton-loader type="table-cell"></v-skeleton-loader>
  </div>
</div>
</template>

<script>
export default {
  name: 'SelectModal',
  props: {
    items: {
      required: true
    },
    id: {
      type: String,
      required: true
    },
    model: {
      type: Object,
      required: true
    },
    index: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loaded: false,
      menu: false,
      activeModel: { ...this.model }
    }
  },
  methods: {
    onSave () {
      this.$emit('changed', this.activeModel)
      this.menu = false
    },
    onClose () {
      this.activeModel[this.index] = this.model[this.index]
      this.menu = false
    },
    onClear () {
      this.activeModel[this.index] = null
    }
  },
  mounted () {
    this.loaded = true
  }
}
</script>

<style scoped>

</style>
