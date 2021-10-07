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
    lists: {
      abook_type: {
        title: 'Address Book Types',
        id: 'abook_type',
        type: 'list_options',
        data: [],
      },
      AHCCCS_Behavioral_Plan: {
        title: 'AHCCCS Behavioral Plan',
        id: 'AHCCCS_Behavioral_Plan',
        type: 'list_options',
        data: []
      },
      AHCCCS_Physical_Health: {
        title: 'AHCCCS Physical Health',
        id: 'AHCCCS_Physical_Health',
        type: 'list_options',
        data: []
      },
      users: {
        title: 'Users',
        id: 'users',
        type: 'custom',
        data: []
      },
      facilities: {
        title: 'Facilities',
        id: 'facilities',
        type: 'custom',
        data: [
          {
            text: 'Facility 1',
            value: 1
          },
          {
            text: 'Facility 2',
            value: 2
          },
        ]
      },
      administrators: {
        title: 'Administrators',
        id: 'administrators',
        type: 'custom',
        data: [
          {
            value: 1,
            text: 'Ken',
          },
          {
            value: 2,
            text: 'Jason',
          },
          {
            value: 3,
            text: 'Michael',
          },
        ],
      }
    },
  },
  getters: {
    [GET_LIST]: state => id => state.lists[id],

    [ALL_LISTS]: state => state.lists,

    /**
     * Build an items list for a vuetify select input using the lists in vuex, neec
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
    [FETCH_LISTS_WITH_DATA_BULK]: ({ commit, rootGetters }, { arrayOfListIds }) => {
      const userMeta = rootGetters['user/GET_USER_META']
      fetchListsWithDataBulk(arrayOfListIds, userMeta).then(lists => {
        Object.values(lists).forEach(list => {
          commit(SET_LIST, { listId: list.id, list: list })
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


