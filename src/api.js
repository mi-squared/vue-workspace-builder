import axios from 'axios'
import { newDashboard, newDataSourceColumn, newForm, newWorkspace } from './model-builder'

const baseUrl = process.env.VUE_APP_API_BASE_URL

console.log('Base URL FOR API = ' + process.env.VUE_APP_API_BASE_URL)

function handleApiError(error) {
  if (axios.isAxiosError(error)) {
    handleAxiosError(error);
  } else {
    throw error;
  }
}

function handleAxiosError(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
    alert('there was an error talking to the api, you may need to log back in.');
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
    alert('there was an error, try again.');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error", error.message);
  }
  console.log(error.config);
}

export function ws_init() {
  return axios.get(baseUrl + "/interface/modules/custom_modules/oe-workspace-server/init.php")
}

export function setOpenEmrPatient(pid)
{
  top.restoreSession();
  top.RTop.location = baseUrl +  "/interface/patient_file/summary/demographics.php?set_pid=" + encodeURIComponent(pid);
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
    }).catch(handleApiError)
  })
}

export function fetchDataTypes(userMeta)
{
  return new Promise((resolve) => {
    axios.get(baseUrl + '/apis/api/datatypes', {
      headers: {
        'apicsrftoken': userMeta.csrfToken
      }
    }).then(response => {
      // The response contains data-types, etc
      const dataTypes = response.data
      console.log(dataTypes)
      resolve(dataTypes)
    }).catch(handleApiError)
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
    }).catch(handleApiError)
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
    }).catch(handleApiError)
  })
}

export function pushWorkspace(workspaceId, workspace, userMeta)
{
  return new Promise((resolve) => {
    axios.put(baseUrl + '/apis/api/workspace', {
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
    }).catch(handleApiError)
  })
}

export function fetchAllLists(userMeta)
{
  return new Promise((resolve) => {
    axios.get(baseUrl+ '/apis/api/fetchlists', {
      params: {},
      headers: {
        'apicsrftoken': userMeta.csrfToken
      }
    }).then(function (response) {
      // Returns an object, containing objects with list ID as key
      const lists = response.data
      resolve(lists)
    }).catch(handleApiError)
  })
}

export function fetchListsWithDataBulk(arrayOfListId, userMeta)
{
  return new Promise((resolve) => {
    axios.post(baseUrl+ '/apis/api/fetchlistdata', {
      params: {
        listIds: arrayOfListId
      },
    }, {
      headers: {
        'apicsrftoken': userMeta.csrfToken
      }
    }).then(function (response) {
      // Returns an object, containing objects with list ID as key
      const lists = response.data
      resolve(lists)
    }).catch(handleApiError)
  })
}

export function createEntity(workspaceId, dashboardId, entity, patient, userMeta, sourceEntityId = null)
{
  return new Promise((resolve) => {
    axios.post(baseUrl + '/apis/api/entity', {
        params: {
          workspaceId: workspaceId,
          dashboardId: dashboardId,
          entity: entity,
          patient: patient,
          sourceEntityId: sourceEntityId, // If we are creating a new entity from an existing entity, pass the en(move workspace)
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
    }).catch(handleApiError)
  })
}

export function updateEntity(workspaceId, dashboardId, entityId, entity, patient, userMeta)
{
  return new Promise((resolve) => {
    axios.put(baseUrl + '/apis/api/entity', {
        params: {
          workspaceId: workspaceId,
          dashboardId: dashboardId,
          entityId: entityId,
          entity: entity,
          patient: patient
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
    }).catch(handleApiError)
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
      }).catch(handleApiError)
  })
}

export function initDashboardById(dashboardId, userMeta)
{
  return new Promise((resolve) => {
    axios.get(baseUrl + '/apis/api/dashboardinit', {
      params: {
        id: dashboardId
      },
      headers: {
        'apicsrftoken': userMeta.csrfToken
      }
    }).then(function (response) {
      resolve(response.data)
    }).catch(handleApiError)
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
    }).catch(handleApiError)
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
    }).catch(handleApiError)
  })
}

