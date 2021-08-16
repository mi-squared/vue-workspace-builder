<template>
  <div id="layout-builder">
    <v-container>
      <v-row>
        <v-col cols="12" sm="8">
          <v-btn @click="addItem">Add Form Element</v-btn>
          <v-sheet rounded="lg" min-height="268" elevation="1">
            <grid-layout
              :layout.sync="grid"
              :col-num="12"
              :row-height="30"
              :is-draggable="true"
              :is-resizable="true"
              :is-mirrored="false"
              :vertical-compact="true"
              :margin="[10, 10]"
              :use-css-transforms="true"
            >
              <grid-item
                v-for="item in grid"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                :key="item.i"
              >
                {{ item.i }}
              </grid-item>
            </grid-layout>
          </v-sheet>
        </v-col>

        <v-col cols="12" sm="4">
          <FormProperties :form-model="activeFormModel"></FormProperties>

          <v-card rounded="lg" min-height="268" class="mt-0 p-4">
            <v-card-title>Element Properties</v-card-title>
            <v-card-text> </v-card-text>
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
import VueGridLayout from "vue-grid-layout";
import FormElementSelector from "@/components/FormElementSelector";
import FormProperties from "@/components/FormProperties";

export default {
  name: "LayoutBuilder",
  components: {
    FormProperties,
    FormElementSelector,
    // VueGridDesigner,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
  props: {
    form: {
      type: Object,
      required: true,
    },
  },
  data: function() {
    return {
      showFormElementSelector: false,
      activeLayoutIndex: 0,
      layouts: [
        {
          id: 1,
          title: "Main Form",
        },
      ],
      grid: [],
      index: 0,
    };
  },
  computed: {
    activeFormModel() {
      return this.layouts[this.activeLayoutIndex];
    },
  },
  mounted() {
    this.index = this.layout.length;
  },
  methods: {
    addItem: function() {
      this.showFormElementSelector = true;
      // this.$refs.foo.show("example-modal");

      // Add a new item. It must have a unique key!
      this.grid.push({
        x: (this.grid.length * 2) % (this.colNum || 12),
        y: this.grid.length + (this.colNum || 12), // puts it at the bottom
        w: 12,
        h: 2,
        i: this.index,
      });
      // Increment the counter to ensure key is always unique.
      this.index++;
    },
  },
};
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
