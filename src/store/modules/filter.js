import { ALL_FILTERS, GET_FILTER } from '../types-filter'
// import axios from 'axios'

export const filter = {
  namespaced: true,
  state: {
    filters: {
      199: {
        id: 199,
        title: 'Column 1 condition',
        logical_operator: 'AND',
        conditions: [
          {
            description: 'Column one greater than 10',
            field: 'column1',
            operator: '>',
            parameter: {
              type: 'const',
              value: '10'
            }
          },
          {
            description: 'Column one less than 20',
            field: 'column1',
            operator: '<',
            parameter: {
              type: 'const',
              value: '20'
            }
          },
          {
            description: 'Column one not equal column two',
            field: 'column1',
            operator: '!=',
            parameter: {
              type: 'field',
              value: 'column2'
            }
          },
        ]
      }
    }
  },
  getters: {
    [ALL_FILTERS]: state => state.filters,

    [GET_FILTER]: state => id => state.filters[id]
  },
  actions: {},
  mutations: {}
}
