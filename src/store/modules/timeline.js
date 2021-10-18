import { GET_TIMELINE_FOR_PATIENT, SET_TIMELINE } from '../types-timeline'
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
    }
  },
  mutations: {
    [SET_TIMELINE]: (state, { timeline }) => {
      Vue.set(state, 'timeline', timeline)
    }
  }
}
