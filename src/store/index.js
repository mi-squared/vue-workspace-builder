import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        count: 0,
        metaData: {},
        userState: {
            activeWorkspace: 1
        },
        workspaces: {
            1: {
                id: 1,
                title: "CET",
                administrator: "admin",
                dataSource: {
                    spec: {
                        columns: {
                            "id" : {
                                name: "id",
                                type: "int(11)",
                                default: "",
                                comment: "",
                                extra: {
                                    createdBy: 'system',
                                    createdDate: '2021-06-20'
                                }
                            },
                            "created_date" : {
                                name: "created_date",
                                type: "datetime",
                                default: "",
                                comment: "",
                                extra: {
                                    createdBy: 'system',
                                    createdDate: '2021-06-20'
                                }
                            },
                            "created_by" : {
                                name: "created_by",
                                type: "int(11)",
                                default: "",
                                comment: "refers to users.id",
                                extra: {
                                    createdBy: 'system',
                                    createdDate: '2021-06-20'
                                }
                            },
                            "updated_date" : {
                                name: "updated_date",
                                type: "datetime",
                                default: "",
                                comment: "",
                                extra: {
                                    createdBy: 'system',
                                    createdDate: '2021-06-20'
                                }
                            },
                            "updated_by" : {
                                name: "updated_by",
                                type: "int(11)",
                                default: "",
                                comment: "refers to users.id",
                                extra: {
                                    createdBy: 'system',
                                    createdDate: '2021-06-20'
                                }
                            },
                            "source" : {
                                name: "source",
                                type: "varchar(255)",
                                default: "",
                                comment: "",
                                extra: {
                                    createdBy: 'system',
                                    createdDate: '2021-06-20'
                                }
                            }
                        },
                        indexes: {
                            "id": {
                                key: "PRIMARY",
                                column: "id",
                            }
                        }
                    }
                },
                dashboards: [
                    {
                        id: 10,
                        title: "Triage Dashboard"
                    },
                    {
                        id: 11,
                        title: "Dispatch Dashboard"
                    },
                    {
                        id: 12,
                        title: "Whiteboard"
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
                            options: {
                                "timePickerProps": {
                                    "format": "24h"
                                }
                            },
                            schema: {
                                "properties": {
                                    "stringProp": {
                                        "type": "string",
                                        "title": "I'm a string",
                                        "format": "string",
                                        "x-cols": 6
                                    },
                                    "dateTimeProp": {
                                        "type": "string",
                                        "title": "I'm a date-time",
                                        "format": "date-time",
                                        "description": "This description is used as a help message.",
                                        "x-cols": 6
                                    },
                                    "stringTextareaProp": {
                                        "type": "string",
                                        "title": "I'm a string in a textarea",
                                        "x-display": "textarea"
                                    },
                                    "numberProp": {
                                        "type": "number",
                                        "title": "I'm a number"
                                    },
                                    "integerProp": {
                                        "type": "integer",
                                        "title": "I'm an integer"
                                    },
                                    "integerSliderProp": {
                                        "type": "integer",
                                        "title": "I'm an integer in a slider",
                                        "x-display": "slider",
                                        "minimum": 0,
                                        "maximum": 5
                                    },
                                    "booleanProp": {
                                        "type": "boolean",
                                        "title": "I'm a boolean",
                                        "description": "This description is used as a help message."
                                    },
                                    "booleanSwitchProp": {
                                        "type": "boolean",
                                        "title": "I'm a boolean with switch display",
                                        "x-display": "switch",
                                        "description": "This description is used as a help message."
                                    },
                                    "stringArrayProp": {
                                        "type": "array",
                                        "title": "I'm an array of strings",
                                        "items": {
                                            "type": "string"
                                        }
                                    },
                                    "integerArrayProp": {
                                        "type": "array",
                                        "title": "I'm an array of integers",
                                        "items": {
                                            "type": "integer"
                                        }
                                    }
                                }
                            }
                        }

                    }
                ],
                views: [
                    {
                        order: 0,
                        title: "CET Triage Board",
                        type: 'dashboard',
                        enabled: true,
                        component: {
                            id: 1001
                        }
                    },
                    {
                        order: 1,
                        title: "Cigna Dashboard",
                        type: 'dashboard',
                        enabled: true,
                        component: {
                            id: 1002
                        }
                    },
                ]
            }
        },
        administrators: [
            {
                userId: 1,
                username: 'admin',
                displayName: 'Ken'
            },
            {
                userId: 2,
                username: 'js',
                displayName: 'Jason'
            },
            {
                userId: 3,
                username: 'mm',
                displayName: 'Michael'
            },
        ],
        lists: [
            {
                title: "Address Book Types",
                id: "abook_type",
                type: "list_options"
            },
            {
                title: "AHCCCS Behavioral Plan",
                id: "AHCCCS_Behavioral_Plan",
                type: "list_options"
            },
            {
                title: "AHCCCS Physical Health",
                id: "AHCCCS_Physical_Health",
                type: "list_options"
            },
            {
                title: "Users",
                id: "__users",
                type: "custom"
            },
            {
                title: "Facilities",
                id: "__facilities",
                type: "custom"
            }
        ]
    },
    actions: {
        /**
         * This is the API init call that is required for subsequent calls to the API
         *
         * @param state
         * @param commit
         * @returns {Promise<unknown>}
         */
        init ({state, commit }) {
            return new Promise(resolve => {
                axios.get('/interface/modules/custom_modules/oe-workspace-server/init.php')
                    .then(function (response) {
                        const metaData = response.data
                        commit('setMetaData', metaData)
                        resolve(state.metaData)
                    })
            })
        },
        fetchWorkspace ({ state, commit }, { workspaceId }) {
            console.log(workspaceId)
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
                        commit('setDashboard', dashboard)
                        resolve(state.dashboard)
                    }).catch(function () {
                        alert("there was an error, you may need to log back in")
                    })
                })
            }
        },
        // createWorkspace ({ state, commit }, { workspace }) {
        //
        // },
        createDataSourceColumn ({ commit }, { workspaceId, column }) {
            // POST to create new column

            // Then commit mutation
            column.extra = {
                createdBy: this.state.userState.userId,
                createdDate: Date.now()
            }
            commit('appendDataSourceColumn', { workspaceId: workspaceId, column: column })
        }
    },
    mutations: {
        appendDataSourceColumn (state, { workspaceId, column }) {
            // The column name is the index and the column is the model
            Vue.set(state.workspaces[workspaceId].dataSource.spec.columns, column.name, column)
        },
        increment (state) {
            state.count++
        }
    }
})
