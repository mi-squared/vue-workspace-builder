import {
  INIT,
  GET_NAVIGATION,
  SET_NAVIGATION,
  SET_USER_META,
  GET_USER_META,
  ADD_WORKSPACE_TO_NAVIGATION,
  SET_WORKSPACE
} from '../types-user'
import Vue from 'vue'
import { ws_init } from '../../api'

export const user = {
  namespaced: true,
  state: {
    userMeta: {},
    navigation: {
      workspace: 1,
      workspaces: {
        1: {
          dashboard: null,
          form: null
        }
      }
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
        // Call the ws_init api which starts our user session on the server
        // and returns a promise. In the promise then() handler, we commit our user state
        ws_init().then((response) => {
          // If this returns "Site ID is missing from session data!" then we're logged out
          // TODO handle this case when logged out
          console.log("Init complete")
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
     * @param workspaceId
     * @param key
     * @param id
     */
    [SET_NAVIGATION]: ({ commit }, { workspaceId, key, id }) => {
      commit(SET_NAVIGATION, { workspaceId, key, id })
    },

    [ADD_WORKSPACE_TO_NAVIGATION]: ({ commit }, { workspaceId }) => {
      // Since this is a new navigation item, initialize the pages to null
      const item = { dashboard: null, form: null }
      commit(ADD_WORKSPACE_TO_NAVIGATION, { workspaceId, item })
    },

    [SET_WORKSPACE]: ({ commit }, { workspaceId }) => {
      // Since this is a new navigation item, initialize the pages to null
      commit(SET_WORKSPACE, { workspaceId })
    },

  },
  mutations: {
    [SET_NAVIGATION]: (state, { workspaceId, key, id }) => {
      Vue.set(state.navigation.workspaces[workspaceId], key, id)
    },
    [SET_USER_META]: (state, userMeta) => {
      Vue.set(state, 'userMeta', userMeta)
    },
    [ADD_WORKSPACE_TO_NAVIGATION]: (state, { workspaceId, item }) => {
      Vue.set(state.navigation.workspaces, workspaceId, item )
    },
    [SET_WORKSPACE]: (state, { workspaceId }) => {
      Vue.set(state.navigation, 'workspace', workspaceId )
    }
  },
}
