import { INIT, GET_NAVIGATION, SET_NAVIGATION, SET_USER_META, GET_USER_META } from '../types-user'
import Vue from 'vue'
import axios from 'axios'

export const user = {
  namespaced: true,
  state: {
    userMeta: {},
    navigation: {
      workspace: null,
      dashboard: null,
      form: null
    }
  },
  getters: {
    [GET_USER_META]: state => state.userMeta,
    [GET_NAVIGATION]: state => state.navigation
  },
  actions: {
    /**
     * This is the API init call that is required for subsequent calls to the API
     *
     * @param state
     * @param commit
     * @returns {Promise<unknown>}
     */
    [INIT]: ({ state, commit }) => {
      return new Promise((resolve) => {
        axios
          .get("/interface/modules/custom_modules/oe-workspace-server/init.php")
          .then(function(response) {
            // If this returns "Site ID is missing from session data!" then we're logged out
            // TODO handle this case when logged out
            const userMetaData = response.data
            commit(SET_USER_META, userMetaData)
            resolve(state.userMeta)
          })
      })
    },

    /**
     * This is where the init() call to API stores it's data
     *
     * @param commit
     * @param userMeta
     */
    [SET_USER_META]: ({ commit }, userMeta) => {
      commit(SET_USER_META, userMeta)
    },

    /**
     * Store the sub-navigation for each section, ie: which dashboard we were last looking at in the dashboard-builder
     * @param commit
     * @param key
     * @param id
     */
    [SET_NAVIGATION]: ({ commit }, { key, id }) => {
      commit(SET_NAVIGATION, { key, id })
    },
  },
  mutations: {
    [SET_NAVIGATION]: (state, { key, id }) => {
      Vue.set(state.navigation, key, id)
    },
    [SET_USER_META]: (state, userMeta) => {
      Vue.set(state, 'userMeta', userMeta)
    }
  },

}
