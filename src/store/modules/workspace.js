import {
  ADD_FORM_TO_WORKSPACE, ALL_WORKSPACES,
  CREATE_DATA_SOURCE_COLUMN, CREATE_WORKSPACE,
  GET_DATA_SOURCE,
  GET_WORKSPACE,
  SET_WORKSPACE
} from '../types-workspace'
import Vue from "vue";
// import axios from 'axios'
import { createWorkspace } from '../../api'

export const workspace = {
  namespaced: true,
  state: {
    workspaces: {
      1: {
        id: 1,
        title: "CET",
        administrator: "admin",
        dataSource: {
          spec: {
            columns: {
              id: {
                name: "id",
                type: "int(11)",
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
                type: "int(11)",
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
                type: "int(11)",
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
                type: "varchar(255)",
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
      views: [
        {
          order: 0,
          title: "CET Triage Board",
          type: "dashboard",
          enabled: true,
          component: {
            id: 1001,
          },
        },
        {
          order: 1,
          title: "Cigna Dashboard",
          type: "dashboard",
          enabled: true,
          component: {
            id: 1002,
          },
        },
      ],
    },
  },
  getters: {
    [ALL_WORKSPACES]: state => state.workspaces,

    [GET_WORKSPACE]: state => id => state.workspaces[id],

    [GET_DATA_SOURCE]: state => id => state.workspaces[id].dataSource
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