export function updateTestEntities(dashboardId, workspaceId, entityIds, lastUpdateTestDatetime, userMeta)
{
  return new Promise((resolve) => {
    axios.get(baseUrl + '/apis/api/updatetest', {
      params: {
        dashboardId: dashboardId,
        workspaceId: workspaceId,
        entityIds: entityIds,
        lastUpdateTestDatetime: lastUpdateTestDatetime
      },
      headers: {
        'apicsrftoken': userMeta.csrfToken
      }
    }).then(function (response) {
      const updateTestResponse = response.data
      resolve(updateTestResponse)
    }).catch(handleApiError)
  })
}

export function fetchEntities(dashboardId, dashboardFilterEnabled, archivedFilterEnabled, search, filter, paginationOptions, userMeta)
{
  return new Promise((resolve) => {
    axios.get(baseUrl + '/apis/api/entities', {
      params: {
        dashboardId: dashboardId,
        dashboardFilterEnabled: dashboardFilterEnabled,
        archivedFilterEnabled: archivedFilterEnabled,
        search: search,
        filter: filter,
        paginationOptions: paginationOptions
      },
      headers: {
        'apicsrftoken': userMeta.csrfToken
      }
    }).then(function (response) {
      const fetchEntitiesResponse = response.data
      resolve(fetchEntitiesResponse)
    }).catch(handleApiError)
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
    }).catch(handleApiError)
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
      }).catch(handleApiError)
  })
}

export function updateAttachment(attachment, userMeta)
{
  return new Promise( (resolve) => {
    //id: Math.floor(Math.random() * 32768),
    axios.post(baseUrl + '/apis/api/note', {
        params: {
          attachment: attachment
        }
      },
      {
        headers: {
          'apicsrftoken': userMeta.csrfToken,
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(function (response) {
      const attachment = response.data
      resolve(attachment)
    }).catch(handleApiError)
  })
}

export function createNote(note, userMeta)
{
  return new Promise( (resolve) => {
    //id: Math.floor(Math.random() * 32768),
    axios.post(baseUrl + '/apis/api/note', {
        params: {
          note: note
        }
      },
      {
        headers: {
          'apicsrftoken': userMeta.csrfToken,
          'Content-Type': 'application/json;charset=utf-8'
        }
      }).then(function (response) {
      const note = response.data
      resolve(note)
    }).catch(handleApiError)
  })
}

export function getNotesByEntityId(entityId, dashboardId, userMeta)
{
  return new Promise((resolve) => {
    axios.get(baseUrl + '/apis/api/notes', {
      params: {
        entityId: entityId,
        dashboardId: dashboardId
      },
      headers: {
        'apicsrftoken': userMeta.csrfToken
      }
    }).then(function (response) {
      const notes = response.data
      resolve(notes)
    }).catch(handleApiError)
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
    }).catch(handleApiError)
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
    }).catch(handleApiError)
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
    }).catch(handleApiError)
  })
}

export function fetchPatients(patient, userMeta)
{
  return new Promise((resolve) => {
    axios.post(baseUrl + '/apis/api/patients', {
      params: {
        patient: patient
      },
    },
      {
      headers: {
        'apicsrftoken': userMeta.csrfToken
      }
    }).then(function (response) {
      const matches = response.data
      resolve(matches)
    }).catch(handleApiError)
  })
}

export function getPatientById(pid, userMeta)
{
  return new Promise((resolve) => {
    axios.get(baseUrl + '/apis/api/patient', {
      params: {
        pid: pid
      },
      headers: {
        'apicsrftoken': userMeta.csrfToken
      }
    }).then(function (response) {
      const patient = response.data
      resolve(patient)
    }).catch(handleApiError)
  })
}

export function fetchTimelineByPid(pid, userMeta)
{
  return new Promise((resolve) => {
    axios.get(baseUrl + '/apis/api/timeline', {
      params: {
        pid: pid
      },
      headers: {
        'apicsrftoken': userMeta.csrfToken
      }
    }).then(function (response) {
      const timeline = response.data
      resolve(timeline)
    }).catch(handleApiError)
  })
}
