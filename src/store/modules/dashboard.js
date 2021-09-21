import { ALL_DASHBOARDS, GET_DASHBOARD, SET_DASHBOARD } from '../types-dashboard'
import axios from 'axios'
import Vue from 'vue'

export const dashboard = {
  namespaced: true,
  state: {
    dashboards: {
      10: {
        id: 10,
        title: 'Triage Dashboard',
        newEntityFormId: null,
        displayDuration: true,
        displayNewButton: false,
        filters: {
          1200: 1200,
          1201: 1201
        },
        headers: [
          {
            text: 'Created',
            value: 'timestamp'
          },
          {
            text: 'First Name',
            align: 'start',
            value: 'firstName',
          },
          {
            text: 'Last Name',
            align: 'start',
            value: 'lastName',
          },
          { text: 'DOB', value: 'DOB' },
          { text: 'Facility', value: 'facility' },
          { text: 'Status', value: 'status' },
          { text: 'Completion (%)', value: 'completion' },
          { text: '', value: 'data-table-expand', groupable: false },
          { text: '', value: 'data-menu', groupable: false, sortable: false },
        ],
        rows: [
          {
            id: 1,
            timestamp: '1622164951',
            firstName: 'Frozen Yogurt',
            lastName: 'Smith',
            DOB: '11/21/1991', //: 6.0,
            facility: 'Jail',
            status: 24,
            completion: '1%',
          },
          {
            id: 2,
            timestamp: '1622161351',
            firstName: 'Ice cream sandwich',
            lastName: 'Smith',
            DOB: '11/21/1991', //: 9.0,
            facility: 'Jail',
            status: 37,
            completion: '1%',
          },
          {
            id: 3,
            timestamp: '1622132551',
            firstName: 'Eclair',
            lastName: 'Smith',
            DOB: '11/21/1991', //: 16.0,
            facility: 'Jail',
            status: 23,
            completion: '7%',
          },
          {
            id: 4,
            timestamp: '1622164951',
            firstName: 'Cupcake',
            lastName: 'Smith',
            DOB: '11/21/1991', //: 3.7,
            facility: 'Hospital',
            status: 67,
            completion: '8%',
          },
          {
            id: 5,
            timestamp: '1619540551',
            firstName: 'Gingerbread',
            lastName: 'Smith',
            DOB: '11/21/1991', //: 16.0,
            facility: 'Jail',
            status: 49,
            completion: '16%',
          },
          {
            id: 6,
            timestamp: '1622164951',
            firstName: 'Jelly bean',
            lastName: 'Jones',
            DOB: '11/21/1991', //: 0.0,
            facility: 'Hospital',
            status: 94,
            completion: '0%',
          },
          {
            id: 7,
            timestamp: '1622164951',
            firstName: 'Lollipop',
            lastName: 'Smith',
            DOB: '11/21/1991', //: 0.2,
            facility: 'Jail',
            status: 98,
            completion: '2%',
          },
          {
            id: 8,
            timestamp: '1622164951',
            firstName: 'Honeycomb',
            lastName: 'Smith',
            DOB: '11/21/1991', //: 3.2,
            facility: 'Jail',
            status: 87,
            completion: '45%',
          },
          {
            id: 9,
            timestamp: '1622164951',
            firstName: 'Donut',
            lastName: 'Smith',
            DOB: '11/21/1991', //: 25.0,
            facility: 'Hospital',
            status: 51,
            completion: '22%',
          },
          {
            id: 10,
            timestamp: '1622164951',
            firstName: 'KitKat',
            lastName: 'Smith',
            DOB: '11/21/1991', //: 26.0,
            facility: 'Jail',
            status: 65,
            completion: '6%',
          },
        ]
      },
      11: {
        id: 11,
        title: 'Dispatch Dashboard',
        displayDuration: true,
        displayNewButton: false,
        filters: [],
        headers: [],
        rows: []
      },
      12: {
        id: 12,
        title: 'Whiteboard',
        displayDuration: true,
        displayNewButton: false,
        filters: [],
        headers: [],
        rows: []
      },

    },
  },
  mutations: {

    // Dashboard Builder Mutations
    [SET_DASHBOARD] (state, { dashboardId, dashboard }) {
      const vuexDashbaord = state.dashboards[dashboardId]
      Vue.set(vuexDashbaord, 'title', dashboard.title)
      Vue.set(vuexDashbaord, 'filters', dashboard.filters)
      Vue.set(vuexDashbaord, 'headers', dashboard.headers)
    },
  },
  actions: {

    // createDashboard({ commit }, { workspaceId, dashboardId, dashboard }) {
    //
    // },
    [SET_DASHBOARD] ({ commit }, { dashboardId, dashboard }) {
      // Make a POST to server, then update VUEX
      commit(SET_DASHBOARD, { dashboardId, dashboard })
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
    fetchDashboard ({ state, commit, rootState }, { dashboardId }) {
      console.log(dashboardId)
      if (rootState.metaData.csrfToken) {
        return new Promise((resolve) => {
          axios.get('/apis/api/dashboard', {
            // params: {
            //     id: dashboardId
            // },
            headers: {
              'apicsrftoken': rootState.metaData.csrfToken
            }
          }).then(function (response) {
            const dashboard = response.data
            commit(SET_DASHBOARD, dashboard)
            resolve(state.dashboards[dashboardId])
          }).catch(function () {
            alert('there was an error, you may need to log back in')
          })
        })
      }
    },
    // fetchDashboardRow ({ state, commit }, { dashboardId, rowId }) {
    // TODO
    // },
    fetchAllDashboardRows () {

    }
  },
  getters: {
    [ALL_DASHBOARDS]: state => state.dashboards,

    [GET_DASHBOARD]: state => id => { return state.dashboards[id] },
    /**
     * DASHBOARD
     */
    dashboardLists: state => {
      return state.dashboard.lists
    },
    dashboardHeaders: state => {
      return state.dashboard.headers
    },
    dashboardRows: state => {
      return state.dashboard.rows
    },
  }
}