import { GET_NAVIGATION, SET_NAVIGATION } from '../types-user'
import Vue from 'vue'

export const user = {
  namespaced: true,
  state: {
    metaData: {},
    navigation: {
      workspace: null,
      dashboard: null,
      form: null
    }
  },
  mutations: {
    [SET_NAVIGATION] (state, { key, id }) {
      Vue.set(state.navigation, key, id)
    },
  },
  actions: {
    [SET_NAVIGATION] ({ commit }, { key, id }) {
      commit(SET_NAVIGATION, key, id)
    }
  },
  getters: {
    [GET_NAVIGATION]: state => state.navigation
  }
}
