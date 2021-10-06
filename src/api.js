import axios from 'axios'
import { newDashboard, newDataSourceColumn, newForm, newWorkspace } from './model-builder'

const baseUrl = process.env.VUE_APP_API_BASE_URL

console.log('Base URL FOR API = ' + process.env.VUE_APP_API_BASE_URL)


export function ws_init() {
  return axios.get(baseUrl + "/interface/modules/custom_modules/oe-workspace-server/init.php")
}

export function createWorkspace({title, administrator}, userMeta) {
  let workspace = newWorkspace({title, administrator})

  return new Promise((resolve) => {
    axios.post(baseUrl + '/apis/api/workspace', {
        params: {
          workspace: workspace
        }
      },
      {
        headers: {
          'apicsrftoken': userMeta.csrfToken,
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(function (response) {
      const workspace = response.data
      resolve(workspace)
    }).catch(function () {
      alert('there was an error, you may need to log back in')
    })
  })
}

export function fetchAllWorkspaces(userMeta)
{
  return new Promise((resolve) => {
    axios.get(baseUrl + '/apis/api/workspaces', {
      headers: {
        'apicsrftoken': userMeta.csrfToken
      }
    }).then(response => {
      // Set all the workspaces that we get in the response
      const workspaces = response.data
      resolve(workspaces)
    }).catch(function () {
      alert('there was an error, you may need to log back in')
    })
  })
}

export function fetchWorkspace(workspaceId, userMeta)
{
  return new Promise((resolve) => {
    axios.get(baseUrl+ '/apis/api/workspace', {
      params: {
        id: workspaceId
      },
      headers: {
        'apicsrftoken': userMeta.csrfToken
      }
    }).then(function (response) {
      const workspace = response.data
      resolve(workspace)
    }).catch(function () {
      alert('there was an error, you may need to log back in')
    })
  })
}

export function pushWorkspace(workspaceId, workspace, userMeta)
{
  return new Promise((resolve) => {
    axios.put('/apis/api/workspace', {
        params: {
          id: workspaceId,
          workspace: workspace
        }
      },
      {
        headers: {
          'apicsrftoken': userMeta.csrfToken,
          'Content-Type': 'application/json;charset=utf-8'
        }
      }
    ).then(function (response) {
      const workspace = response.data
      resolve(workspace)
    }).catch(function () {
      alert('there was an error, you may need to log back in')
    })
  })
}

export function createEntity(workspaceId, dashboardId, entity, userMeta)
{
  return new Promise((resolve) => {
    axios.post(baseUrl + '/apis/api/entity', {
        params: {
          workspaceId: workspaceId,
          dashboardId: dashboardId,
          entity: entity
        }
      },
      {
        headers: {
          'apicsrftoken': userMeta.csrfToken,
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(function (response) {
      const entity = response.data
      resolve(entity)
    }).catch(function () {
      alert('there was an error.')
    })
  })
}

export function createDataSourceColumn(userId, workspaceId, column, userMeta) {
  const dataSourceColumn = newDataSourceColumn(userId, column)
  return new Promise((resolve) => {
    axios.post(baseUrl + '/apis/api/datasourcecolumn', {
        params: {
          workspaceId: workspaceId,
          column: dataSourceColumn
        }
      },
      {
        headers: {
          'apicsrftoken': userMeta.csrfToken,
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(function (response) {
        const dataSourceColumn = response.data
        resolve({ workspaceId, column: dataSourceColumn })
      }).catch(function () {
        alert('there was an error.')
      })
  })
}

export function getDashboardById(dashboardId, userMeta)
{
  return new Promise((resolve) => {
    axios.get(baseUrl + '/apis/api/dashboard', {
      params: {
        id: dashboardId
      },
      headers: {
        'apicsrftoken': userMeta.csrfToken
      }
    }).then(function (response) {
      const dashboard = response.data
      resolve(dashboard)
    }).catch(function () {
      alert('there was an error, you may need to log back in')
    })
  })
}

export function fetchDashboardRows(dashboardId, userMeta)
{
  return new Promise((resolve) => {
    axios.get(baseUrl + '/apis/api/dashboardrows', {
      params: {
        id: dashboardId
      },
      headers: {
        'apicsrftoken': userMeta.csrfToken
      }
    }).then(function (response) {
      const rows = response.data
      resolve(rows)
    }).catch(function () {
      alert('there was an error, you may need to log back in')
    })
  })
}

export function createDashboard(formData, userMeta) {

  // Use the model-builder to create a new dashboard using the submitted data
  const dashboard = newDashboard(formData.workspaceId, formData.dashboard)

  return new Promise( (resolve) => {
    //id: Math.floor(Math.random() * 32768),
    axios.post(baseUrl + '/apis/api/dashboard', {
        params: {
          workspaceId: formData.workspaceId,
          dashboard: dashboard
        }
      },
      {
        headers: {
          'apicsrftoken': userMeta.csrfToken,
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(function (response) {
        const dashboard = response.data
        resolve(dashboard)
    }).catch(function () {
      alert('there was an error.')
    })
  })
}

export function updateDashboard(dashboard, userMeta) {

  return new Promise((resolve) => {
    axios.put(baseUrl + '/apis/api/dashboard',
      {
        params: {
          dashboard: dashboard
        }
      },
      {
        headers: {
          'apicsrftoken': userMeta.csrfToken,
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(function (response) {
        const dashboard = response.data
        resolve(dashboard)
      }).catch(function () {
        alert('there was an error.')
      })
  })
}

export function getFormById(formId, userMeta)
{
  return new Promise((resolve) => {
    axios.get(baseUrl + '/apis/api/form', {
      params: {
        id: formId
      },
      headers: {
        'apicsrftoken': userMeta.csrfToken
      }
    }).then(function (response) {
      const form = response.data
      resolve(form)
    }).catch(function () {
      alert('there was an error, you may need to log back in')
    })
  })
}

export function createForm(formData, userMeta) {
  // Use the model-builder to create a new form using the submitted data
  const form = newForm(formData.workspaceId, formData.form)

  return new Promise( (resolve) => {
    //id: Math.floor(Math.random() * 32768),
    axios.post(baseUrl + '/apis/api/form', {
        params: {
          workspaceId: formData.workspaceId,
          form: form
        }
      },
      {
        headers: {
          'apicsrftoken': userMeta.csrfToken,
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(function (response) {
      const form = response.data
      resolve(form)
    }).catch(function () {
      alert('there was an error.')
    })
  })
}

export function updateForm(form, userMeta) {

  return new Promise((resolve) => {
    axios.put(baseUrl + '/apis/api/form',
      {
        params: {
          form: form
        }
      },
      {
        headers: {
          'apicsrftoken': userMeta.csrfToken,
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(function (response) {
      const form = response.data
      resolve(form)
    }).catch(function () {
      alert('there was an error.')
    })
  })
}
