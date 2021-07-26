import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        count: 0,
        metaData: {},
        userState: {
            activeWorkspace: 1,
            userId: 1
        },
        workspaces: {
            1: {
                id: 1,
                title: "CET",
                administrator: "admin",
                dataSource: {
                    spec: {
                        columns: [
                            {
                                name: "id",
                                type: "int(11)",
                                default: "",
                                comment: "",
                                extra: {
                                    createdBy: 'system',
                                    createdDate: '2021-06-20'
                                }
                            },
                            {
                                name: "created_date",
                                type: "datetime",
                                default: "",
                                comment: "",
                                extra: {
                                    createdBy: 'system',
                                    createdDate: '2021-06-20'
                                }
                            },
                            {
                                name: "created_by",
                                type: "int(11)",
                                default: "",
                                comment: "refers to users.id",
                                extra: {
                                    createdBy: 'system',
                                    createdDate: '2021-06-20'
                                }
                            },
                            {
                                name: "updated_date",
                                type: "datetime",
                                default: "",
                                comment: "",
                                extra: {
                                    createdBy: 'system',
                                    createdDate: '2021-06-20'
                                }
                            },
                            {
                                name: "updated_by",
                                type: "int(11)",
                                default: "",
                                comment: "refers to users.id",
                                extra: {
                                    createdBy: 'system',
                                    createdDate: '2021-06-20'
                                }
                            },
                            {
                                name: "dashboard_id",
                                type: "int(11)",
                                default: "",
                                comment: "refers to the dashboard that the entity is currently on",
                                extra: {
                                    createdBy: 'system',
                                    createdDate: '2021-06-20'
                                }
                            },
                            {
                                name: "moved_to_dashboard_date",
                                type: "datetime",
                                default: "",
                                comment: "datetime that an entity was moved to dashboard",
                                extra: {
                                    createdBy: 'system',
                                    createdDate: '2021-06-20'
                                }
                            },
                            {
                                name: "moved_to_dashboard_by",
                                type: "int(11)",
                                default: "",
                                comment: "refers to users.id",
                                extra: {
                                    createdBy: 'system',
                                    createdDate: '2021-06-20'
                                }
                            },
                            {
                                name: "source",
                                type: "varchar(255)",
                                default: "",
                                comment: "",
                                extra: {
                                    createdBy: 'system',
                                    createdDate: '2021-06-20'
                                }
                            }
                        ],
                        indexes: [
                            {
                                key: "PRIMARY",
                                column: "id",
                            }
                        ],
                        options: {
                            keys: [{
                                name: 'Choose Key',
                                id: -99
                            },{
                                name: 'Crash Number',
                                id: 134
                            },{
                                name: 'GUID',
                                id: 87
                            },{
                                name: 'Daily Startup',
                                id: 256
                            },{
                                name: 'IP',
                                id: 121
                            }]
                        }
                    }
                },
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
            Vue.set(state.workspaces[workspaceId].dataSource.schema.columns, column.name, column)
        },
        increment (state) {
            state.count++
        }
    }
})
