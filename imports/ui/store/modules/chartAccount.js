import { Meteor } from 'meteor/meteor'
// Error with throwError(Gitlab)
// import { getChartAccountsDataTable } from '../../../api/chart-accounts/methods'

export default {
  namespaced: true,
  state: {
    chartAccounts: [],
    selector: {},
    query: {},
    accountNature: []
  },
  getters: {},
  mutations: {
    SET_CHART_ACCOUNTS(state, value) {
      state.chartAccounts = value
    },
    SET_SELECTOR(state, value) {
      state.selector = value
    },
    SET_QUERY(state, value) {
      state.query = value
    },
    SET_ACCOUNT_NATURE(state, value) {
      state.accountNature = value
    }
  },
  actions: {
    getChartAccountsDataTable({ commit }, { selector, query, accountNature }) {
      return new Promise((resolve, reject) => {

        accountNature = accountNature || []
        Meteor.call('app.getChartAccountsDataTable', { selector, query, accountNature }, (err, res) => {
          if (res) {
            commit('SET_CHART_ACCOUNTS', res['data'])
            resolve(res)
          } else if (err) {
            reject(err)
          }
        })
      })
    },
    updateChartAccount({ dispatch, state }, { doc, reload = false }) {
      return new Promise((resolve, reject) => {
        Meteor.call('app.updateChartAccount', doc, (err, res) => {
          if (res) {
            if (reload)
              dispatch('getChartAccountsDataTable', { selector: state['selector'], query: state['query'], accountNature: state['accountNature'] })
            resolve(res)
          } else if (err) {
            reject(err)
          }
        })
      })
    },
    updateFilter({ commit }, { selector, query, accountNature }) {
      commit('SET_SELECTOR', selector)
      commit('SET_QUERY', query)
      commit('SET_ACCOUNT_NATURE', accountNature)
    }
  },
}
