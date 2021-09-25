import {
  ADD_DASHBOARD_TO_WORKSPACE,
  ADD_FORM_TO_WORKSPACE, ALL_WORKSPACES,
  CREATE_DATA_SOURCE_COLUMN, CREATE_WORKSPACE, GET_DASHBOARDS,
  GET_DATA_SOURCE, GET_DATA_TYPES, GET_SCHEMA_TEMPLATE_BY_TYPE,
  GET_WORKSPACE,
  SET_WORKSPACE
} from '../types-workspace'
import Vue from "vue";
// import axios from 'axios'
import { createWorkspace } from '../../api'

export const workspace = {
  namespaced: true,
  state: {
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
    workspaces: {
      1: {
        id: 1,
        title: "CET",
        administrator: 1,
        dataSource: {
          spec: {
            columns: {
              id: {
                name: "id",
                type: "integer",
                default: "",
                comment: "",
                extra: {
                  createdBy: "system",
                  createdDate: "2021-06-20",
                },
                schema: {
                  type: "integer",
                  title: "ID",
                  description: "Unique ID",
                  readOnly: true,
                },
              },
              created_date: {
                name: "created_date",
                type: "datetime",
                default: "",
                comment: "",
                extra: {
                  createdBy: "system",
                  createdDate: "2021-06-20",
                },
                schema: {
                  type: "string",
                  title: "Created Date",
                  format: "date-time",
                  description: "This description is used as a help message.",
                  readOnly: true,
                },
              },
              created_by: {
                name: "created_by",
                type: "integer",
                default: "",
                comment: "refers to users.id",
                extra: {
                  createdBy: "system",
                  createdDate: "2021-06-20",
                },
                schema: {
                  type: "integer",
                  title: "Created By",
                  "x-fromData": "context.users",
                  "x-itemKey": "val",
                  "x-itemTitle": "label",
                  description: "This description is used as a help message.",
                  readOnly: true,
                },
              },
              updated_date: {
                name: "updated_date",
                type: "datetime",
                default: "",
                comment: "",
                extra: {
                  createdBy: "system",
                  createdDate: "2021-06-20",
                },
                schema: {
                  type: "string",
                  title: "Updated Date",
                  format: "date-time",
                  description: "This description is used as a help message.",
                  readOnly: true,
                },
              },
              updated_by: {
                name: "updated_by",
                type: "user",
                default: "",
                comment: "refers to users.id",
                extra: {
                  createdBy: "system",
                  createdDate: "2021-06-20",
                },
                schema: {
                  type: "integer",
                  title: "Updated By",
                  "x-fromData": "context.users",
                  "x-itemKey": "val",
                  "x-itemTitle": "label",
                  description: "This description is used as a help message.",
                  readOnly: true,
                },
              },
              source: {
                name: "source",
                type: "string",
                default: "",
                comment: "",
                extra: {
                  createdBy: "system",
                  createdDate: "2021-06-20",
                },
                schema: {
                  type: "string",
                  title: "Source",
                  description: "Source",
                  readOnly: true,
                },
              },
            },
            indexes: {
              id: {
                key: "PRIMARY",
                column: "id",
              },
            },
          },
        },
        dashboards: {
          10: 10,
          11: 11,
          12: 12
        },
        forms: {
          100: 100
        },
        filters: {
          199: 199,
        }
      },
    },
  },
  getters: {
    [ALL_WORKSPACES]: state => state.workspaces,

    [GET_WORKSPACE]: state => id => state.workspaces[id],

    [GET_DATA_SOURCE]: state => id => state.workspaces[id].dataSource,

    [GET_DASHBOARDS]: (state, getters, rootState, rootGetters) => workspaceId => {
      let dashboards = []
      Object.keys(state.workspaces[workspaceId].dashboards).forEach(dashboardId => {
        dashboards.push(rootGetters['dashboard/GET_DASHBOARD'](dashboardId))
      })
      return dashboards
    },

    [GET_DATA_TYPES]: state => state.dataTypes,

    [GET_SCHEMA_TEMPLATE_BY_TYPE]: (state) => (type) => {
      return state.dataTypes[type.toLowerCase()].formSchemaTemplate
    },
  },
  actions: {

    [CREATE_WORKSPACE] ({ commit }, { title, administrator }) {
      let newWorkspace = createWorkspace({ title, administrator })
      commit(SET_WORKSPACE, { workspaceId: newWorkspace.id, workspace: newWorkspace })
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

    [CREATE_DATA_SOURCE_COLUMN]: ({ commit }, { userId, workspaceId, column }) => {
      // POST to create new column

      if (userId === null) {
        console.log('Error: userId not set')
      }
      // Then commit mutation
      column.extra = {
        createdBy: userId,
        createdDate: Date.now(),
      };
      commit(CREATE_DATA_SOURCE_COLUMN, {
        workspaceId: workspaceId,
        column: column,
      })
    },

    [ADD_DASHBOARD_TO_WORKSPACE]: ({ commit }, { workspaceId, dashboardId }) => {
      commit(ADD_DASHBOARD_TO_WORKSPACE, { workspaceId, dashboardId })
    },

    [ADD_FORM_TO_WORKSPACE]: ({ commit }, { workspaceId, formId }) => {
      commit(ADD_FORM_TO_WORKSPACE, { workspaceId, formId })
    },

    [SET_WORKSPACE] ({ commit }, { workspaceId, workspace }) {
      // Make a POST to server, then update VUEX
      commit(SET_WORKSPACE, { workspaceId, workspace })
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
