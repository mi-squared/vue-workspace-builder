import { GET_TIMELINE_FOR_PATIENT, SET_TIMELINE, SET_TIMELINE_ITEM_ENTITY } from '../types-timeline'
import { fetchTimelineByPid } from '../../api'
import Vue from 'vue'
// import axios from 'axios'

export const timeline = {
  namespaced: true,
  state: {
    timeline: {}
  },
  getters: {
    timeline: state => {
      return Object.values(state.timeline).sort(function (a, b) {
        const diff = new Date(b.entity.created_datetime) - new Date(a.entity.created_datetime)
        return diff
      })
    }
  },
  actions: {
    [GET_TIMELINE_FOR_PATIENT] ({ commit, dispatch, rootGetters }, { pid }) {
      const userMeta = rootGetters['user/GET_USER_META']
      // If we have a token, make the API call
      if (userMeta.csrfToken) {
        return new Promise(resolve => {

          fetchTimelineByPid(pid, userMeta).then(response => {

            commit(SET_TIMELINE, { timeline : response.timeline })

            dispatch('dashboard/SET_DASHBOARD_META', { meta: response.entityMetaArray }, { root: true })

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

            resolve(response.timeline)
          })

        })
      }
    },
    [SET_TIMELINE_ITEM_ENTITY]: ({ commit }, { entityId, dashboardId, entity }) => {
      commit(SET_TIMELINE_ITEM_ENTITY, { entityId, dashboardId, entity })
    }
  },
  mutations: {
    [SET_TIMELINE]: (state, { timeline }) => {
      Vue.set(state, 'timeline', timeline)
    },
    [SET_TIMELINE_ITEM_ENTITY]: (state, { entityId, dashboardId, entity }) => {
      const index = dashboardId + '-' + entityId
      state.timeline[index].entity = {
        ...state.timeline[index].entity,
        ...entity
      }
      const item = state.timeline[index]

      Vue.set(state.timeline, index, item)
    }
  }
}
