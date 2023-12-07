import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import { Session } from 'meteor/session'
import _ from 'lodash'
import moment from 'moment'

import { insertAuditLog } from '/imports/api/auditLogs/methods'

// Router
import router from '/imports/router'

// Modules
import tagView from './tagView'
import lookup from './lookup'
import nextSequence from './nextSequence'
import alert from './alert'

const main = {
  namespaced: true,
  state: {
    lang: 'en',
    company: Session.get('company'),
    currentUser: Meteor.user() || Session.get('currentUser'),
    allowedBranches: Session.get('allowedBranches') || [],
    currentBranch: Session.get('currentBranch'),
    numericMask: {
      alias: 'numeric',
      radixPoint: '.',
      groupSeparator: ',',
      autoGroup: true,
      digits: 2,
      prefix: '',
      autoUnmask: true,
      inputType: 'number',
      // unmaskAsNumber: true,
    },
  },
  getters: {
    langUI(state) {
      return state.lang === 'en' ? 'ភាសាខ្មែរ' : 'English'
    },
    userFullName(state) {
      return state.currentUser ? state.currentUser.profile.fullName : 'Unknown'
    },
    allowedBranchOpts(state) {
      let opts = []
      if (state.allowedBranches) {
        state.allowedBranches.forEach((doc) => {
          opts.push({
            label: `${doc._id} : ${doc.name}`,
            value: doc._id,
            doc,
          })
        })
      }

      return opts
    },
    currentBranchId(state) {
      return state.currentBranch ? state.currentBranch._id : null
    },
    userExpiryDay(state) {
      let expiryDay
      if (state.currentUser && state.currentUser.profile.expiryDate) {
        expiryDay = moment(state.currentUser.profile.expiryDate).diff(
          moment().startOf('day'),
          'days'
        )
      }

      return expiryDay
    },
    // Company Setting
    companySetting(state) {
      return state.company && state.company.setting
    },
    setting(state) {
      return state.company && state.company.setting
    },
    // Date format setting
    dateFormat(state) {
      let format = state.company
        ? state.company.setting.dateFormat.split(' ')
        : 'DD/MM/YYYY'
      if (format[0] === 'DD/MM/YYYY') {
        return 'DD/MM/YYYY'
      }
    },
    dateTimeFormat(state) {
      let format = state.company
        ? state.company.setting.dateFormat.split(' ')
        : 'DD/MM/YYYY'
      if (format[0] === 'DD/MM/YYYY') {
        return 'DD/MM/YYYY'
      }
    },
  },
  mutations: {
    UPDATE_COMPANY(state, value) {
      Session.setAuth('company', value)
      state.company = value
    },
    UPDATE_CURRENT_USER(state, value) {
      Session.setAuth('currentUser', value)
      state.currentUser = value
    },
    UPDATE_ALLOWED_BRANCHES(state, value) {
      Session.setAuth('allowedBranches', value)
      state.allowedBranches = value
    },
    UPDATE_CURRENT_BRANCH(state, value) {
      Session.setAuth('currentBranch', value)
      state.currentBranch = value
    },
    LOGOUT(state) {
      Session.clearAuth()
      state.currentUser = null
      router.push({ path: '/login' })
    },
    UPDATE_NUMERIC_MASK(state, value) {
      if (value && value.setting)
        state.numericMask.digits = value.setting.decimalNumber
    },
    UPDATE_LANG(state, value) {
      state.lang = value
    },
  },
  actions: {
    updateCompany({ commit, dispatch }, value) {
      commit('UPDATE_COMPANY', value)
      commit('UPDATE_NUMERIC_MASK', value)
      dispatch('updateLang', value && value.setting.lang)
    },
    updateLang({ commit }, value) {
      value = value || 'en'
      commit('UPDATE_LANG', value)
    },
    login({ commit }, formData) {
      return new Promise((resolve, reject) => {
        Meteor.loginWithPassword(
          formData.username,
          formData.password,
          (error) => {
            if (error) {
              reject(error)
            } else {
              commit('UPDATE_CURRENT_USER', Meteor.user())
              // Audit log
              const username = Meteor.user() && Meteor.user().username
              insertAuditLog.callPromise({
                page: 'In',
                title: username,
                event: 'LOG',
                data: '',
                refId: '',
              })
              // .then(res => {
              //   console.log(res);
              // })
              // .catch(err => {
              //   console.log(err)
              // })
              resolve('success')
            }
          }
        )
      })
    },
    logout({ commit, state }) {
      // Audit log before logout
      insertAuditLog
        .callPromise({
          page: 'Out',
          title: state.currentUser.username,
          event: 'LOG',
          data: '',
          refId: '',
        })
        .then((res) => {
          Meteor.logout(() => {
            commit('LOGOUT')
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    loadCurrentUser({ commit }) {
      // See https://forums.meteor.com/t/meteor-userid-returns-an-id-but-meteor-user-returns-undefined/18355/5

      //! Meteor.user() will not be ready right away,
      //! it is reactive so we need to wait for it
      Tracker.autorun(() => {
        if (Meteor.user()) {
          commit('UPDATE_CURRENT_USER', Meteor.user())
        }
      })
    },
    updateAllowedBranches({ commit }, branches) {
      commit('UPDATE_ALLOWED_BRANCHES', branches)
      commit(
        'UPDATE_CURRENT_BRANCH',
        branches && branches.length ? branches[0] : Session.get('currentBranch')
      )
    },
    updateCurrentBranch({ commit }, value) {
      commit('UPDATE_CURRENT_BRANCH', value)
    },
    // Map actions
    delView({ dispatch }, viewName) {
      return dispatch('tagView/delView', viewName).then((res) => {
        return res
      })
    },
  },
  // Modules
  modules: {
    lookup,
    tagView,
  },
}

export default _.merge(main, nextSequence, alert)
