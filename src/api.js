import axios from 'axios'
import { newDashboard, newWorkspace } from './model-builder'

export function ws_init() {
  return axios.get("/interface/modules/custom_modules/oe-workspace-server/init.php")
}

export function createWorkspace(formData) {
  return newWorkspace(formData)
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

export function createDashboard(formData, userMeta) {

  // Use the model-builder to create a new dashboard using the submitted data
  const dashboard = newDashboard(formData.workspaceId, formData.dashboard)

  return new Promise( (resolve) => {
    //id: Math.floor(Math.random() * 32768),
    axios.post('/apis/api/dashboard', {
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
    axios.put('/apis/api/dashboard',
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
