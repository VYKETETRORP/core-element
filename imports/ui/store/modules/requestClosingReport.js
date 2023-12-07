import { Meteor } from 'meteor/meteor'

// State
const state = {
  dataList: [],
  requestClosing: null
}

// Mutation
const mutations = {
  SET_DATA_LIST(state, value) {
    state['dataList'] = value
  },
  SET_REQUEST_CLOSING(state, value) {
    state['requestClosing'] = value
  }
}

// Action
const actions = {
  findRequestClosingReport({ commit, dispatch }, { selector, opts }) {
    opts = opts || { $sort: { closingDate: -1 } }
    return new Promise((resolve, reject) => {
      Meteor.call('app.findRequestClosingReport', {
        selector,
        opts
      }, (err, res) => {
        if (err) {
          reject(err)
          dispatch('app/messageE', err, { root: true })
        } else {
          commit('SET_DATA_LIST', res)
          resolve(res)
        }
      })
    })
  },

  findOneById({ commit, dispatch }, _id) {
    return new Promise((resolve, reject) => {
      Meteor.call('app.findOneRequestClosingReportById', { _id }, (err, res) => {
        if (err) {
          reject(err)
          // dispatch('app/messageE', err, { root: true })
        } else {
          commit('SET_REQUEST_CLOSING', res)
          resolve(res)
        }
      })
    })
  },

  findOne({ dispatch }, { selector }) {
    return new Promise((resolve, reject) => {
      Meteor.call('app.findOneRequestClosingReport', { selector }, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
          // dispatch('app/messageE', err, { root: true })
        }
      })
    })
  },

  // 
  checkExist({ dispatch }, { selector, opts }) {
    return new Promise((resolve, reject) => {
      Meteor.call('app.checkExistRequestClosingReport', { selector, opts }, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
          // dispatch('app/messageE', err, { root: true })
        }
      })
    })
  },

  insert({ dispatch, rootState }, { doc, reloadData = false }) {
    return new Promise((resolve, reject) => {
      // Check exist closing date
      let authorizes = rootState.app.lookup.authorizes
      let rejected = authorizes[authorizes.length - 1]['status']
      let selector = {
        closingDate: doc['closingDate'],
        status: { $ne: rejected },
        branchId: doc['branchId']
      }
      dispatch('checkExist', { selector }).then(res => {

        if (res) {
          dispatch('app/messageE', `Closing date is exist!`, { root: true })

          resolve(false)
        } else {
          Meteor.call('app.insertRequestClosingReport', { doc }, (err, res) => {
            if (err) {
              // dispatch('app/messageE', err, { root: true })
              reject(err)
            } else {
              dispatch('app/messageS', `Save success!`, { root: true })

              if (reloadData)
                dispatch('findRequestClosingReport', { selector: { branchId: doc['branchId'] } })
              resolve(res)
            }
          })
        }
      }).catch(err => {
        reject(err)
        // dispatch('app/messageE', err, { root: true })

      })
    })
  },

  update({ dispatch }, { doc, reloadData = false }) {

    return new Promise((resolve, reject) => {
      Meteor.call('app.updateRequestClosingReport', { doc }, (err, res) => {
        if (err) {
          reject(err)
          // dispatch('app/messageE', err, { root: true })
        } else {
          dispatch('app/messageS', `Save success!`, { root: true })
          if (reloadData)
            dispatch('findRequestClosingReport', { selector: { branchId: doc['branchId'] } })
          resolve(res)
        }
      })
    })
  },

  inUpRequestClosingReport({ dispatch }, { doc, reloadData = false }) {
    return new Promise((resolve, reject) => {
      if (doc['_id']) {
        dispatch('update', { doc, reloadData }).then(res => {
          if (res) resolve(res)
        }).catch(err => {
          reject(err)
        })
      } else {
        dispatch('insert', { doc, reloadData }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      }

    })
  },

  remove({ dispatch }, { _id, branchId, reloadData = false }) {
    return new Promise((resolve, reject) => {
      dispatch('app/confirm', {
        title: 'warnning',
        message: 'Are you sure to delete this record?',
      }, { root: true }).then(res => {

        Meteor.call('app.removeRequestClosingReport', { _id }, (err, res) => {
          if (err) {
            reject(err)
          } else {
            dispatch('app/messageS', `Delete success!`, { root: true })

            if (reloadData)
              dispatch('findRequestClosingReport', { selector: { branchId } })
            resolve(res)
          }
        })
      }).catch(err => {
        console.log(err);
        // dispatch('app/messageE', err, { root: true })
        reject(err)
      })

    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}