import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import pathify from "vuex-pathify";

import { createForm } from "../api";

Vue.use(Vuex);

// pathify.debug()


export default new Vuex.Store({
  plugins: [pathify.plugin],
  state: {
    count: 0,
    metaData: {},
    userState: {
      navigation: {
        workspace: 1,
        dashboard: null,
        form: null
      }
    },
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
        dashboards: [
          {
            id: 10,
            title: "Triage Dashboard",
            newEntityFormId: null,
            displayDuration: true,
            displayNewButton: false,
            filters: [
              {
                field: 'status',
              }
            ],
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
              {text: 'DOB', value: 'DOB'},
              {text: 'Facility', value: 'facility'},
              {text: 'Status', value: 'status'},
              {text: 'Completion (%)', value: 'completion'},
              {text: '', value: 'data-table-expand', groupable: false},
              {text: '', value: 'data-menu', groupable: false, sortable: false},
            ],
          },
          {
            id: 11,
            title: "Dispatch Dashboard",
            displayDuration: true,
            displayNewButton: false,
            filters: [],
            headers: []
          },
          {
            id: 12,
            title: "Whiteboard",
            displayDuration: true,
            displayNewButton: false,
            filters: [],
            headers: []
          },
        ],
        forms: [
          {
            id: 100,
            title: "Dashboard Create Form",
            // JSON Schema definition utilizing the format required by this library:
            // https://koumoul-dev.github.io/vuetify-jsonschema-form/latest/getting-started
            formDefinition: {
              // Global Options
              grid: [],
              options: {
                timePickerProps: {
                  format: "24h",
                },
                context: {
                  users: [
                    {
                      val: "1",
                      label: "User 1",
                    },
                    {
                      val: "2",
                      label: "User 2",
                    },
                  ],
                },
              },
              schema: {
                properties: {
                  stringProp: {
                    type: "string",
                    title: "I'm a string",
                    format: "string",
                    "x-cols": 6,
                  },
                  dateTimeProp: {
                    type: "string",
                    title: "I'm a date-time",
                    format: "date-time",
                    description: "This description is used as a help message.",
                    "x-cols": 6,
                  },
                  stringTextareaProp: {
                    type: "string",
                    title: "I'm a string in a textarea",
                    "x-display": "textarea",
                  },
                  numberProp: {
                    type: "number",
                    title: "I'm a number",
                  },
                  integerProp: {
                    type: "integer",
                    title: "I'm an integer",
                  },
                  integerSliderProp: {
                    type: "integer",
                    title: "I'm an integer in a slider",
                    "x-display": "slider",
                    minimum: 0,
                    maximum: 5,
                  },
                  booleanProp: {
                    type: "boolean",
                    title: "I'm a boolean",
                    description: "This description is used as a help message.",
                  },
                  booleanSwitchProp: {
                    type: "boolean",
                    title: "I'm a boolean with switch display",
                    "x-display": "switch",
                    description: "This description is used as a help message.",
                  },
                  stringArrayProp: {
                    type: "array",
                    title: "I'm an array of strings",
                    items: {
                      type: "string",
                    },
                  },
                  integerArrayProp: {
                    type: "array",
                    title: "I'm an array of integers",
                    items: {
                      type: "integer",
                    },
                  },
                },
              },
            },
          },
        ],
        filters: [
          {
            id: 199,
            title: 'Column 1 condition',
            logical_operator: 'AND',
            conditions: [
              {
                description: 'Column one greater than 10',
                field: 'column1',
                operator: '>',
                parameter: {
                  type: 'const',
                  value: '10'
                }
              },
              {
                description: 'Column one less than 20',
                field: 'column1',
                operator: '<',
                parameter: {
                  type: 'const',
                  value: '20'
                }
              },
              {
                description: 'Column one not equal column two',
                field: 'column1',
                operator: '!=',
                parameter: {
                  type: 'field',
                  value: 'column2'
                }
              },
            ]
          }
        ],
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
    administrators: [
      {
        userId: 1,
        username: "admin",
        displayName: "Ken",
      },
      {
        userId: 2,
        username: "js",
        displayName: "Jason",
      },
      {
        userId: 3,
        username: "mm",
        displayName: "Michael",
      },
    ],
    lists: [
      {
        title: "Address Book Types",
        id: "abook_type",
        type: "list_options",
      },
      {
        title: "AHCCCS Behavioral Plan",
        id: "AHCCCS_Behavioral_Plan",
        type: "list_options",
      },
      {
        title: "AHCCCS Physical Health",
        id: "AHCCCS_Physical_Health",
        type: "list_options",
      },
      {
        title: "Users",
        id: "__users",
        type: "custom",
      },
      {
        title: "Facilities",
        id: "__facilities",
        type: "custom",
      },
    ],

  /**
   * This is the dashboard model for the dashboard module
   */
    dashboard: {
      lists: {
          workspaces: [
              {
                  id: 22,
                  title: 'Crisis',
                  value: 'crisis'
              },
              {
                  id: 23,
                  title: 'Foo',
                  value: 'foo'
              }
          ],
          facilities: [
              {
                  id: 1,
                  title: "Jail",
                  value: "jail"
              },
              {
                  id: 2,
                  title: "Hospital",
                  value: "hospital"
              }
          ],
      },
      filters: [
          {
              field: 'status',

          }
      ],
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
          {text: 'DOB', value: 'DOB'},
          {text: 'Facility', value: 'facility'},
          {text: 'Status', value: 'status'},
          {text: 'Completion (%)', value: 'completion'},
          {text: '', value: 'data-table-expand', groupable: false},
          {text: '', value: 'data-menu', groupable: false, sortable: false},
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
  }
  },
  actions: {
    /**
     * This is the API init call that is required for subsequent calls to the API
     *
     * @param state
     * @param commit
     * @returns {Promise<unknown>}
     */
    init({ state, commit }) {
      return new Promise((resolve) => {
        axios
          .get("/interface/modules/custom_modules/oe-workspace-server/init.php")
          .then(function(response) {
            const metaData = response.data;
            commit("setMetaData", metaData);
            resolve(state.metaData);
          });
      });
    },
    fetchWorkspace({ state, commit }, { workspaceId }) {
      console.log(workspaceId);
      if (state.metaData.csrfToken) {
        return new Promise((resolve) => {
          axios
            .get("/apis/api/dashboard", {
              // params: {
              //     id: dashboardId
              // },
              headers: {
                apicsrftoken: state.metaData.csrfToken,
              },
            })
            .then(function(response) {
              const dashboard = response.data;
              commit("setDashboard", dashboard);
              resolve(state.dashboard);
            })
            .catch(function() {
              alert("there was an error, you may need to log back in");
            });
        });
      }
    },
    // createWorkspace ({ state, commit }, { workspace }) {
    //
    // },
    createDataSourceColumn({ commit }, { workspaceId, column }) {
      // POST to create new column

      // Then commit mutation
      column.extra = {
        createdBy: this.state.userState.userId,
        createdDate: Date.now(),
      };
      commit("appendDataSourceColumn", {
        workspaceId: workspaceId,
        column: column,
      });
    },
    // createDashboard({ commit }, { workspaceId, dashboardId, dashboard }) {
    //
    // },
    updateDashboard({ commit }, { workspaceId, dashboardId, dashboard }) {
      // Make a POST to server, then update VUEX
      commit('setDashboard', { workspaceId, dashboardId, dashboard })
    },
    createForm({ commit }, { workspaceId, form }) {
      const newForm = createForm(workspaceId, form);
      commit("addForm", { workspaceId: workspaceId, form: newForm });
    },

    /**
     * TODO Dashboard Module Actions
     */

    /**
     * Fetch a dashboard from the server given a dashboard ID and commit it to the state
     *
     * @param state
     * @param commit
     * @param dashboardId
     * @returns {Promise<unknown>}
     */
    fetchDashboard ({ state, commit }, { dashboardId }) {
      console.log(dashboardId)
      if (state.metaData.csrfToken) {
        return new Promise((resolve) => {
          axios.get('/apis/api/dashboard', {
            // params: {
            //     id: dashboardId
            // },
            headers: {
              'apicsrftoken': state.metaData.csrfToken
            }
          }).then(function (response) {
            const dashboard = response.data
            commit('dSetDashboard', dashboard)
            resolve(state.dashboard)
          }).catch(function () {
            alert("there was an error, you may need to log back in")
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

    /**
    * BUILDER
    */
    getFormById: (state) => (workspaceId, id) => {
      return state.workspaces[workspaceId].forms.find((form) => form.id === id);
    },

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
  },
  mutations: {
    setMetaData (state, metaData) {
      Vue.set(state, 'metaData', metaData)
    },
    // DataSource Builder Mutations
    appendDataSourceColumn(state, { workspaceId, column }) {
      // The column name is the index and the column is the model
      Vue.set(
        state.workspaces[workspaceId].dataSource.spec.columns,
        column.name,
        column
      );
    },
    setNavigation(state, { key, id }) {
      Vue.set(state.userState.navigation, key, id)
    },
    setDataSourceColumn(state, { workspaceId, column }) {
      state.workspaces[workspaceId].dataSource.spec.columns[
        column.name
      ] = column;
    },
    // Dashboard Builder Mutations
    setDashboard(state, { workspaceId, dashboardId, dashboard} ) {
      const vuexDashbaord = state.workspaces[workspaceId].dashboards.find( d => d.id === dashboardId)
      Vue.set(vuexDashbaord, 'title', dashboard.title)
      Vue.set(vuexDashbaord, 'filters', dashboard.filters)
      Vue.set(vuexDashbaord, 'headers', dashboard.headers)
    },
    // Form Builder Mutations
    setFormSchema(state, { workspaceId, formId, schema }) {
      // state.workspaces[workspaceId].forms[
      //   formId
      // ].formDefinition.schema = schema;
      let form = state.workspaces[workspaceId].forms.find(
        (form) => form.id === formId
      );
      form.formDefinition.schema = schema;
    },
    setFormGrid(state, { workspaceId, formId, grid }) {
      let form = state.workspaces[workspaceId].forms.find(
        (form) => form.id === formId
      );
      form.formDefinition.grid = grid
    },
    addForm(state, { workspaceId, form }) {
      state.workspaces[workspaceId].forms.push(form);
    },

    /**
     * TODO Move to a Dashboard Module
     */
    dSetDashboard (state, dashboard) {
      // set the new dashboard in the state
      Vue.set(state, 'dashboard', dashboard)
    }
  },
});
