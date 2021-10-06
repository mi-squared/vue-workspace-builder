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
        <DataSourceColPickerBtn :workspace="workspace" @selected="addItem"></DataSourceColPickerBtn>

        <v-divider class="mt-2" ></v-divider>

        <v-sheet>
          <grid-layout
            :layout.sync="activeForm.grid"
            :col-num="12"
            :row-height="20"
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
              :minW="3"
              :maxW="12"
              :minH="2"
              :maxH="2"
              @moved="updateFormSchema"
            >
              <v-toolbar flat dense>
                <v-icon>mdi-drag-vertical</v-icon>
                <v-toolbar-title>{{ item.meta.name }}</v-toolbar-title>

                &nbsp;

                <p class="mt-4 font-weight-thin">
                  [{{ item.meta.type }}]
                </p>

                <v-btn
                  icon
                  @click="setSelectedElement(item.meta.name)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-toolbar>
            </grid-item>
          </grid-layout>
        </v-sheet>

        <v-divider class="mt-2" ></v-divider>

        <v-row>
          <v-col>
        <v-textarea
          :value="JSON.stringify(activeForm.grid, undefined, 4)"
          auto-grow
          readonly
          label="Grid"
        >
        </v-textarea>
          </v-col>
          <v-col>
        <v-textarea
          :value="JSON.stringify(activeForm.schema, undefined, 4)"
          auto-grow
          readonly
          label="Schema"
        >
        </v-textarea>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>

    <!-- when an element is clicked, this should slide out -->
    <v-navigation-drawer
      v-model="drawer"
      app
      right
      temporary
      width="520"
    >
      <FormElementProperties
        :key="Math.floor(Math.random() * 32768)"
        :form="this.activeForm"
        :data-source="this.dataSource"
        :element="activeElement"
        @save="storeSelectedElement"
        @cancel="drawer = false"
      ></FormElementProperties>
    </v-navigation-drawer>

    <div class="text-center ma-2">
      <v-snackbar
        v-model="snackbar.show"
      >
        {{ snackbar.text }}

        <template v-slot:action="{ attrs }">
          <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="snackbar.show = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>

  </v-container>
</template>

<script>
import VueGridLayout from "vue-grid-layout";
import FormProperties from "@/components/FormProperties";

import { createNamespacedHelpers } from 'vuex'

import { GET_DATA_SOURCE, GET_SCHEMA_TEMPLATE_BY_TYPE, GET_WORKSPACE } from '../store/types-workspace'
const { mapActions: mapWorkspaceActions, mapGetters: mapWorkspaceGetters } = createNamespacedHelpers('workspace')

import { GET_FORM, SET_FORM, SET_FORM_GRID, SET_FORM_SCHEMA } from '../store/types-form'
import FormPreviewButton from './FormPreviewButton'
import FormElementProperties from './FormElementProperties'
import DataSourceColPickerBtn from './DataSourceColPickerBtn'
const { mapActions: mapFormActions, mapGetters: mapFormGetters } = createNamespacedHelpers('form')

export default {
  name: 'FormBuilder',
  components: {
    DataSourceColPickerBtn,
    FormElementProperties,
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
      isDirty: false,
      tab: null,
      drawer: null,
      showFormElementSelector: false,
      selectedElement: {},
      index: this.form.grid.length,
      activeForm: { ...this.form },
      snackbar: {
        text: '',
        show: false
      }
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
    },
    activeElement() {
      return this.selectedElement
    },
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
      })
      // Increment the counter to ensure key is always unique.
      this.index++
    },
    setSelectedElement(name) {
      console.log("Active Element: " + name)
      this.selectedElement = this.activeForm.schema.properties[name]
      this.drawer = true
    },
    storeSelectedElement({ key, element }) {
      this.activeForm.schema.properties[key] = element

      if (this.dataSource.spec.columns[key].extra.createdBy == 'system' &&
        element.readOnly === false) {
        // element.readOnly = true
        this.snackbar.text = "Warning, allowing editing of a system-generated type"
        this.snackbar.show = true
      }

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
      //this.activeForm.schema.allOf = []

      // Sort the grid by Y and then by X so that the form components render
      // in the correct order. We have to clone the grid, because if we sort
      // the reactive property, it will trigger an infinite update loop!!!
      let grid = [...this.activeForm.grid]
      grid.sort(function(a, b) {
        if (a.y > b.y) {
          return 1
        } else if (a.y < b.y) {
          return -1
        } else {
          if (a.x > b.x) {
            return 1
          } else if (a.x < b.x) {
            return -1
          }
        }

        return 0
      })

      // Before we clear the properties, we need to preserve our settings on the element
      // which are stored in properties. So here we clone the schema so it can be rebuilt.
      let schema = JSON.parse(JSON.stringify(this.activeForm.schema))

      // We have to rebuild the form properties every time so that they appear in
      // the correct order. We hope that the browser conforms to spec that object keys
      // will be returned in the order they were placed in the object, otherwise,
      // we'll get form elements out of order with our grid
      this.activeForm.schema.properties = {}
      for (const row of grid) {

        const element = schema.properties[row.meta.name] || {}
        const schemaTemplate = this.getSchemaTemplateByType(row.meta.type)

        // If the element doesn't have a title or description, grab the
        // name and comment from the datasource to use as initial values
        // (this is also the same as row.meta.name)
        if (element.title === undefined) {
          element.title = this.dataSource.spec.columns[row.meta.name].name
        }

        if (element.description === undefined) {
          element.description = this.dataSource.spec.columns[row.meta.name].comment
        }

        // If this is a system-generated field, make read-only
        if (element.readOnly === undefined &&
          this.dataSource.spec.columns[row.meta.name].extra.createdBy == 'system') {
          element.readOnly = true
        }

        // Create a v-if element so this element can be responsive to conditional rendering
        // The v-if property will be passed to the form as an option if it should be rendered
        // or not. The options are generated dynamically in the JsonForm Component based on
        // conditional logic
        element["x-if"] = "context.show_" + this.dataSource.spec.columns[row.meta.name].name

        // Store the data source column in the object for easy access while iterating (it's also the key)
        element.dataSourceColumn = this.dataSource.spec.columns[row.meta.name].name

        this.activeForm.schema.properties[row.meta.name] = {
          ...schemaTemplate,
          ...element,
          "x-cols": row.w,
        }
      }
    },
  },
}
</script>

<style></style>
