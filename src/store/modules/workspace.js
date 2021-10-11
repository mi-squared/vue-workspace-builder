import {
  ADD_DASHBOARD_TO_WORKSPACE,
  ADD_FORM_TO_WORKSPACE, ALL_WORKSPACES,
  CREATE_DATA_SOURCE_COLUMN, CREATE_WORKSPACE, FETCH_ALL_WORKSPACES, FETCH_DATA_TYPES, FETCH_WORKSPACE, GET_DASHBOARDS,
  GET_DATA_SOURCE, GET_DATA_TYPES, GET_FORMS, GET_SCHEMA_TEMPLATE_BY_TYPE,
  GET_WORKSPACE, SET_DATA_TYPES,
  SET_WORKSPACE
} from '../types-workspace'
import Vue from "vue";
import {
  createDataSourceColumn,
  createWorkspace,
  fetchAllWorkspaces,
  fetchDataTypes,
  fetchWorkspace,
  pushWorkspace
} from '../../api'

export const workspace = {
  namespaced: true,
  state: {
    dataTypes: {},
    workspaces: {},
    patients: {}
  },
  getters: {

    [ALL_WORKSPACES]: state => state.workspaces,

    [GET_WORKSPACE]: state => id => {
      return state.workspaces[id]
    },

    [GET_DATA_SOURCE]: state => id => state.workspaces[id].dataSource,

    [GET_DASHBOARDS]: (state, getters, rootState, rootGetters) => workspaceId => {
      let dashboards = []
      Object.keys(state.workspaces[workspaceId].dashboards).forEach(dashboardId => {
        const dashboard = rootGetters['dashboard/GET_DASHBOARD'](dashboardId)
        dashboards.push(dashboard)
      })
      return dashboards
    },

    [GET_FORMS]: (state, getters, rootState, rootGetters) => workspaceId => {
      let forms = []
      Object.keys(state.workspaces[workspaceId].forms).forEach(formId => {
        forms.push(rootGetters['form/GET_FORM'](formId))
      })
      return forms
    },

    [GET_DATA_TYPES]: state => state.dataTypes,

    [GET_SCHEMA_TEMPLATE_BY_TYPE]: (state) => (type) => {
      return state.dataTypes[type.toLowerCase()].formSchemaTemplate
    },
  },
  actions: {

    [FETCH_ALL_WORKSPACES] ({ dispatch, commit, rootGetters }) {
      console.log("Fetching All Workspaces:")
      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        // Don't return the promise that is created in the api,
        // we need to wait until all of the dashboards and forms are loaded into vuex,
        // then we can resolve.
        return new Promise(resolve => {

          // Fetch all lists (for building dashboards and forms that contain list types)
          dispatch('list/FETCH_ALL_LISTS', {}, { root: true })

          // We bypass the action, and just call API directly. We are only doing this at builder init-time
          // at least for now
          fetchDataTypes(userMeta).then(dataTypes => {
            commit(SET_DATA_TYPES, { dataTypes })
          })

          fetchAllWorkspaces(userMeta).then(workspaces => {
              // Set all the workspaces that we get in the response
              Object.values(workspaces).forEach(workspace => {

                commit(SET_WORKSPACE, { workspaceId: workspace.id, workspace: workspace })

                // Tell VUEX to create a new navigation item for this workspace to store navigation state
                dispatch('user/ADD_WORKSPACE_TO_NAVIGATION', { workspaceId: workspace.id }, { root: true })

                // Iterate over all dashboard IDs and fetch the dashboards TODO this could be done in a bulk API
                Object.values(workspace.dashboards).forEach(dashboardId => {
                  dispatch('dashboard/FETCH_DASHBOARD', { dashboardId }, { root: true })
                })

                // Iterate over all form IDs and fetch the forms TODO this could be done in a bulk API
                Object.values(workspace.forms).forEach(formId => {
                  dispatch('form/FETCH_FORM', { formId }, { root: true })
                })
              })

              // Set the navigation with the first workspace as active
              if (workspaces.length > 0) {
                dispatch('user/SET_WORKSPACE', { workspaceId: workspaces[0].id }, { root: true })
              }

              resolve(workspaces)
            })
        })
      } else {
        alert("You have been logged out due to a period of inactivity, please log in gain.")
      }
    },

    [FETCH_DATA_TYPES]: ({ commit, rootGetters }) => {
      const userMeta = rootGetters['user/GET_USER_META']
      fetchDataTypes(userMeta).then(dataTypes => {
        commit(SET_DATA_TYPES, { dataTypes })
      })
    },

    [FETCH_WORKSPACE] ({ commit, rootGetters }, { workspaceId }) {
      console.log("Fetching Workspace: " + workspaceId)
      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        fetchWorkspace(workspaceId, userMeta).then(workspace => {
          commit(SET_WORKSPACE, { workspaceId: workspace.id, workspace: workspace })
        })
      }
    },

    [CREATE_WORKSPACE] ({ dispatch, commit, rootGetters }, { title, administrator }) {
      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        createWorkspace({ title, administrator }).then(workspace => {
          commit(SET_WORKSPACE, { workspaceId: workspace.id, workspace: workspace })

          // Tell VUEX to create a new navigation item for this workspace to store navigation state
          dispatch('user/ADD_WORKSPACE_TO_NAVIGATION', { workspaceId: workspace.id }, { root: true })
        })
      }
    },

    [CREATE_DATA_SOURCE_COLUMN]: ({ dispatch, getters, rootGetters }, { userId, workspaceId, column }) => {
      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']

      if (userId === null) {
        console.log('Error: userId not set')
      }

      createDataSourceColumn(userId, workspaceId, column, userMeta).then(({ workspaceId, column }) => {
        let workspace = getters.GET_WORKSPACE(workspaceId)
        workspace.dataSource.spec.columns[column.name] = column
        // Then commit mutation
        dispatch(SET_WORKSPACE, { workspaceId, workspace })
      })
    },

    [ADD_DASHBOARD_TO_WORKSPACE]: ({ commit, getters, rootGetters }, { workspaceId, dashboardId }) => {
      let workspace = getters.GET_WORKSPACE(workspaceId)
      workspace.dashboards[dashboardId] = dashboardId
      const userMeta = rootGetters['user/GET_USER_META']
      pushWorkspace(workspaceId, workspace, userMeta).then(workspace => {
        commit(SET_WORKSPACE, { workspaceId, workspace })
        return workspace
      })
    },

    [ADD_FORM_TO_WORKSPACE]: ({ commit, getters, rootGetters }, { workspaceId, formId }) => {
      let workspace = getters.GET_WORKSPACE(workspaceId)
      workspace.forms[formId] = formId
      const userMeta = rootGetters['user/GET_USER_META']
      pushWorkspace(workspaceId, workspace, userMeta).then(workspace => {
        commit(SET_WORKSPACE, { workspaceId, workspace })
        return workspace
      })
    },

    [SET_WORKSPACE] ({ commit, rootGetters }, { workspaceId, workspace }) {
      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']
      pushWorkspace(workspaceId, workspace, userMeta).then(workspace => {
        commit(SET_WORKSPACE, { workspaceId, workspace })
        return workspace
      })
    },

  },
  mutations: {

    [CREATE_DATA_SOURCE_COLUMN]: (state, { workspaceId, column }) => {
      // The column name is the index and the column is the model
      Vue.set(
        state.workspaces[workspaceId].dataSource.spec.columns,
        column.name,
        column
      )
    },

    [SET_WORKSPACE] (state, { workspaceId, workspace }) {
      Vue.set(state.workspaces, workspaceId, workspace)
    },

    [SET_DATA_TYPES] (state, { dataTypes }) {
      Vue.set(state, 'dataTypes', dataTypes)
    },

    /**
     * This is no longer used, because we set the whole workspace
     *
     * @param state
     * @param workspaceId
     * @param dashboardId
     */
    [ADD_DASHBOARD_TO_WORKSPACE]: (state, { workspaceId, dashboardId }) => {
      const vuexWorkspace = state.workspaces[workspaceId]
      Vue.set(vuexWorkspace.dashboards, dashboardId, dashboardId)
    },

    /**
     * Add a form to a workspace by adding the form's ID to the forms section.
     *
     * This is used by the forms module when a form is created, it needs to be added to the workspace.
     *
     * @param state
     * @param workspaceId
     * @param formId
     */
    [ADD_FORM_TO_WORKSPACE]: (state, { workspaceId, formId} ) => {
      const vuexWorkspace = state.workspaces[workspaceId]
      Vue.set(vuexWorkspace.forms, formId, formId)
    }

  },
}
