export function createWorkspace(formData) {
  return {
    id: Math.floor(Math.random() * 32768),
    title: "[New Workspace]",
    administrator: 1,

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
    properties: {},

    ...formData,
  };
}
