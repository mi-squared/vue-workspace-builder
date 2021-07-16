<template>
<div id="layout-builder">
  <v-container>
    <v-row>
      <v-col
          cols="12"
          sm="8"
      >
        <v-sheet
            rounded="lg"
            min-height="268"
        >
          <vue-grid-designer v-model="grid" @add-block="onBlockAdded" ></vue-grid-designer>

        </v-sheet>
      </v-col>

      <v-col
          cols="12"
          sm="4"
      >
        <LayoutProperties :layout-model="activeLayoutModel"></LayoutProperties>

        <v-card
            rounded="lg"
            min-height="268"
            class="mt-0 p-4"
        >

          <v-card-title>Element Properties</v-card-title>
          <v-card-text>

          </v-card-text>
        </v-card>

      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="showFormElementSelector">
    <FormElementSelector></FormElementSelector>
  </v-dialog>
</div>
</template>

<script>
import VueGridDesigner from '@thefoot/vue-grid-designer'
import FormElementSelector from "@/components/FormElementSelector"
import LayoutProperties from '@/components/LayoutProperties'

export default {
  name: 'LayoutBuilder',
  components: {
    LayoutProperties,
    FormElementSelector,
    VueGridDesigner
  },
  data: function() {
    return {
      showFormElementSelector: false,
      activeLayoutIndex: 0,
      layouts: [
        {
          id: 1,
          title: 'Main Form'
        }
      ],
      grid: [],
    }
  },
  computed: {
    activeLayoutModel () {
      return this.layouts[this.activeLayoutIndex]
    },
  },
  methods: {
    onBlockAdded () {
      this.showFormElementSelector = true
      this.$refs.foo.show('example-modal')
    }
  }
}
</script>

<style>
/*
  Put the little rectangular toolbar, with the "expand +", "shrink -" and "remove X" buttons in the top right.
  This is so when you click the "+" or "-" that the box doesn't shift away frm the user's mouse :)
  FYI, this doesn't appear to work if style is 'scoped', because of the more targeted CSS dynamically generated for the element
 */
#layout-builder .vgd__block__toolbar {
  left: 38px;
  top: 15px;
}
</style>