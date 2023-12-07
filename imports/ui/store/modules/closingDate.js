import moment from 'moment'

export default {
  state: {
    date: moment().endOf('day').toDate(),
  },
  getters: {
    closingDate(state) {
      return state.date
    },
  },
  mutations: {
    SET_DATE(state, value) {
      state.date = value
    },
  },
  actions: {
    updateClosingDate({ commit }, branchId) {
      return new Promise((resolve, reject) => {
        Meteor.apply(
          'app.findClosingDateByBranch',
          [{ branchId }],
          (err, res) => {
            if (err) {
              reject(err)
            } else {
              commit('SET_DATE', res['closingDate'])
              resolve(res)
            }
          }
        )
      })
    },
  },
}
