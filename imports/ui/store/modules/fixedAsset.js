import { Meteor } from 'meteor/meteor'

export default {
  namespaced: true,
  state: {
    assetTypes: [],
    selector: {},
    query: {},
  },
  getters: {},
  mutations: {
    SET_ASSET_TYPES(state, value) {
      state.assetTypes = value
    },
    SET_SELECTOR(state, value) {
      state.selector = value
    },
    SET_QUERY(state, value) {
      state.query = value
    },
  },
  actions: {
    getAssetTypeDataTable({ commit }, { selector, query }) {
      return new Promise((resolve, reject) => {
        Meteor.call(
          'app.getAssetTypeDataTable',
          { selector, query },
          (err, res) => {
            if (res) {
              commit('SET_ASSET_TYPES', res['data'])
              resolve(res)
            } else if (err) {
              reject(err)
            }
          }
        )
      })
    },
    updateAssetType({ dispatch, state }, { doc, reload = false }) {
      return new Promise((resolve, reject) => {
        Meteor.call('app.updateAssetType', doc, (err, res) => {
          if (res) {
            if (reload)
              dispatch('getAssetTypeDataTable', {
                selector: state['selector'],
                query: state['query'],
              })
            resolve(res)
          } else if (err) {
            reject(err)
          }
        })
      })
    },
    updateFilter({ commit }, { selector, query }) {
      commit('SET_SELECTOR', selector)
      commit('SET_QUERY', query)
    },
  },
}
