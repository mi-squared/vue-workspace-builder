import {
  ADD_NOTE,
  ALL_DASHBOARDS,
  CREATE_COORDINATOR,
  CREATE_DASHBOARD,
  CREATE_ENTITY, DELETE_META,
  FETCH_DASHBOARD,
  FETCH_ENTITIES,
  FETCH_NOTES_BY_ENTITY_ID, GET_ACTIONS_PERFORMED_BY_ENTITY_ID,
  GET_ATTACHMENTS_BY_ENTITY_ID,
  GET_COORDINATORS_BY_ENTITY_ID,
  GET_DASHBOARD, GET_DASHBOARD_ACTIONS,
  GET_DASHBOARD_ROWS,
  GET_ENTITY_BY_ID, GET_ERROR_MESSAGE,
  GET_NOTES_BY_ENTITY_ID,
  INIT_DASHBOARD, PERFORM_DASHBOARD_ACTION,
  PUSH_ENTITY,
  SET_DASHBOARD, SET_DASHBOARD_ACTIONS,
  SET_DASHBOARD_META,
  SET_DASHBOARD_ROWS,
  SET_ENTITY, SET_ERROR_MESSAGE,
  SET_META,
  SET_NOTE, UPDATE_ATTACHMENT,
  UPDATE_TEST
} from '../types-dashboard'
import Vue from 'vue'
import {
  createDashboard,
  createEntity, createEntityMeta, deleteEntityMeta,
  fetchEntities,
  getDashboardById, getNotesByEntityId, initDashboardById, performAction,
  updateDashboard,
  updateEntity, updateEntityMeta, updateTestEntities
} from '../../api'
import { newCoordinator, newNote } from '../../model-builder'
import Error from '../../models/Error'
import Icon from '../../models/Icon'

