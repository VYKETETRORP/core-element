import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

// Modules
import sidebar from './modules/sidebar'
import nextSequence from './modules/nextSequence'
import tagView from './modules/tagView'
import lookup from './modules/lookup'
import alert from './modules/alert'
import closingDate from './modules/closingDate'
import chartAccount from './modules/chartAccount'
import requestClosingReport from './modules/requestClosingReport'
import submitDropdown from './modules/submit-dropdown'

import prefix from './modules/prefix'
import fixedAsset from './modules/fixedAsset'
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {
    sidebar,
    nextSequence,
    tagView,
    lookup,
    alert,
    closingDate,
    chartAccount,
    requestClosingReport,
    submitDropdown,
    prefix,
    fixedAsset,
  },
}
