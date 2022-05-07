<template>
<div class="select-modal relative-container">
  <div v-if="loaded && items != undefined && items.length > 0">

    <v-menu
      :close-on-content-click="false"
      v-model="menu"
      attach
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          :key="id + index + 'select-modal'"
          :value="displayValue"
          readonly
          v-bind="attrs"
          v-on="on"
        >
        </v-text-field>
      </template>

      <!-- dialog content -->
      <v-toolbar
        dense
      >
        <v-autocomplete
          class="mt-2"
          :key="id"
          v-model="myValue"
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
import { createNamespacedHelpers } from 'vuex'
import { GET_LIST } from '../../store/types-list'
const { mapGetters: mapListGetters } = createNamespacedHelpers('list')
export default {
  name: 'SelectModal',
  props: {
    listId :{
      type: String,
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
      activeModel: this.model,
      myValue: null // The list option value (not display label)
    }
  },
  computed: {
    ...mapListGetters({
      getList: GET_LIST
    }),
    items () {
      return this.getList(this.listId).data
    },
    /**
     * Display value for the list option
     *
     * @returns {string|*}
     */
    displayValue () {
      const displayValue = this.items.find(item => {
        if (this.myValue != undefined &&
          item.value == this.myValue) {
          return item
        }
      })
      if (displayValue != undefined) {
        return displayValue.text
      }
      return ''
    }
  },
  watch: {
    menu: function () {
      if (this.menu === true) {
        this.$emit("show", true)
      } else {
        this.$emit("show", false)
      }
    }
  },
  methods: {
    onSave () {
      this.activeModel[this.index] = this.myValue
      this.$emit('changed', this.activeModel)
      this.menu = false
    },
    onClose () {
      this.myValue = this.model[this.index]
      this.menu = false
    },
    onClear () {
      this.myValue = null
    }
  },
  mounted () {
    this.myValue = this.model[this.index]
    this.loaded = true
  },
  beforeDestroy () {
    this.activeModel = null
  }
}
</script>

<style scoped>

</style>
