import { createForm } from '../../api'
import Vue from 'vue'
import {
  ALL_FORMS,
  CREATE_FORM,
  GET_FORM,
  SET_FORM,
  SET_FORM_GRID,
  SET_FORM_SCHEMA
} from '../types-form'

export const form = {
  namespaced: true,
  state: {
    forms: {
      100: {
        id: 100,
        title: "Dashboard Create Form",
        // JSON Schema definition utilizing the format required by this library:
        // https://koumoul-dev.github.io/vuetify-jsonschema-form/latest/getting-started
        grid: [],
        // Global Options
        options: {
          timePickerProps: {
            format: "24h",
          },
        },
        properties: {
          // id: {
          //   type: "integer",
          //   title: "ID",
          //   description: "Unique ID",
          //   readOnly: true,
          // },
          // created_date: {
          //   type: "string",
          //   title: "Created Date",
          //   format: "date-time",
          //   description: "This description is used as a help message.",
          //   readOnly: true,
          // },
          // created_by: {
          //   type: "integer",
          //   title: "Created By",
          //   "x-fromData": "context.users",
          //   "x-itemKey": "val",
          //   "x-itemTitle": "label",
          //   description: "This description is used as a help message.",
          //   readOnly: true,
          // },
          // updated_by: {
          //   type: "integer",
          //   title: "Updated By",
          //   "x-fromData": "context.users",
          //   "x-itemKey": "val",
          //   "x-itemTitle": "label",
          //   description: "This description is used as a help message.",
          //   readOnly: true,
          // },
          // source: {
          //   type: "string",
          //   title: "Source",
          //   description: "Source",
          //   readOnly: true,
          // }
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

    [CREATE_FORM]({ dispatch, commit }, { workspaceId, form }) {
      const newForm = createForm(workspaceId, form);
      commit(CREATE_FORM, { formId: newForm.id, form: newForm });

      // Dispatch to workspace module to add this form to workspace
      dispatch('workspace/ADD_FORM_TO_WORKSPACE', { workspaceId, formId: newForm.id}, { root: true })
    },

    [SET_FORM_GRID]: ({ commit }, { formId, grid }) => {
      commit(SET_FORM_GRID, { formId, grid })
    },

    [SET_FORM_SCHEMA]: ({ commit }, { formId, schema }) => {
      commit(SET_FORM_SCHEMA, { formId, schema })
    },

    [SET_FORM] ({ commit }, { formId, form }) {
      return new Promise((resolve) => {
        commit(SET_FORM, { formId, form })
        resolve(form)
      })
    },

  },
  mutations: {

    // Form Builder Mutations
    [SET_FORM_SCHEMA](state, { formId, schema }) {
      let form = state.forms[formId]
      form.schema = schema
    },
    [SET_FORM_GRID](state, { formId, grid }) {
      let form = state.forms[formId]
      Vue.set(form, 'grid', grid)
    },
    [CREATE_FORM]: (state, { formId, form }) => {
      Vue.set(state.forms, formId, form)
    },

    [SET_FORM] (state, { formId, form }) {
      Vue.set(state.forms, formId, form)
    },
  },
}
