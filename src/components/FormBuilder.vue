<template>
  <v-container>
    <v-toolbar dense flat>

      <v-app-bar-nav-icon @click="navigationHamburgerClicked"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ this.activeFormModel.title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn color="success" :disabled="!isDirty">
        <v-icon>mdi-floppy</v-icon>
        <div>Save</div>
      </v-btn>

    </v-toolbar>

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
              <v-btn
                color="red lighten-2"
                dark
                @click="setSelectedElement(item.name)"
              >
                Edit
              </v-btn>
            </grid-item>
          </grid-layout>
        </v-sheet>
      </v-col>

      <v-col cols="12" sm="4">
        <FormProperties
          :form="form"
        ></FormProperties>

        <v-card
          rounded="lg"
          min-height="268"
          class="mt-0 p-4"
          v-if="selectedElement"
        >
          <v-card-title>Element Properties</v-card-title>
          <v-card-text>
            <v-text-field
              :value="selectedElement.type"
              label="Type"
              readonly
            ></v-text-field>
            <v-text-field
              v-model="selectedElement.schema.title"
              label="Label"
              @change="syncSelectedElement"
            ></v-text-field>
            <v-text-field
              v-model="selectedElement.schema.description"
              label="Description"
              @change="syncSelectedElement"
            ></v-text-field>
            <v-checkbox
              v-model="selectedElement.schema.readOnly"
              :readonly="selectedElement.extra.createdBy == 'system'"
              label="Read-Only"
            ></v-checkbox>
            <v-checkbox label="Show on Read-Only View"></v-checkbox>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VueGridLayout from "vue-grid-layout";
import FormProperties from "@/components/FormProperties";

import { createNamespacedHelpers } from 'vuex'
import { GET_FORM, SET_FORM_GRID, SET_FORM_SCHEMA } from '../store/types-form'
const { mapState: mapFormState, mapActions: mapFormActions, mapGetters: mapFormGetters } = createNamespacedHelpers('form')
import { GET_DATA_SOURCE, GET_WORKSPACE } from '../store/types-workspace'
const { mapState: mapWorkspaceState, mapActions: mapWorkspaceActions, mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')

export default {
  name: "LayoutBuilder",
  components: {
    FormProperties,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
  props: {
    formId: {
      type: Number,
      required: true,
    },
    workspaceId: {
      type: Number,
      required: true,
    },
  },
  data: function() {
    return {
      ...mapFormState,
      ...mapWorkspaceState,
      isDirty: false,
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
      selectedElement: null,
    };
  },
  computed: {
    ...mapFormGetters({
      getForm: GET_FORM
    }),
    ...mapWorkspaceGetters({
      getDataSource: GET_DATA_SOURCE,
      getWorkspace: GET_WORKSPACE
    }),
    form() {
      return this.getForm(this.formId)
    },
    activeFormModel() {
      return this.layouts[this.activeLayoutIndex];
    },
    dataSource() {
      return this.getDataSource(this.workspaceId)
    },
    columns() {
      return this.dataSource.spec.columns
    }
    // selectedElement() {
    //   if (this.selected !== null) {
    //     return this.columns[this.selected];
    //   }

    //   return null;
    // },
  },

  created() {
    this.fetchData();
  },
  watch: {
    // call again the method if the route changes
    $route: "fetchData",
  },
  methods: {
    ...mapFormActions({
      setFormGrid: SET_FORM_GRID,
      setFormSchema: SET_FORM_SCHEMA
    }),
    ...mapWorkspaceActions,
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
    fetchData() {
      console.log("fetchData!");
      this.grid = this.getForm(
        this.formId
      ).formDefinition.grid;

      console.log(this.grid);
      this.index = this.grid.length;
    },
    setSelectedElement(name) {
      this.selectedElement = JSON.parse(JSON.stringify(this.columns[name]));
    },
    syncSelectedElement() {
      // sync the selected element to the vuex store on change
      this.$store.commit("setDataSourceColumn", {
        workspaceId: this.workspaceId,
        column: this.selectedElement,
      });

      // update the form schema so the preview looks correct
      this.updateFormSchema();
    },
    updateFormSchema() {
      let schema = { properties: {} };

      for (const row of this.grid) {
        const column = this.columns[row.name];
        schema.properties[row.name] = {
          ...column.schema,
          // format: "date",
          "x-cols": row.w,
        };
      }

      this.setFormGrid({
        formId: this.formId,
        grid: this.grid,
      })

      this.setFormSchema({
        formId: this.formId,
        schema: schema,
      })
    },
    navigationHamburgerClicked() {
      this.$emit('hamburger-navigation-clicked')
    }
  },
};
</script>

<style></style>
