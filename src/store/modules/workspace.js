import {
  ADD_DASHBOARD_TO_WORKSPACE,
  ADD_FORM_TO_WORKSPACE, ALL_WORKSPACES,
  CREATE_DATA_SOURCE_COLUMN, CREATE_WORKSPACE, FETCH_ALL_WORKSPACES, FETCH_WORKSPACE, GET_DASHBOARDS,
  GET_DATA_SOURCE, GET_DATA_TYPES, GET_FORMS, GET_SCHEMA_TEMPLATE_BY_TYPE, GET_SETTINGS,
  GET_WORKSPACE, PUSH_WORKSPACE,
  SET_WORKSPACE
} from '../types-workspace'
import Vue from "vue";
// import axios from 'axios'
import { createDataSourceColumn, createWorkspace } from '../../api'
import axios from 'axios'

export const workspace = {
  namespaced: true,
  state: {
    settings: {
      test: false
    },
    dataTypes: {
      "list": {
        mysql: "VARCHAR(255)",
        formSchemaTemplate: {
          type: "string",
          "x-display": "autocomplete"
        },
      },
      "user": {
        mysql: "BIGINT",
        formSchemaTemplate: {
          type: "integer",
          "x-display": "custom-user",
          "x-fromData": "context.users",
          "x-itemKey": "val",
          "x-itemTitle": "label",
        },
      },
      "patient": {
        mysql: "BIGINT",
        formSchemaTemplate: {
          type: "integer",
          "x-display": "custom-patient",
          "x-fromData": "context.patient",
          "x-itemKey": "val",
          "x-itemTitle": "label",
        },
        dashboardFields: {
          "fname": {

          },
          "lname": {

          },
          "DOB": {

          }
        },
        customFilters: {
          isHighUtilizer: {
            title: 'High Utilizer'
          }
        }
      },
      "string": {
        mysql: "VARCHAR(255)",
        formSchemaTemplate: {
          type: "string",
          title: "I'm a string",
          format: "string",
        },
      },
      "text": {
        mysql: "LONGTEXT",
        formSchemaTemplate: {
          type: "string",
          title: "I'm a string in a textarea",
          "x-display": "textarea"
        },
      },
      "integer": {
        mysql: "BIGINT",
        formSchemaTemplate: {
          type: "integer",
        },
      },
      "boolean": {
        mysql: "BOOLEAN",
        formSchemaTemplate: {
          type: "boolean",
          title: "I'm a boolean",
          "x-display": "switch",
          description: "This description is used as a help message."
        },
      },
      "date": {
        mysql: "DATE",
        formSchemaTemplate: {
          type: "string",
          format: "date",
        },
      },
      "datetime": {
        mysql: "DATETIME",
        formSchemaTemplate: {
          type: "string",
          format: "date-time",
        },
      },

    },
    workspaces: {}
  },
  getters: {
    [GET_SETTINGS]: state => state.settings,

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
        return new Promise((resolve) => {
          axios.get('/apis/api/workspaces', {
            headers: {
              'apicsrftoken': userMeta.csrfToken
            }
          }).then(function (response) {
            // Set all the workspaces that we get in the response
            const workspaces = response.data
            workspaces.forEach(workspace => {
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
            resolve(workspaces)
          }).catch(function () {
            alert('there was an error, you may need to log back in')
          })
        })
      } else {
        alert("You have been logged out due to a period of inactivity, please log in gain.")
      }
    },

    [FETCH_WORKSPACE] ({ commit, rootGetters }, { workspaceId }) {
      console.log("Fetching Workspace: " + workspaceId)
      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        return new Promise((resolve) => {
          axios.get('/apis/api/workspace', {
            params: {
              id: workspaceId
            },
            headers: {
              'apicsrftoken': userMeta.csrfToken
            }
          }).then(function (response) {
            const workspace = response.data
            commit(SET_WORKSPACE, { workspaceId: workspace.id, workspace: workspace })
            resolve(workspace)
          }).catch(function () {
            alert('there was an error, you may need to log back in')
          })
        })
      }
    },

    [PUSH_WORKSPACE] ({ rootGetters }, { workspaceId, workspace }) {
      console.log("Pushing Workspace: " + workspaceId)
      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        return new Promise((resolve) => {
          axios.put('/apis/api/workspace', {
            params: {
              id: workspaceId,
              workspace: workspace
            }
          },
            {
          headers: {
            'apicsrftoken': userMeta.csrfToken,
            'Content-Type': 'application/json;charset=utf-8'
          }
        }
          ).then(function (response) {
            const workspace = response.data
            // Setting workspace mutation happens in set action
            // commit(SET_WORKSPACE, { workspaceId: workspace.id, workspace: workspace })
            resolve(workspace)
          }).catch(function () {
            alert('there was an error, you may need to log back in')
          })
        })
      }
    },

    [CREATE_WORKSPACE] ({ dispatch, commit, rootGetters }, { title, administrator }) {
      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        let newWorkspace = createWorkspace({ title, administrator })

        return new Promise((resolve) => {
          axios.post('/apis/api/workspace', {
              params: {
                workspace: newWorkspace
              }
            },
            {
              headers: {
                'apicsrftoken': userMeta.csrfToken,
                'Content-Type': 'application/json;charset=utf-8'
              }
            }).then(function (response) {
              const workspace = response.data
              commit(SET_WORKSPACE, { workspaceId: workspace.id, workspace: workspace })

              // Tell VUEX to create a new navigation item for this workspace to store navigation state
              dispatch('user/ADD_WORKSPACE_TO_NAVIGATION', { workspaceId: workspace.id }, { root: true })

              resolve(workspace)
            }).catch(function () {
              alert('there was an error, you may need to log back in')
            })
        })
      }
    },

    // [SET_WORKSPACE] ({ state, commit, rootState }, { workspaceId }) {
    //   console.log(workspaceId);
    //   if (rootState.metaData.csrfToken) {
    //     return new Promise((resolve) => {
    //       axios.get("/apis/api/workspace", {
    //         // params: {
    //         //     id: dashboardId
    //         // },
    //         headers: {
    //           apicsrftoken: rootState.metaData.csrfToken,
    //         },
    //       })
    //         .then(function (response) {
    //           const workspace = response.data;
    //           commit(SET_WORKSPACE, workspace);
    //           resolve(state.workspace[workspaceId]);
    //         })
    //         .catch(function () {
    //           alert("there was an error, you may need to log back in");
    //         });
    //     });
    //   }
    // },

    [CREATE_DATA_SOURCE_COLUMN]: ({ commit, dispatch, getters, rootGetters }, { userId, workspaceId, column }) => {
      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']

      if (userId === null) {
        console.log('Error: userId not set')
      }

      createDataSourceColumn(userId, workspaceId, column, userMeta).then(({ workspaceId, column }) => {
        let workspace = getters.GET_WORKSPACE(workspaceId)
        workspace.dataSource.spec.columns[column.name] = column
        // Then commit mutation
        dispatch(PUSH_WORKSPACE, { workspaceId, workspace }).then(workspace => {
          commit(SET_WORKSPACE, { workspaceId, workspace })
        })
      })
    },

    [ADD_DASHBOARD_TO_WORKSPACE]: ({ commit, dispatch, getters }, { workspaceId, dashboardId }) => {
      let workspace = getters.GET_WORKSPACE(workspaceId)
      workspace.dashboards[dashboardId] = dashboardId
      dispatch(PUSH_WORKSPACE, { workspaceId, workspace }).then(workspace => {
        commit(SET_WORKSPACE, { workspaceId, workspace })
      })
    },

    [ADD_FORM_TO_WORKSPACE]: ({ commit, dispatch, getters }, { workspaceId, formId }) => {
      let workspace = getters.GET_WORKSPACE(workspaceId)
      workspace.forms[formId] = formId
      dispatch(PUSH_WORKSPACE, { workspaceId, workspace }).then(workspace => {
        commit(SET_WORKSPACE, { workspaceId, workspace })
      })
    },

    [SET_WORKSPACE] ({ dispatch, commit }, { workspaceId, workspace }) {
      // Make a POST to server, then update VUEX
      dispatch(PUSH_WORKSPACE, { workspaceId, workspace }).then((workspace) => {
        commit(SET_WORKSPACE, { workspaceId, workspace })
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
