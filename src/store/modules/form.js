import { createForm } from '../../api'
// import Vue from 'vue'
import { ALL_FORMS, GET_FORM, SET_FORM_GRID, SET_FORM_SCHEMA } from '../types-form'

export const form = {
  namespaced: true,
  state: {
    forms: {
      100: {
        id: 100,
        title: "Dashboard Create Form",
        // JSON Schema definition utilizing the format required by this library:
        // https://koumoul-dev.github.io/vuetify-jsonschema-form/latest/getting-started
        formDefinition: {
          // Global Options
          grid: [],
          options: {
            timePickerProps: {
              format: "24h",
            },
          },
          schema: {
            stringProp: {
              type: "string",
              title: "I'm a string",
              format: "string",
              "x-cols": 6,
            },
            dateTimeProp: {
              type: "string",
              title: "I'm a date-time",
              format: "date-time",
              description: "This description is used as a help message.",
              "x-cols": 6,
            },
            stringTextareaProp: {
              type: "string",
              title: "I'm a string in a textarea",
              "x-display": "textarea",
            },
            numberProp: {
              type: "number",
              title: "I'm a number",
            },
            integerProp: {
              type: "integer",
              title: "I'm an integer",
            },
            integerSliderProp: {
              type: "integer",
              title: "I'm an integer in a slider",
              "x-display": "slider",
              minimum: 0,
              maximum: 5,
            },
            booleanProp: {
              type: "boolean",
              title: "I'm a boolean",
              description: "This description is used as a help message.",
            },
            booleanSwitchProp: {
              type: "boolean",
              title: "I'm a boolean with switch display",
              "x-display": "switch",
              description: "This description is used as a help message.",
            },
            stringArrayProp: {
              type: "array",
              title: "I'm an array of strings",
              items: {
                type: "string",
              },
            },
            integerArrayProp: {
              type: "array",
              title: "I'm an array of integers",
              items: {
                type: "integer",
              },
            },
          },
        },
      },
    },
  },
  getters: {

    [ALL_FORMS]: (state) => state.forms,

    [GET_FORM]: (state) => (id) => {
      return state.forms[id];
    },
  },
  actions: {

    createForm({ commit }, { workspaceId, form }) {
      const newForm = createForm(workspaceId, form);
      commit("addForm", { workspaceId: workspaceId, form: newForm });
    },

    [SET_FORM_GRID]: ({ commit }, { formId, grid }) => {
      commit(SET_FORM_GRID, { formId, grid })
    },

    [SET_FORM_SCHEMA]: ({ commit }, { formId, schema }) => {
      commit(SET_FORM_SCHEMA, { formId, schema })
    }

  },
  mutations: {

    // Form Builder Mutations
    [SET_FORM_SCHEMA](state, { formId, schema }) {
      // state.workspaces[workspaceId].forms[
      //   formId
      // ].formDefinition.schema = schema;
      let form = state.forms[formId]
      form.formDefinition.schema = schema;
    },
    [SET_FORM_GRID](state, { formId, grid }) {
      let form = state.forms[formId]
      form.formDefinition.grid = grid
    },
    addForm(state, { workspaceId, form }) {
      state.workspaces[workspaceId].forms.push(form);
    },
  },
}
