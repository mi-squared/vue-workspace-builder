import { GET_TIMELINE_FOR_PATIENT, SET_TIMELINE, SET_TIMELINE_ITEM_ENTITY } from '../types-timeline'
import { fetchTimelineByPid } from '../../api'
import Vue from 'vue'
// import axios from 'axios'

export const timeline = {
  namespaced: true,
  state: {
    timeline: {
      pid: '',
      notes: {},
      items: [
        {
          entity: {},
          notes: [],
          workspace: {},
          form: {}
        },
      ]
    },
  },
  getters: {
    timeline: state => state.timeline
  },
  actions: {
    [GET_TIMELINE_FOR_PATIENT] ({ commit, dispatch }, { pid }) {
      return new Promise(resolve => {
        dispatch('user/INIT', {}, { root: true }).then(userMeta => {
          fetchTimelineByPid(pid, userMeta).then(timeline => {

            commit(SET_TIMELINE, { timeline })
            resolve(timeline)
          })
        })
      })
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
      const index = state.timeline.items.findIndex(item => {
        if (item.entity.dashboard_entity_id == entityId &&
        item.entity.dashboard_id == dashboardId) {
          return true
        } else {
          return false
        }
      })
      const item = {
        ...state.timeline.items[index],
        entity: entity
      }
      state.timeline.items.splice(index, 1, item)
      Vue.set(state, 'timeline', state.timeline)
    }
  }
}
