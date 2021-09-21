import { GET_NAVIGATION, SET_NAVIGATION, SET_USER_META } from '../types-user'
import Vue from 'vue'

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
  actions: {
    /**
     * Store the sub-navigation for each section, ie: which dashboard we were last looking at in the dashboard-builder
     * @param commit
     * @param key
     * @param id
     */
    [SET_NAVIGATION]: ({ commit }, { key, id }) => {
      commit(SET_NAVIGATION, { key, id })
    },

    /**
     * This is where the init() call to API stores it's data
     *
     * @param commit
     * @param userMeta
     */
    [SET_USER_META]: ({ commit }, userMeta) => {
      commit(SET_USER_META, userMeta)
    }
  },
  mutations: {
    [SET_NAVIGATION]: (state, { key, id }) => {
      Vue.set(state.navigation, key, id)
    },
    [SET_USER_META]: (state, userMeta) => {
      Vue.set(state, 'userMeta', userMeta)
    }
  },
  getters: {
    [GET_NAVIGATION]: state => state.navigation
  }
}
