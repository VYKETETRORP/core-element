/**
 * ================Abbreviation==================
 * https://www.allacronyms.com/receipt/abbreviated
 */
// let prefixes = {
//   Customer:'CM',
//   Customer_Deposit:'CD',
//   Sale_Order:'SO',
//   Invoice:'IN',
//   Cash_Sale:'CS',
//   Receipt:'RP'
// }
import { split } from 'lodash'
import prefixes from '/public/data/corePrefixes'

export default {
  namespaced: true,
  state: {
    prefix: '',
  },
  getters: {},
  mutations: {
    GET_REF_PREFIX(state, value) {
      return (state.prefix = value ? value : '')
    },
  },
  actions: {
    getRefPrefix({ commit }, type) {
      return new Promise((resolve, reject) => {
        let prefix = prefixes[type]
        commit('GET_REF_PREFIX', prefix)
        resolve(prefix)
      })
    },
    setPrefix(context, { value, prefix }) {
      let val = `${prefix}${value}`
      return val
    },
    refPrefix(context, { value, types }) {
      return new Promise((resolve, reject) => {
        // let breakWord
        split(types, '|').forEach((it) => {
          value = value.replaceFirst(`${prefixes[it]}`, '')
        })

        resolve(value)
      })
    },
  },
}
