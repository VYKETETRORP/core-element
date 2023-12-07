import { Session } from 'meteor/session'
import router from '/imports/router'

export default {
  UPDATE_ALLOWED_MODULES(state, value) {
    state.allowedModules = value
  },
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
    localStorage.removeItem('vuex')
    router.push({ path: '/login' })
  },
  UPDATE_NUMERIC_MASK(state, value) {
    if (value && value.setting)
      state.numericMask.digits = value.setting.decimalNumber
  },
  UPDATE_LANG(state, value) {
    state.lang = value
  },
  UPDATE_EXCHANGE(state, value) {
    state.exchange = value
  }
}