export const dashboard = {
  namespaced: true,
  state: {
    dashboards: {},
    entities: {},
    meta: {},
    actions: {},
    errorMessage: {}
  },
  getters: {
    [ALL_DASHBOARDS]: state => state.dashboards,

    [GET_DASHBOARD]: state => id => {
      return state.dashboards[id]
    },

    [GET_ERROR_MESSAGE]: state => state.errorMessage,

    [GET_NOTES_BY_ENTITY_ID]: state => ({ entityId, dashboardId }) => {
      return Object.values(state.meta).filter(meta => {
        if (meta.deletedDate == null &&
          meta.metaType == 'Mi2\\Workspace\\Models\\EntityNote' &&
          meta.entityId == entityId &&
          meta.dashboardId == dashboardId) {
          return meta
        }
      })
    },

    [GET_ACTIONS_PERFORMED_BY_ENTITY_ID]: state => ({ entityId, dashboardId }) => {
      return Object.values(state.meta).filter(meta => {
        if (meta.metaType == 'Mi2\\Workspace\\Models\\EntityActionPerformed' &&
          meta.entityId == entityId &&
          meta.dashboardId == dashboardId) {
          return meta
        }
      })
    },

    [GET_ATTACHMENTS_BY_ENTITY_ID]: state => ({ entityId, dashboardId }) => {
      return Object.values(state.meta).filter(meta => {
        if (meta.metaType == 'Mi2\\Workspace\\Models\\EntityAttachment' &&
          meta.entityId == entityId &&
          meta.dashboardId == dashboardId) {
          return meta
        }
      })
    },

    [GET_COORDINATORS_BY_ENTITY_ID]: state => ({ entityId, dashboardId }) => {
      return Object.values(state.meta).filter(meta => {
        if (meta.metaType == 'Mi2\\Workspace\\Models\\EntityCoordinator' &&
          meta.entityId == entityId &&
          meta.dashboardId == dashboardId) {
          return meta
        }
      })
    },

    [GET_DASHBOARD_ROWS]: state => dashboardId => {
      return Object.values(state.entities).filter(entity => {
        if (entity.dashboard_id == dashboardId) {
          return entity
        }
      })
    },

    [GET_DASHBOARD_ACTIONS]: state => {
      return Object.values(state.actions)
    },

    [GET_ENTITY_BY_ID]: state => entityId => {
      return state.entities[entityId]
    },

  },
  actions: {

    [CREATE_ENTITY] ({ commit, rootGetters }, { workspaceId, dashboardId, entity, patient, sourceEntityId = null }) {
      // Push a new entity and then update the dashboard entities
      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']
      return new Promise(resolve => {
        createEntity(workspaceId, dashboardId, entity, patient, userMeta, sourceEntityId).then(newEntity => {
          commit(SET_ENTITY, { entityId: newEntity.dashboard_entity_id, entity: newEntity })
          resolve(newEntity)
        })
      })
    },

    [CREATE_DASHBOARD]({ dispatch, commit, rootGetters }, { workspaceId, dashboard }) {

      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']
      createDashboard({ workspaceId, dashboard }, userMeta).then(newDashboard => {
        // Create the dashboard, the entities, and add the dashboard ID to the workspace
        commit(SET_DASHBOARD, { dashboardId: newDashboard.id, dashboard: newDashboard });

        // Dispatch to workspace module to add this dashboard to workspace
        dispatch('workspace/ADD_DASHBOARD_TO_WORKSPACE', { workspaceId, dashboardId: newDashboard.id}, { root: true })
      })
    },

    [SET_DASHBOARD] ({ commit, rootGetters }, { dashboardId, dashboard }) {
      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']

      // Make a POST to server, then update VUEX
      updateDashboard(dashboard, userMeta).then(response => {
        if (response.messages.length > 0) {
          commit(SET_ERROR_MESSAGE, { errorMessage: {
            icon: null,
              iconType: null,
            status: null,
            message: response.messages
          }
          })
        }
        commit(SET_DASHBOARD, { dashboardId, dashboard: response.model })
        return response.model
      })
    },

    [PERFORM_DASHBOARD_ACTION] ({ commit, rootGetters }, { handle, pid, workspaceId, dashboardId, entityId, context = null }) {
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        performAction(userMeta, handle, pid, workspaceId, dashboardId, entityId, context).then(response => {
          if (response.messages.length > 0) {
            commit(SET_ERROR_MESSAGE, {
              errorMessage: new Error(
                response.messages,
                new Icon(response.model.icon, response.model.iconType),
                ""
              )
            })
          }
        })
      }
    },

    /**
     * Fetch a dashboard and all of it's dependencies and commit them to the state
     *
     * @param commit
     * @param dispatch
     * @param rootGetters
     * @param dashboardId
     * @returns {Promise<unknown>}
     */
    [INIT_DASHBOARD] ({ commit, dispatch, rootGetters }, { dashboardId }) {

      // Initialize error message to blank
      commit(SET_ERROR_MESSAGE, { errorMessage: new Error("", new Icon("",""), "") })

      console.log("Fetching Dashboard: " + dashboardId)
      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {

        // Return the promise created by the API
        return new Promise(resolve => {
           initDashboardById(dashboardId, userMeta).then(response => {

            commit(SET_DASHBOARD, { dashboardId: response.dashboard.id, dashboard: response.dashboard })

            commit(SET_DASHBOARD_ACTIONS, { actions: response.actions })

            dispatch('workspace/VUEX_SET_DATA_TYPES', { dataTypes: response.dataTypes }, { root: true })

            Object.values(response.workspaces).forEach(workspace => {
              dispatch('workspace/VUEX_SET_WORKSPACE', { workspaceId: workspace.id, workspace }, { root: true })
            })

            Object.values(response.forms).forEach(form => {
              dispatch('form/VUEX_SET_FORM', { formId: form.id, form }, { root: true })
            })

            // the response contains all the state we need, need to commit lists, forms
            Object.values(response.lists).forEach(list => {
              dispatch('list/VUEX_SET_LIST', { listId: list.id, list: list }, { root: true })
            })

            resolve(response)
          })
        })
      }
    },

    /**
     *
     * Fetch a dashboard from the server given a dashboard ID and commit it to the state
     *
     * @param state
     * @param commit
     * @param rootState
     * @param dashboardId
     * @returns {Promise<unknown>}
     */
    [FETCH_DASHBOARD] ({ commit, dispatch, rootGetters }, { dashboardId }) {
      console.log("Fetching Dashboard: " + dashboardId)
      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {

        // Return the promise created by the API
        return getDashboardById(dashboardId, userMeta).then(dashboard => {

          // We also have to fetch the form identified as the "new entity form"
          dispatch('form/FETCH_FORM', { formId: dashboard.newEntityFormId }, { root: true })

          commit(SET_DASHBOARD, { dashboardId: dashboard.id, dashboard })
        })
      }
    },

    [UPDATE_TEST] ({ rootGetters }, { dashboardId, workspaceId, entityIds, lastUpdateTestDatetime }) {
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        return updateTestEntities(dashboardId, workspaceId, entityIds, lastUpdateTestDatetime, userMeta)
      }
    },

    [FETCH_ENTITIES] ({ commit, rootGetters }, { dashboardId, dashboardFilterEnabled, archivedFilterEnabled, search, filter, paginationOptions }) {
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        return new Promise(resolve => {
          fetchEntities(dashboardId, dashboardFilterEnabled, archivedFilterEnabled, search, filter, paginationOptions, userMeta).then(response => {
            commit(SET_DASHBOARD_ROWS, { entities: response.entities })

            commit(SET_DASHBOARD_META, { meta: response.entityMetaArray })

            // Resolve the outer promise by returning the fetched entities
            resolve(response)

          }).catch(function () {
            alert('there was an error, you may need to log back in')
          })
        })
      }
    },

    [SET_DASHBOARD_META]: ({ commit }, { meta }) => {
      commit(SET_DASHBOARD_META, { meta: meta })
    },

    [SET_ERROR_MESSAGE]: ({ commit }, { errorMessage }) => {
      if (errorMessage == '' || typeof errorMessage == 'undefined') {
        errorMessage = new Error("", null, null)
      }
      commit(SET_ERROR_MESSAGE, { errorMessage: errorMessage })
    },

    /**
     * Push an entity to the server using API
     */
    [PUSH_ENTITY]: ({ commit, rootGetters }, { workspaceId, dashboardId, entityId, entity, patient }) => {
      const userMeta = rootGetters['user/GET_USER_META']

      // Commit eagerly so we have the updated data in the data table right away
      commit(SET_ENTITY, { entityId, entity })

      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        // Make sure to update the dashboardId on the entity itself in case it changed
        entity.dashboard_id = dashboardId
        return new Promise(resolve => {
          updateEntity(workspaceId, dashboardId, entityId, entity, patient, userMeta).then(entity => {
            // If we have an entity on this dashboard, then find it and set it
            commit(SET_ENTITY, { entityId, entity })

            // Let the caller know this AP call is complete
            resolve(entity)
          })
        })
      }
    },

    [ADD_NOTE]: ({ commit, rootGetters }, { workspaceId, dashboardId, entityId, pid, text, coordinatorKey = null }) => {
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        // User the model-builder to combine our parameters into a note model
        const note = newNote(workspaceId, dashboardId, entityId, pid, text, coordinatorKey)

        // Make the API call to create the note
        return new Promise(resolve => {
          createEntityMeta('note', note, userMeta).then(note => {
            commit(SET_META, { metaId: note.id, meta: note })
            resolve(note)
          })
        })
      }
    },

    [DELETE_META]: ({ commit, rootGetters },  { endpoint, metaId, deleteReason }) => {
      const userMeta = rootGetters['user/GET_USER_META']
      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        // Make the API call to create the note
        return new Promise(resolve => {
          deleteEntityMeta(endpoint, metaId, deleteReason, userMeta).then(metaId => {
            commit(DELETE_META, { metaId: metaId })
            resolve(metaId)
          })
        })
      }
    },

    [CREATE_COORDINATOR]: ({ commit, rootGetters }, { workspaceId, dashboardId, entityId, pid = null, jotformId }) => {
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        // User the model-builder to combine our parameters into a note model
        const coordinator = newCoordinator(workspaceId, dashboardId, entityId, pid, jotformId)

        // Make the API call to create the note
        return new Promise(resolve => {
          createEntityMeta('coordinator', coordinator, userMeta).then(coordinator => {
            commit(SET_META, { metaId: coordinator.id, meta: coordinator })
            resolve(coordinator)
          })
        })
      }
    },

    [UPDATE_ATTACHMENT]: ({ commit, rootGetters }, { attachment }) => {
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {

        return new Promise(resolve => {
          updateEntityMeta('attachment', attachment, userMeta).then(meta => {
            if (meta != null) {
              commit(SET_META, { metaId: meta.id, meta })
            } else {
              // Remove the meta from VUEX, but have to use the original attachement.id because
              // meta is null!
              commit(DELETE_META, { metaId: attachment.id })
            }
            resolve(meta)
          })
        })
      }
    },

    [FETCH_NOTES_BY_ENTITY_ID]: ({ commit, rootGetters }, { entityId, dashboardId }) => {
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        // Return the promise created by the API
        getNotesByEntityId(entityId, dashboardId, userMeta).then(notes => {
          Object.values(notes).forEach(note => {
            commit(SET_NOTE, { noteId: note.id, note })
          })
        }).catch(function () {
          alert('there was an error, you may need to log back in')
        })
      }
    },

    // [SET_ENTITY]: ({ commit }, { dashboardId, entityId, entity }) => {
    //
    // }
    // fetchDashboardRow ({ state, commit }, { dashboardId, rowId }) {
    // TODO we will need this to fetch individual entities when we get updates over websocket
    // },
  },
  mutations: {

    [SET_ENTITY] (state, { entityId, entity }) {
      let entityToUpdate = state.entities[entityId]
      if (entityToUpdate == undefined) {
        Vue.set(state.entities, entityId, entity)
      } else {
        let toSave = {
          ...entityToUpdate,
          ...entity
        }
        Vue.set(state.entities, entityId, toSave)
      }
    },

    [SET_ERROR_MESSAGE] (state, { errorMessage }) {
      Vue.set(state, "errorMessage", errorMessage)
    },

    [SET_META] (state, { metaId, meta }) {
      Vue.set(state.meta, metaId, meta)
    },

    [DELETE_META] (state, { metaId }) {
      // Set deletedDate to a non-null
      state.meta[metaId].deletedDate = "1"
      const deleted = state.meta[metaId]
      Vue.set(state.meta, metaId, deleted)
    },

    // Dashboard Builder Mutations
    [SET_DASHBOARD] (state, { dashboardId, dashboard }) {
      Vue.set(state.dashboards, dashboardId, dashboard)
    },

    [SET_DASHBOARD_ACTIONS] (state, { actions }) {
      Vue.set(state, 'actions', actions)
    },

    [SET_DASHBOARD_META] (state, { meta }) {
      // TODO this may not be efficient, cloning the entire entity state every time we set entities
      Vue.set(state, 'meta', meta)
    },

    [SET_DASHBOARD_ROWS] (state, { entities }) {
      // TODO this may not be efficient, cloning the entire entity state every time we set entities
      Vue.set(state, 'entities', entities)
    }
  },

}
