import {
  ALL_DASHBOARDS,
  CREATE_DASHBOARD,
  FETCH_DASHBOARD, FETCH_DASHBOARD_ROWS,
  GET_DASHBOARD,
  GET_DASHBOARD_ROWS,
  SET_DASHBOARD, SET_DASHBOARD_ROWS
} from '../types-dashboard'
import axios from 'axios'
import Vue from 'vue'
import { createDashboard, updateDashboard } from '../../api'

export const dashboard = {
  namespaced: true,
  state: {
    dashboards: {},
    rows: {}
  },
  getters: {
    [ALL_DASHBOARDS]: state => state.dashboards,

    [GET_DASHBOARD]: state => id => {
      return state.dashboards[id]
    },

    [GET_DASHBOARD_ROWS]: state => id => {
      return state.rows[id]
    },

  },
  actions: {

    [CREATE_DASHBOARD]({ dispatch, commit, rootGetters }, { workspaceId, dashboard }) {

      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']
      createDashboard({ workspaceId, dashboard }, userMeta).then(newDashboard => {
        // Create the dashboard, the rows, and add the dashboard ID to the workspace
        commit(SET_DASHBOARD, { dashboardId: newDashboard.id, dashboard: newDashboard });

        // Dispatch to workspace module to add this form to workspace
        dispatch('workspace/ADD_DASHBOARD_TO_WORKSPACE', { workspaceId, dashboardId: newDashboard.id}, { root: true })
      })
    },

    [SET_DASHBOARD] ({ commit, rootGetters }, { dashboardId, dashboard }) {
      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']
      // Make a POST to server, then update VUEX
      updateDashboard(dashboard, userMeta).then(dashboard => {
        commit(SET_DASHBOARD, { dashboardId, dashboard })
        return dashboard
      })
    },

    /**
     *
     * Fetch a dashboard from the server given a dashboard ID and commit it to the state
     *
     * @param state
     * @param commit
     * @param rootState
     * @param dashboardId
     * @returns {Promise<unknown>}
     */
    [FETCH_DASHBOARD] ({ commit, rootGetters }, { dashboardId }) {
      console.log("Fetching Dashboard: " + dashboardId)
      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        return new Promise((resolve) => {
          axios.get('/apis/api/dashboard', {
            params: {
                id: dashboardId
            },
            headers: {
              'apicsrftoken': userMeta.csrfToken
            }
          }).then(function (response) {
            const dashboard = response.data
            commit(SET_DASHBOARD, { dashboardId: dashboard.id, dashboard })
            resolve(dashboard)
          }).catch(function () {
            alert('there was an error, you may need to log back in')
          })
        })
      }
    },

    [FETCH_DASHBOARD_ROWS] ({ state, commit, rootGetters }, { dashboardId }) {
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        return new Promise((resolve) => {
          axios.get('/apis/api/dashboardrows', {
            params: {
              id: dashboardId
            },
            headers: {
              'apicsrftoken': userMeta.csrfToken
            }
          }).then(function (response) {
            const rows = response.data
            commit(SET_DASHBOARD_ROWS, { dashboardId: dashboardId, rows })
            resolve(state.rows[dashboardId])
          }).catch(function () {
            alert('there was an error, you may need to log back in')
          })
        })
      }
    },
    // fetchDashboardRow ({ state, commit }, { dashboardId, rowId }) {
    // TODO
    // },
  },
  mutations: {

    // Dashboard Builder Mutations
    [SET_DASHBOARD] (state, { dashboardId, dashboard }) {
      Vue.set(state.dashboards, dashboardId, dashboard)
    },

    [SET_DASHBOARD_ROWS] (state, { dashboardId, rows }) {
      Vue.set(state.rows, dashboardId, rows)
    }
  },

}
