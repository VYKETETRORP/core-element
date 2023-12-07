import moment from 'moment'

export default {
  langUI(state) {
    return state.lang === 'en' ? 'ភាសាខ្មែរ' : 'English'
  },
  userFullName(state) {
    return state.currentUser ? state.currentUser.profile.fullName : 'Unknown'
  },
  allowedModuleOpts(state) {
    return state.allowedModules
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
  userIsInActive(state) {
    let isInActive
    if (state.currentUser) {
      isInActive = true
      if (state.currentUser.profile.status == 'Active') {
        isInActive = false
      }
    }

    return isInActive
  },
  // Company Setting
  companySetting(state) {
    return state.company && state.company.setting
  },
  setting(state) {
    return state.company && state.company.setting
  },
  fiscalDate: (state) => (date, toEndOfDay) => {
    let fiscalDate = state.company && state.company.setting.fiscalDate
    let resultDate = moment(fiscalDate).year(moment(date).format('YYYY'))
    if (toEndOfDay) {
      resultDate.endOf('day')
    } else {
      resultDate.startOf('day')
    }

    return resultDate.toDate()
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
  /**
   * Modules mapping
   */
  alertOpts(state) {
    return state.alert.opts
  },
}
