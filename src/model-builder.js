export function newWorkspace(formData) {
  const defaultDataSource = require('./data/_data_source_template.json')
  return {
    // id: Math.floor(Math.random() * 32768),
    id: null,
    title: "[New Workspace]",
    administrator: 1,
    dataSource: defaultDataSource,
    displayOnPatientMenu: false,
    dashboards: {},
    forms: {},
    filters: {},
    actions: {},

    ...formData,
  };
}

export function newDataSourceColumn(formData) {
  return {
    title: "[New Data Source Column]",
    name: "",
    type: "",
    comment: "",

    ...formData,
  };
}

export function newDashboard(workspaceId, dashboard) {
  return {
    id: null,
    workspaceId: workspaceId,
    title: "[New Dashboard]",
    displayDuration: false,
    durationModel: {
      ranges: [],
      units: "",
      outOfRangeColor: ""
    },
    displayNewButton: false,
    filters: [],
    headers: [],

    ...dashboard,
  }
}

export function newForm(workspaceId, formData) {
  return {
    id: Math.floor(Math.random() * 32768),
    workspaceId: workspaceId,
    title: "[New Form]",
    grid: [],
    options: {},
    schema: {},

    ...formData,
  };
}
