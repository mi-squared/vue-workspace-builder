import moment from 'moment-timezone'

export function newWorkspace(formData) {
  const defaultDataSource = require('./data/_data_source_template.json')
  return {
    // id: Math.floor(Math.random() * 32768),
    id: null,
    title: "[New Workspace]",
    administrator: 1,
    dataSource: defaultDataSource,
    displayOnPatientMenu: false,
    color: '',
    dashboards: {},
    forms: {},
    filters: {},
    actions: {},

    ...formData,
  };
}

export function newDataSourceColumn(userId, column) {

  return {
    title: "[New Data Source Column]",
    name: "",
    type: "",
    comment: "",
    databaseTable: "",
    extra: {
      createdBy: userId,
      createdDate: Date.now(),
      category: 'custom'
    },

    ...column,
  };
}

export function newDashboard(workspaceId, dashboard) {
  return {
    id: null,
    workspaceId: workspaceId,
    title: "[New Dashboard]",
    disableDashboardFilter: false,
    displayDuration: false,
    durationModel: {
      ranges: [],
      units: "",
      outOfRangeColor: ""
    },
    mainFormId: "",
    displayNewButton: false,
    newEntityFormId: "",
    hasConditionalLogic: false,
    conditionalLogic: {},
    filters: [],
    headers: [],

    ...dashboard,
  }
}

export function newNote(workspaceId, dashboardId, entityId, pid, text)
{
    return {
      id: null,
      workspaceId: workspaceId,
      dashboardId: dashboardId,
      entityId: entityId,
      pid: pid,
      text: text
    }
}

export function appendMetaToEntity(dashboard, meta)
{
  if (dashboard.meta == undefined) {
    dashboard.meta = []
  }
  dashboard.meta.push(meta)
  return dashboard
}

export function newEntityMeta({ type, datetime, text, indicatorIcon, extra })
{
  const meta = {
    type: type,
    datetime: datetime,
    text: text,
    indicatorIcon: indicatorIcon,
    extra : extra
  }

  return meta
}

export function newDashboardSourceDashboard(dashboardId)
{
  return newDashboardSource('dashboard', {
    dashboardId: dashboardId
  })
}

export function newDashboardSourceWorkspace(workspaceId, dashboardId )
{
  return newDashboardSource('workspace', {
    workspaceId: workspaceId,
    dashboardId: dashboardId
  })
}

/**
 * Build a dashboard source. If defined, 'extra' contains the meta data depending on the type of source.
 *
 * @param type
 * @param extra
 * @returns {*}
 */
export function newDashboardSource(type, extra)
{
  let now = moment().format('YYYY-MM-DD HH:MM:SS')
  return {
    datetime: now,
    type: type,
    extra: extra
  }
}

export function newForm(workspaceId, formData) {
  return {
    //id: Math.floor(Math.random() * 32768),
    id: null,
    workspaceId: workspaceId,
    title: "[New Form]",

    grid: [],
    options: {},
    schema: {},

    ...formData,
  };
}
