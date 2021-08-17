<template>
  <div id="layout-builder">
    <v-container>
      <v-row>
        <v-col cols="12" sm="8">
          <!-- <v-btn @click="addItem">Add Form Element</v-btn> -->
          <v-dialog v-model="showFormElementSelector" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
                + Element
              </v-btn>
            </template>

            <v-card>
              <v-card-title class="text-h5 grey lighten-2">
                Add Form Element
              </v-card-title>

              <v-card-text>
                <v-list-item
                  two-line
                  v-for="(column, i) in columns"
                  :key="i"
                  link
                  @click="addItem(column)"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ column.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      column.comment
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="showFormElementSelector = false"
                >
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

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
              @layout-updated="updateFormSchema"
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
                {{ item.name }}
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
  </div>
</template>

<script>
import { get } from "vuex-pathify";

import VueGridLayout from "vue-grid-layout";
import FormProperties from "@/components/FormProperties";

export default {
  name: "LayoutBuilder",
  components: {
    FormProperties,
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
    columns: get("workspaces[1].dataSource.spec.columns"),
  },
  mounted() {
    this.index = this.grid.length;
  },
  methods: {
    addItem: function(column) {
      console.log(column);

      // Add a new item. It must have a unique key!
      this.grid.push({
        x: (this.grid.length * 2) % (this.colNum || 12),
        y: this.grid.length + (this.colNum || 12), // puts it at the bottom
        w: 12,
        h: 2,
        i: this.index,
        name: column.name,
      });
      // Increment the counter to ensure key is always unique.
      this.index++;
      // close the dialog
      this.showFormElementSelector = false;
    },
    updateFormSchema() {
      let schema = { properties: {} };

      for (const row of this.grid) {
        const column = this.columns[row.name];
        schema.properties[row.name] = {
          type: "string", //column.type,
          description: column.comment,
          // format: "date",
          "x-cols": row.w,
        };
      }

      this.$store.commit("setFormSchema", {
        workspaceId: 1,
        formId: 0,
        schema: schema,
      });
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
