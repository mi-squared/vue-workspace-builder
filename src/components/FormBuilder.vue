<template>
  <v-container>

    <v-tabs
      v-model="tab"
      icons-and-text
    >
      <v-tab :key="'tab-properties'">
        Properties
        <v-icon>mdi-settings</v-icon>
      </v-tab>
      <v-tab :key="'tab-columns'">
        Layout
        <v-icon>mdi-table</v-icon>
      </v-tab>

      <v-spacer></v-spacer>

      <FormPreviewButton :form="activeForm" :key="activeForm.id"></FormPreviewButton>

      <v-btn class="mt-4 mr-2" color="success" :disabled="!isDirty" @click="save">
        <v-icon>mdi-floppy</v-icon>
        Save
      </v-btn>

    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item :key="'tab-properties'">
        <FormProperties
          :form="activeForm"
          :key="activeForm.id"
        ></FormProperties>
      </v-tab-item>

      <v-tab-item :key="'tab-layout'">
        <!-- <v-btn @click="addItem">Add Form Element</v-btn> -->
        <v-dialog v-model="showFormElementSelector" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
              + Element
            </v-btn>
          </template>

          <v-card>

            <v-card-title class="text-h5 grey lighten-2">
              Data Source Elements
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
            :layout.sync="activeForm.grid"
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
              v-for="item in activeForm.grid"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
              :key="item.i"
              @move="updateFormSchema"
            >
              {{ item.meta.name }} {{ item.meta.type }}
              <v-btn
                color="red lighten-2"
                dark
                @click="setSelectedElement(item.meta.name)"
              >
                Edit
              </v-btn>
            </grid-item>
          </grid-layout>
        </v-sheet>
      </v-tab-item>
    </v-tabs-items>

    <!-- when an element is clicked, this should slide out -->
    <v-navigation-drawer
      v-model="drawer"
      app
      absolute
      right
      temporary
      width="420"
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-icon>mdi-page-layout-header</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ selectedElement.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-form
        ref="form"
        v-model="validElement"
        lazy-validation
      >
        <v-container>

          <v-text-field
            :value="selectedElement.type"
            label="Type"
            readonly
          ></v-text-field>
          <v-text-field
            v-model="selectedElement.title"
            label="Label"
          ></v-text-field>
          <v-text-field
            v-model="selectedElement.description"
            label="Description"
          ></v-text-field>
<!--          TODO need read-onlly to come from the data-source vuex module getter -->
          <v-checkbox
            v-model="selectedElement.readOnly"
            :readonly="false"
            label="Read-Only"
          ></v-checkbox>
          <v-checkbox label="Show on Read-Only View"></v-checkbox>

          <v-btn
            color="success"
            class="mr-4"
            @click="storeSelectedElement"
          >
            Save
          </v-btn>
          <v-btn
            color="secondary"
            class="mr-4"
            @click="drawer = false"
          >
            Cancel
          </v-btn>
        </v-container>
      </v-form>
    </v-navigation-drawer>

  </v-container>
</template>

<script>
import VueGridLayout from "vue-grid-layout";
import FormProperties from "@/components/FormProperties";

import { createNamespacedHelpers } from 'vuex'

import { GET_DATA_SOURCE, GET_SCHEMA_TEMPLATE_BY_TYPE, GET_WORKSPACE } from '../store/types-workspace'
const { mapState: mapWorkspaceState, mapActions: mapWorkspaceActions, mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')

import { GET_FORM, SET_FORM, SET_FORM_GRID, SET_FORM_SCHEMA } from '../store/types-form'
import FormPreviewButton from './FormPreviewButton'
const { mapState: mapFormState, mapActions: mapFormActions, mapGetters: mapFormGetters } = createNamespacedHelpers('form')

export default {
  name: 'FormBuilder',
  components: {
    FormPreviewButton,
    FormProperties,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
  props: {
    /**
     * The FormBuilder requires the workspace for access to the data source
     */
    workspace: {
      type: Object,
      required: true
    },
    form: {
      type: Object,
      required: true,
    },
  },
  data: function() {
    return {
      ...mapFormState,
      ...mapWorkspaceState,
      isDirty: false,
      tab: null,
      drawer: null,
      showFormElementSelector: false,
      selectedElement: {},
      validElement: true, // true if the properties of a new or modified element are valid
      index: this.form.grid.length,
      activeForm: { ...this.form }
    }
  },
  watch: {
    activeForm: {
      // Watch the activeForm using a deep watch, and when it changes,
      // mark the model as dirty, which activates the "save" button
      handler() {
        this.isDirty = true
        // TODO should propagate an event up to let navigation know that there are unsaved changes on this builder
      },
      deep: true
    }
  },
  computed: {
    ...mapFormGetters({
      getForm: GET_FORM,
    }),
    ...mapWorkspaceGetters({
      getDataSource: GET_DATA_SOURCE,
      getWorkspace: GET_WORKSPACE,
      getSchemaTemplateByType: GET_SCHEMA_TEMPLATE_BY_TYPE,
    }),
    dataSource() {
      return this.workspace.dataSource
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
  methods: {
    ...mapFormActions({
      setForm: SET_FORM,
      setFormGrid: SET_FORM_GRID,
      setFormSchema: SET_FORM_SCHEMA,
    }),
    ...mapWorkspaceActions,
    save() {
      this.$emit('form-save-clicked', { form: this.activeForm.id })
      let that = this
      this.setForm({ formId: this.activeForm.id, form: this.activeForm })
        .then(function () {
          that.isDirty = false
        })
    },
    addItem: function(column) {
      console.log(column);

      // Add a new item. It must have a unique key!
      this.activeForm.grid.push({
        x: (this.activeForm.grid.length * 2) % (this.colNum || 12),
        y: this.activeForm.grid.length + (this.colNum || 12), // puts it at the bottom
        w: 12,
        h: 2,
        i: this.index,
        // Meta contains the model for the visual representation of the grid element, and
        // also helps to map the grid element to the form element and it's type.
        meta: {
          type: column.type,
          name: column.name,
        }
      });
      // Increment the counter to ensure key is always unique.
      this.index++
      // close the dialog
      this.showFormElementSelector = false;
    },
    setSelectedElement(name) {
      this.selectedElement = this.activeForm.properties[name]
      this.drawer = true
    },
    storeSelectedElement() {
      // // sync the selected element to the vuex store on change
      // this.$store.commit("setDataSourceColumn", {
      //   workspaceId: this.workspaceId,
      //   column: this.selectedElement,
      // });
      //
      // // update the form schema so the preview looks correct
      // this.updateFormSchema()
      this.updateFormSchema()
      console.log('save clicked')
      this.drawer = false
    },

    /**
     * This function is called whenever the form's layout is changed
     */
    updateFormSchema() {
      // Loop through the form properties  as stored in Vuex grid, and lookup by name
      // and create a format that JSON Form Schema component likes by merging with the type's
      // schema template
      this.activeForm.properties = {}
      for (const row of this.activeForm.grid) {
        const element = this.activeForm.properties[row.meta.name]
        const schemaTemplate = this.getSchemaTemplateByType(row.meta.type)

        this.activeForm.properties[row.meta.name] = {
          ...schemaTemplate,
          ...element,
          // format: "date",
          "x-cols": row.w,
        }
      }

      // this.setFormGrid({
      //   formId: this.form.id,
      //   grid: this.grid,
      // })
      //
      // this.setFormSchema({
      //   formId: this.form.id,
      //   schema: schema,
      // })
    },
  },
}
</script>

<style></style>
