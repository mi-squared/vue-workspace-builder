import {
  ALL_DASHBOARDS,
  CREATE_DASHBOARD, CREATE_ENTITY,
  FETCH_DASHBOARD, FETCH_DASHBOARD_ROWS,
  GET_DASHBOARD,
  GET_DASHBOARD_ROWS,
  SET_DASHBOARD, SET_DASHBOARD_ROWS
} from '../types-dashboard'
import Vue from 'vue'
import { createDashboard, createEntity, fetchDashboardRows, getDashboardById, updateDashboard } from '../../api'

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

    [CREATE_ENTITY] ({ commit, rootGetters }, { workspaceId, dashboardId, entity }) {
      // Push a new entity and then update the dashboard rows
      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']
      createEntity(workspaceId, dashboardId, entity, userMeta).then(newEntity => {
        commit(CREATE_ENTITY, { dashboardId: newEntity.dashboard_id, entity: newEntity })
      })
    },

    // [PUSH_ENTITY] ({ dispatch, commit, rootGetters }, { workspaceId, entity }) {
    //   // Push an update to an entity and then update the dashboard rows
    //
    // },

    [CREATE_DASHBOARD]({ dispatch, commit, rootGetters }, { workspaceId, dashboard }) {

      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']
      createDashboard({ workspaceId, dashboard }, userMeta).then(newDashboard => {
        // Create the dashboard, the rows, and add the dashboard ID to the workspace
        commit(SET_DASHBOARD, { dashboardId: newDashboard.id, dashboard: newDashboard });

        // Dispatch to workspace module to add this dashboard to workspace
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
    [FETCH_DASHBOARD] ({ commit, dispatch, rootGetters }, { dashboardId }) {
      console.log("Fetching Dashboard: " + dashboardId)
      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {

        // Return the promise created by the API
        return getDashboardById(dashboardId, userMeta).then(dashboard => {

          // We also have to fetch the form identified as the "new entity form"
          dispatch('form/FETCH_FORM', { formId: dashboard.newEntityFormId }, { root: true })

          commit(SET_DASHBOARD, { dashboardId: dashboard.id, dashboard })
        })
      }
    },

    [FETCH_DASHBOARD_ROWS] ({ commit, rootGetters }, { dashboardId }) {
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        // Return the promise created by the API
        return fetchDashboardRows(dashboardId, userMeta).then(rows => {
          commit(SET_DASHBOARD_ROWS, { dashboardId: dashboardId, rows })
        }).catch(function () {
          alert('there was an error, you may need to log back in')
        })
      }
    },
    // fetchDashboardRow ({ state, commit }, { dashboardId, rowId }) {
    // TODO
    // },
  },
  mutations: {

    [CREATE_ENTITY] (state, { dashboardId, entity }) {
      if (state.rows[dashboardId] == undefined) {
        state.rows[dashboardId] = []
      }
      state.rows[dashboardId].push(entity)
    },

    // Dashboard Builder Mutations
    [SET_DASHBOARD] (state, { dashboardId, dashboard }) {
      Vue.set(state.dashboards, dashboardId, dashboard)
    },

    [SET_DASHBOARD_ROWS] (state, { dashboardId, rows }) {
      Vue.set(state.rows, dashboardId, rows)
    }
  },

}
