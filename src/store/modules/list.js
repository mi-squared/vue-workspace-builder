import {
  ALL_LISTS,
  GET_LIST,
  SET_LIST,
  FETCH_LISTS_WITH_DATA_BULK,
  FETCH_ALL_LISTS,
  GET_LIST_SELECT_ITEMS
} from '../types-list'
import { fetchAllLists, fetchListsWithDataBulk } from '../../api'
import Vue from 'vue'

export const list = {
  namespaced: true,
  state: {
    lists: {},
  },
  getters: {
    [GET_LIST]: state => id => state.lists[id],

    [ALL_LISTS]: state => state.lists,

    /**
     * Build an items list for a vuetify select input using the lists in vuex, need
     * to map the title/id onto text/value
     *
     * @param state
     * @returns {{text: *, value: *}[]}
     */
    [GET_LIST_SELECT_ITEMS]: state => {
      const lists = Object.values(state.lists)
      return lists.map(l => {
        return {
          text: l.title,
          value: l.id
        }
      })
    }
  },
  actions: {

    /**
     * Fetches all lists without the option data
     *
     * @param commit
     * @param rootGetters
     */
    [FETCH_ALL_LISTS]: ({ commit, rootGetters }) => {
      const userMeta = rootGetters['user/GET_USER_META']
      fetchAllLists(userMeta).then(lists => {
        Object.values(lists).forEach(list => {
          commit(SET_LIST, { listId: list.id, list: list })
        })
      })
    },

    /**
     * Fetches lists with data given an array of list IDs
     *
     * @param commit
     * @param rootGetters
     * @param arrayOfListIds
     */
    [FETCH_LISTS_WITH_DATA_BULK]: ({ commit, getters, rootGetters }, { arrayOfListIds }) => {
      const userMeta = rootGetters['user/GET_USER_META']
      return new Promise(resolve => {
        fetchListsWithDataBulk(arrayOfListIds, userMeta).then(lists => {
          Object.values(lists).forEach(list => {
            commit(SET_LIST, { listId: list.id, list: list })
          })

          const allLists = getters.ALL_LISTS
          resolve(allLists)

        })
      })
    }
  },
  mutations: {
    [SET_LIST] (state, { listId, list }) {
      Vue.set(state.lists, listId, list)
    },
  }
}


