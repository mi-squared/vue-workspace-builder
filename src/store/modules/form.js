import { createForm, getFormById, updateForm } from '../../api'
import Vue from 'vue'
import {
  ALL_FORMS,
  CREATE_FORM, FETCH_FORM,
  GET_FORM,
  SET_FORM,
  SET_FORM_GRID,
  SET_FORM_SCHEMA, VUEX_SET_FORM
} from '../types-form'

export const form = {
  namespaced: true,
  state: {
    forms: {},
  },
  getters: {

    [ALL_FORMS]: (state) => state.forms,

    [GET_FORM]: (state) => (id) => {
      return state.forms[id];
    },

  },
  actions: {

    [CREATE_FORM]({ dispatch, commit, rootGetters }, { workspaceId, form }) {

      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']
      createForm({ workspaceId, form }, userMeta).then(newForm => {
        // Set the form using vuex mutation
        commit(SET_FORM, { formId: newForm.id, form: newForm });

        // Dispatch to workspace module to add this form to workspace
        dispatch('workspace/ADD_FORM_TO_WORKSPACE', { workspaceId, formId: newForm.id}, { root: true })
      })

    },

    [FETCH_FORM] ({ commit, rootGetters }, { formId }) {
      console.log("Fetching Form: " + formId)
      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        getFormById(formId, userMeta).then(form => {
          if (form != null) {
            commit(SET_FORM, { formId: form.id, form })
          } else {
            console.log("Error: form with id `" + formId + "` was not found")
          }
        })
      }
    },

    [SET_FORM_GRID]: ({ commit }, { formId, grid }) => {
      commit(SET_FORM_GRID, { formId, grid })
    },

    [SET_FORM_SCHEMA]: ({ commit }, { formId, schema }) => {
      commit(SET_FORM_SCHEMA, { formId, schema })
    },

    [SET_FORM] ({ commit, rootGetters }, { formId, form }) {

      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']
      updateForm(form, userMeta).then(form => {
        commit(SET_FORM, { formId, form })
        return form
      })
    },

    [VUEX_SET_FORM] ({ commit }, { formId, form }) {
      commit(SET_FORM, { formId, form })
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

    [SET_FORM] (state, { formId, form }) {
      Vue.set(state.forms, formId, form)
    },
  },
}
