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
import { createDashboard } from '../../api'

export const dashboard = {
  namespaced: true,
  state: {
    dashboards: {
      "1": {
        "id": 1,
        "title": "Triage Dashboard",
        "newEntityFormId": null,
        "displayDuration": true,
        "durationModel": {
          "ranges": [
            {
              "order": 0,
              "range": [0, 30],
              "color": "#EC8116FF"
            },
            {
              "order": 1,
              "range": [31, 60],
              "color": "#338116FF"
            }
          ],
          "outOfRangeColor": "grey",
          "units": "minutes"
        },
        "displayNewButton": false,
        "filters": {
          "1200": 1200,
          "1201": 1201
        },
        "headers": [
          {
            "text": "Added",
            "value": "moved_to_dashboard_date"
          },
          {
            "text": "First Name",
            "align": "start",
            "value": "firstName"
          },
          {
            "text": "Last Name",
            "align": "start",
            "value": "lastName"
          },
          { "text": "DOB", "value": "DOB" },
          { "text": "Facility", "value": "facility" },
          { "text": "Status", "value": "status" },
          { "text": "Completion (%)", "value": "completion" },
          { "text": "", "value": "data-table-expand", "groupable": false },
          { "text": "", "value": "data-menu", "groupable": false, "sortable": false }
        ]
      }
    },
    rows: {
      10: [
        {
          id: 1,
          moved_to_dashboard_date: '2021-09-24 19:30:00',
          firstName: 'Frozen Yogurt',
          lastName: 'Smith',
          DOB: '11/21/1991', //: 6.0,
          facility: 'Jail',
          status: 24,
          completion: '1%',
        },
        {
          id: 2,
          moved_to_dashboard_date: '2021-09-24 19:30:00',
          firstName: 'Ice cream sandwich',
          lastName: 'Smith',
          DOB: '11/21/1991', //: 9.0,
          facility: 'Jail',
          status: 37,
          completion: '1%',
        },
        {
          id: 3,
          moved_to_dashboard_date: '2021-09-24 19:30:00',
          firstName: 'Eclair',
          lastName: 'Smith',
          DOB: '11/21/1991', //: 16.0,
          facility: 'Jail',
          status: 23,
          completion: '7%',
        },
        {
          id: 4,
          moved_to_dashboard_date: '2021-09-24 19:30:00',
          firstName: 'Cupcake',
          lastName: 'Smith',
          DOB: '11/21/1991', //: 3.7,
          facility: 'Hospital',
          status: 67,
          completion: '8%',
        },
        {
          id: 5,
          moved_to_dashboard_date: '2021-09-24 19:30:00',
          firstName: 'Gingerbread',
          lastName: 'Smith',
          DOB: '11/21/1991', //: 16.0,
          facility: 'Jail',
          status: 49,
          completion: '16%',
        },
        {
          id: 6,
          moved_to_dashboard_date: '2021-09-24 18:30:00',
          firstName: 'Jelly bean',
          lastName: 'Jones',
          DOB: '11/21/1991', //: 0.0,
          facility: 'Hospital',
          status: 94,
          completion: '0%',
        },
        {
          id: 7,
          moved_to_dashboard_date: '2021-09-24 19:30:00',
          firstName: 'Lollipop',
          lastName: 'Smith',
          DOB: '11/21/1991', //: 0.2,
          facility: 'Jail',
          status: 98,
          completion: '2%',
        },
        {
          id: 8,
          moved_to_dashboard_date: '2021-09-24 19:30:00',
          firstName: 'Honeycomb',
          lastName: 'Smith',
          DOB: '11/21/1991', //: 3.2,
          facility: 'Jail',
          status: 87,
          completion: '45%',
        },
        {
          id: 9,
          moved_to_dashboard_date: '2021-09-24 19:30:00',
          firstName: 'Donut',
          lastName: 'Smith',
          DOB: '11/21/1991', //: 25.0,
          facility: 'Hospital',
          status: 51,
          completion: '22%',
        },
        {
          id: 10,
          moved_to_dashboard_date: '2021-09-24 19:30:00',
          firstName: 'KitKat',
          lastName: 'Smith',
          DOB: '11/21/1991', //: 26.0,
          facility: 'Jail',
          status: 65,
          completion: '6%',
        },
      ],
      11: [],
      12: []
    }
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
      createDashboard(dashboard, userMeta).then(newDashboard => {
        // Create the dashboard, the rows, and add the dashboard ID to the workspace
        commit(SET_DASHBOARD, { dashboardId: newDashboard.id, dashboard: newDashboard });

        // Dispatch to workspace module to add this form to workspace
        dispatch('workspace/ADD_DASHBOARD_TO_WORKSPACE', { workspaceId, dashboardId: newDashboard.id}, { root: true })
      })
    },

    [SET_DASHBOARD] ({ commit }, { dashboardId, dashboard }) {
      // Make a POST to server, then update VUEX
      return new Promise((resolve) => {
        commit(SET_DASHBOARD, { dashboardId, dashboard })
        resolve(dashboard)
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
