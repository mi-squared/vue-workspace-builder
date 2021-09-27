export function createWorkspace(formData) {
  const defaultDataSource = require('./data/_data_source_template.json')
  return {
    id: Math.floor(Math.random() * 32768),
    title: "[New Workspace]",
    administrator: 1,
    dataSource: defaultDataSource,
    dashboards: [],
    forms: [],
    filters: [],
    actions: [],

    ...formData,
  };
}

export function createDataSourceColumn(formData) {
  return {
    title: "[New Data Source Column]",
    name: "",
    type: "",
    comment: "",

    ...formData,
  };
}

export function createDashboard(formData) {
  return {
    id: Math.floor(Math.random() * 32768),
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

    ...formData,
  };
}

export function createForm(workspaceId, formData) {
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
