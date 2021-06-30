import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        count: 0,
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
                    schema: {
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
                            "id" : {
                                key: "PRIMARY",
                                column: "id",
                            }
                        },
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
                        type: 'dasbboard',
                        enabled: true,
                        component: {
                            id: 1001
                        }
                    },
                    {
                        order: 1,
                        title: "Cigna Dashboard",
                        type: 'dasbboard',
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
