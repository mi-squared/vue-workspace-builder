import {
  ADD_NOTE,
  ALL_DASHBOARDS,
  CREATE_DASHBOARD, CREATE_ENTITY,
  FETCH_DASHBOARD, FETCH_DASHBOARD_ROWS,
  GET_DASHBOARD,
  GET_DASHBOARD_ROWS, GET_NOTES_BY_ENTITY_ID, PUSH_ENTITY,
  SET_DASHBOARD, SET_DASHBOARD_ROWS, SET_ENTITY, SET_NOTE
} from '../types-dashboard'
import Vue from 'vue'
import {
  createDashboard,
  createEntity,
  fetchDashboardRows,
  getDashboardById,
  updateDashboard,
  updateEntity
} from '../../api'
import { newNote } from '../../model-builder'

export const dashboard = {
  namespaced: true,
  state: {
    dashboards: {},
    entities: {},
    notes: {}
  },
  getters: {
    [ALL_DASHBOARDS]: state => state.dashboards,

    [GET_DASHBOARD]: state => id => {
      return state.dashboards[id]
    },

    [GET_NOTES_BY_ENTITY_ID]: state => entityId => {
      return Object.values(state.notes).filter(note => {
        if (note.entityId == entityId) {
          return note
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

  },
  actions: {

    [CREATE_ENTITY] ({ commit, rootGetters }, { workspaceId, dashboardId, entity }) {
      // Push a new entity and then update the dashboard entities
      // Get meta data from the user module
      const userMeta = rootGetters['user/GET_USER_META']
      return new Promise(resolve => {
        createEntity(workspaceId, dashboardId, entity, userMeta).then(newEntity => {
          commit(SET_ENTITY, { entityId: newEntity.id, entity: newEntity })
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
      updateDashboard(dashboard, userMeta).then(dashboard => {
        commit(SET_DASHBOARD, { dashboardId, dashboard })
        return dashboard
      })
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

    [FETCH_DASHBOARD_ROWS] ({ commit, rootGetters }, { dashboardId }) {
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        // Return the promise created by the API
        return fetchDashboardRows(dashboardId, userMeta).then(entities => {
          commit(SET_DASHBOARD_ROWS, { entities })
        }).catch(function () {
          alert('there was an error, you may need to log back in')
        })
      }
    },

    /**
     * Push an entity to the server using API
     */
    [PUSH_ENTITY]: ({ commit, rootGetters }, { workspaceId, dashboardId, entityId, entity }) => {
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        // Make sure to update the dashboardId on the entity itself in case it changed
        entity.dashboard_id = dashboardId
        updateEntity(workspaceId, dashboardId, entityId, entity, userMeta).then(entity => {
          // If we have an entity on this dashboard, then find it and set it
          commit(SET_ENTITY, { entityId, entity })
        })
      }
    },

    [ADD_NOTE]: ({ commit, rootGetters }, { workspaceId, dashboardId, entityId, pid, text }) => {
      const userMeta = rootGetters['user/GET_USER_META']

      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        const note = newNote(workspaceId, dashboardId, entityId, pid, text)
        commit(SET_NOTE, { noteId: note.id, note })
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

    [SET_NOTE] (state, { noteId, note }) {
      Vue.set(state.notes, noteId, note)
    },

    // Dashboard Builder Mutations
    [SET_DASHBOARD] (state, { dashboardId, dashboard }) {
      Vue.set(state.dashboards, dashboardId, dashboard)
    },

    [SET_DASHBOARD_ROWS] (state, { entities }) {
      // TODO this may not be efficient, cloning the entire entity state every time we set entities
      Vue.set(state, 'entities', { ...state.entities, ...entities })
    }
  },

}
