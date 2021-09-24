import { ALL_LISTS, GET_LIST } from '../types-list'
// import axios from 'axios'

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
            text: 'Michael',
          },
        ],
      }
    },
  },
  getters: {
    [GET_LIST]: state => id => state.lists[id],

    [ALL_LISTS]: state => state.lists
  },
  actions: {},
  mutations: {}
}


