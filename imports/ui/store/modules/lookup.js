import { Meteor } from 'meteor/meteor'

export default {
  namespaced: true,
  state: {
    // Local
    dateFormat: [
      { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
      { label: 'YYYY/MM/DD', value: 'YYYY/MM/DD' },
    ],
    lang: [
      { label: 'English', value: 'en' },
      { label: 'ខ្មែរ', value: 'km' },
    ],
    industry: [
      {
        label: 'IT',
        value: 'IT',
      },
      {
        label: 'Wholesale and Retail  Trading',
        value: 'Wholesale and Retail  Trading',
      },
      {
        label: 'Micro Loan',
        value: 'Micro Loan',
      },
      {
        label: 'Rental & Leasing',
        value: 'Rental and Leasing',
      },
      {
        label: 'Other',
        value: 'Other',
      },
    ],
    status: [
      { label: 'Active', value: 'Active' },
      { label: 'Inactive', value: 'Inactive' },
      // { label: 'Void', value: 'Void' },
    ],
    authorizes: [
      { name: 'Request', level: 1, status: 'Requested', color: '#E6A23C' },
      { name: 'Verify', level: 2, status: 'Verified', color: '#67C23A' },
      { name: 'Approve', level: 3, status: 'Approved', color: '#409EFF' },
      { name: 'Reject', level: 4, status: 'Rejected', color: '#F56C6C' },
      // { label: 'Void', value: 'Void' },
    ],
    currency: [
      { label: 'KHR', value: 'KHR' },
      { label: 'USD', value: 'USD' },
      { label: 'THB', value: 'THB' },
    ],
    natureAccount: [
      { label: 'Asset', value: 'Asset' },
      { label: 'Liability', value: 'Liability' },
      { label: 'Equity', value: 'Equity' },
      { label: 'Revenue', value: 'Revenue' },
      { label: 'Expense', value: 'Expense' },
    ],
    // journalType: [
    //   { label: 'General', value: 'General' },
    //   { label: 'Adjustment', value: 'Adjustment' },
    //   { label: 'Depreciation', value: 'Depreciation' },
    //   { label: 'Closing', value: 'Closing' },
    //   { label: 'Opening', value: 'Opening' },
    //   // { label: 'Accrual', value: 'Accrual' },
    // ],
    gender: [
      { label: 'Male', value: 'M' },
      { label: 'Female', value: 'F' },
    ],
    employeeRole: [
      { label: 'Employee', value: 'Employee' },
      { label: 'Collector', value: 'Collector' },
      { label: 'Sale Rep', value: 'SaleRep' },
    ],
    showRow: [
      { label: 'Active', value: 'Active' },
      { label: 'All', value: 'All' },
      // { label: 'Zero', value: 'Zero' },
    ],
    comAnotherPeriod: [
      { label: 'Previous Period (PP)', value: 'PP' },
      { label: 'Previous Year (PY)', value: 'PY' },
      { label: 'Year To Date (YTD)', value: 'YTD' },
    ],
    compareBy: [
      { label: 'Value', value: 'Value' },
      { label: 'Rate', value: 'Rate' },
    ],
    displayColBy: [
      { label: 'Days', value: 'days' },
      // { label: 'Weeks', value: 'weeks' },
      { label: 'Months', value: 'months' },
      // { label: 'Quarters', value: 'quarters' },
      { label: 'Years', value: 'years' },
    ],

    // Remote
    users: [],
    userRole: [],
    modules: [],
    branches: [],
    employees: [],
    accountTypes: [],
    chartAccounts: [],
    journalType: [],
    journalClass: [],
    journalPaymentMethod: [],
    journalNameRefType: [],
    journalName: [],
    journalProduct: [],

    // Location
    locationType: [
      { label: 'Province', value: 'Province' },
      { label: 'District', value: 'District' },
      { label: 'Commune', value: 'Commune' },
      { label: 'Village', value: 'Village' },
    ],
    location: [],
    locationRemote: [],
    shellJs: [],
  },
  getters: {
    allowedBranches(state, getters, rootState, rootGetters) {
      let opts = []
      if (rootState.app.allowedBranches) {
        rootState.app.allowedBranches.forEach((doc) => {
          opts.push({
            label: `${doc._id} : ${doc.name}`,
            value: doc._id,
            doc,
          })
        })
      }

      return opts
    },
  },
  mutations: {
    GET_USER(state, val) {
      state.users = val
    },
    GET_USER_ROLE(state, val) {
      state.userRole = val
    },
    GET_MODULES(state, val) {
      state.modules = val
    },
    GET_BRANCH(state, val) {
      state.branches = val
    },
    GET_EMPLOYEE(state, val) {
      state.employees = val
    },
    GET_ACCOUNT_TYPE(state, val) {
      state.accountTypes = val
    },
    GET_CHART_ACCOUNT(state, val) {
      state.chartAccounts = val
    },
    GET_JOURNAL_TYPE(state, val) {
      state.journalType = val
    },
    GET_JOURNAL_CLASS(state, val) {
      state.journalClass = val
    },
    GET_JOURNAL_PAYMENT_METHOD(state, val) {
      state.journalPaymentMethod = val
    },

    GET_JOURNAL_NAME_REF_TYPE(state, val) {
      state.journalNameRefType = val
    },
    GET_JOURNAL_NAME(state, val) {
      state.journalName = val
    },
    GET_JOURNAL_PRODUCT(state, val) {
      state.journalProduct = val
    },
    GET_LOCATION(state, val) {
      state.location = val
    },
    GET_LOCATION_REMOTE(state, val) {
      state.locationRemote = val
    },
    GET_SHELL_JS(state, val) {
      state.shellJs = val
    },
  },
  actions: {
    getUser({ commit }, selector) {
      selector = selector || {}

      return new Promise((resolve, reject) => {
        Meteor.call('app.lookupUser', { selector }, (err, res) => {
          if (res) {
            commit('GET_USER', res)
            resolve(res)
          } else {
            reject(err)
          }
        })
      })
    },
    getUserRole({ commit }, selector) {
      selector = selector || {}

      return new Promise((resolve, reject) => {
        Meteor.call('app.lookupRole', { selector }, (err, res) => {
          if (res) {
            commit('GET_USER_ROLE', res)
            resolve(res)
          } else {
            reject(err)
          }
        })
      })
    },
    getModules({ commit }, selector) {
      selector = selector || {}

      return new Promise((resolve, reject) => {
        Meteor.call('app.lookupModules', { selector }, (err, res) => {
          if (res) {
            commit('GET_MODULES', res)
            resolve(res)
          } else {
            reject(err)
          }
        })
      })
    },
    getBranch({ commit }, selector) {
      selector = selector || {}

      return new Promise((resolve, reject) => {
        Meteor.call('app.lookupBranch', { selector }, (err, res) => {
          if (res) {
            commit('GET_BRANCH', res)
            resolve(res)
          } else {
            reject(err)
          }
        })
      })
    },
    getEmployee({ commit }, selector) {
      selector = selector || {}

      //const currentUser = Meteor.users.findOne({ _id: Meteor.userId() })

      return new Promise((resolve, reject) => {
        Meteor.call('app.lookupEmployee', { selector }, (err, res) => {
          if (res) {
            commit('GET_EMPLOYEE', res)
            resolve(res)
          } else {
            reject(err)
          }
        })
      })
    },
    getAccountType({ commit }, selector) {
      selector = selector || {}

      return new Promise((resolve, reject) => {
        Meteor.call('app.lookupAccountType', { selector }, (err, res) => {
          if (res) {
            commit('GET_ACCOUNT_TYPE', res)
            resolve(res)
          } else {
            reject(err)
          }
        })
      })
    },
    getChartAccount({ commit }, selector) {
      selector = selector || {}

      return new Promise((resolve, reject) => {
        Meteor.call('app.lookupChartAccount', { selector }, (err, res) => {
          if (res) {
            commit('GET_CHART_ACCOUNT', res)
            resolve(res)
          } else {
            reject(err)
          }
        })
      })
    },
    getRemoteChartAccount({ commit }, { chartAccSelector, accTypeSelector }) {
      chartAccSelector = chartAccSelector || {}
      accTypeSelector = accTypeSelector || {}

      return new Promise((resolve, reject) => {
        Meteor.call(
          'app.lookupRemoteChartAccount',
          { chartAccSelector, accTypeSelector },
          (err, res) => {
            if (res) {
              commit('GET_CHART_ACCOUNT', res)
              resolve(res)
            } else {
              reject(err)
            }
          }
        )
      })
    },
    getJournalType({ commit }, { selector, opts }) {
      selector = selector || {}
      opts = opts || {}

      return new Promise((resolve, reject) => {
        Meteor.call('app.lookupJournalType', { selector, opts }, (err, res) => {
          if (res) {
            commit('GET_JOURNAL_TYPE', res)
            resolve(res)
          } else {
            reject(err)
          }
        })
      })
    },
    getJournalClass({ commit }, { selector, opts }) {
      selector = selector || {}
      opts = opts || {}

      return new Promise((resolve, reject) => {
        Meteor.call(
          'app.lookupJournalClass',
          { selector, opts },
          (err, res) => {
            if (res) {
              commit('GET_JOURNAL_CLASS', res)
              resolve(res)
            } else {
              reject(err)
            }
          }
        )
      })
    },
    getPaymentMethod({ commit }, { selector, opts }) {
      selector = selector || {}
      opts = opts || {}

      return new Promise((resolve, reject) => {
        Meteor.call(
          'app.lookupPaymentMethod',
          { selector, opts },
          (err, res) => {
            if (res) {
              commit('GET_JOURNAL_PAYMENT_METHOD', res)
              resolve(res)
            } else {
              reject(err)
            }
          }
        )
      })
    },
    getJournalNameRefType({ commit }, { selector }) {
      selector = selector || {}

      return new Promise((resolve, reject) => {
        Meteor.call(
          'app.lookupJournalNameRefType',
          { selector },
          (err, res) => {
            if (res) {
              commit('GET_JOURNAL_NAME_REF_TYPE', res)
              resolve(res)
            } else {
              reject(err)
            }
          }
        )
      })
    },
    getJournalName({ commit }, { selector }) {
      selector = selector || {}

      return new Promise((resolve, reject) => {
        Meteor.call('app.lookupJournalName', { selector }, (err, res) => {
          if (res) {
            commit('GET_JOURNAL_NAME', res)
            resolve(res)
          } else {
            reject(err)
          }
        })
      })
    },
    getRemoteJournalName({ commit }, selector) {
      selector = selector || {}

      return new Promise((resolve, reject) => {
        Meteor.call('app.lookupRemoteJournalName', { selector }, (err, res) => {
          if (res) {
            commit('GET_JOURNAL_NAME', res)
            resolve(res)
          } else {
            reject(err)
          }
        })
      })
    },
    getJournalProduct({ commit }, { selector }) {
      selector = selector || {}

      return new Promise((resolve, reject) => {
        Meteor.call('app.lookupJournalProduct', { selector }, (err, res) => {
          if (res) {
            commit('GET_JOURNAL_PRODUCT', res)
            resolve(res)
          } else {
            reject(err)
          }
        })
      })
    },
    getRemoteJournalProducts({ commit }, { selector }) {
      selector = selector || {}

      return new Promise((resolve, reject) => {
        Meteor.call(
          'app.lookupRemoteJournalProducts',
          { selector },
          (err, res) => {
            if (res) {
              commit('GET_JOURNAL_PRODUCT', res)
              resolve(res)
            } else {
              reject(err)
            }
          }
        )
      })
    },
    getRemoteJournalProduct({ commit }, selector) {
      selector = selector || {}

      return new Promise((resolve, reject) => {
        Meteor.call(
          'app.lookupRemoteJournalProduct',
          { selector },
          (err, res) => {
            if (res) {
              commit('GET_JOURNAL_PRODUCT', res)
              resolve(res)
            } else {
              reject(err)
            }
          }
        )
      })
    },
    getLocation({ commit }, selector) {
      selector = selector || {}

      return new Promise((resolve, reject) => {
        Meteor.call('app.lookupLocation', { selector }, (err, res) => {
          if (res) {
            commit('GET_LOCATION', res)
            resolve(res)
          } else {
            reject(err)
          }
        })
      })
    },
    getLocationRemote({ commit }, { _id, type, query }) {
      return new Promise((resolve, reject) => {
        Meteor.call(
          'app.lookupLocationRemote',
          { _id, type, query },
          (err, res) => {
            if (res) {
              commit('GET_LOCATION_REMOTE', res)
              resolve(res)
            } else {
              reject(err)
            }
          }
        )
      })
    },
    getShellJs({ commit }, selector) {
      selector = selector || {}

      return new Promise((resolve, reject) => {
        Meteor.call('app.lookupShellJs', { selector }, (err, res) => {
          if (res) {
            commit('GET_SHELL_JS', res)
            resolve(res)
          } else {
            reject(err)
          }
        })
      })
    },
  },
}