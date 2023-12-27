// export default {
//   updateLang({ commit }, value) {
//     value = value || "en";
//     commit("UPDATE_LANG", value);
//   },
//   UPDATE_LANG(state, value) {
//     state.lang = value;
//   },
// };
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import { Session } from 'meteor/session'

// import { insertAuditLog } from '/imports/api/auditLogs/methods'

export default {
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
            // insertAuditLog.callPromise({
            //   page: 'In',
            //   title: username,
            //   event: 'LOG',
            //   data: '',
            //   refId: '',
            // })
            Meteor.call(
              // 'app.insertAuditLog',
              // {
              //   page: 'In',
              //   title: username,
              //   event: 'LOG',
              //   data: '',
              //   refId: '',
              // },
              (err, res) => {
                if (res) {
                  return 'Success'
                } else {
                  console.log(err)
                }
              }
            )
            resolve('success')
          }
        }
      )
    })
  },
  logout({ commit, state, dispatch }) {
    // Audit log before logout
    // insertAuditLog
    //   .callPromise({
    //     page: 'Out',
    //     title: state.currentUser.username,
    //     event: 'LOG',
    //     data: '',
    //     refId: '',
    //   })
    //   .then((res) => {
    //     Meteor.logout(() => {
    //       commit('LOGOUT')
    //       // delete all tag view
    //       dispatch('app/tagView/delAllViews', null, { root: true })
    //     })
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })
    Meteor.call(
      // 'app.insertAuditLog',
      // {
      //   page: 'Out',
      //   title: state.currentUser.username,
      //   event: 'LOG',
      //   data: '',
      //   refId: '',
      // },
      (err, res) => {
        if (res) {
          Meteor.logout(() => {
            commit('LOGOUT')
            // delete all tag view

            dispatch('app/tagView/delAllViews', null, { root: true })
            // const router = useRouter();
            // router.push({ name: '/login' });
          })
        } else {
          console.log(err)
        }
      }
    )
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
  loadAllowedModules({ commit }, selector = {}) {
    selector = selector || {}
    return new Promise((resolve, reject) => {
      Meteor.call('app.modules.loadModules', selector, (err, res) => {
        if (res) {
          commit('UPDATE_ALLOWED_MODULES', res && res.length ? res : [])
          resolve(res)
        } else {
          reject(err)
        }
      })
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
  /**
   * Mapping modules
   */
  // Delete tag view
  delView({ dispatch }, viewName) {
    return dispatch('tagView/delView', viewName).then((res) => {
      return res
    })
  },
  currentExchange({ commit, state, dispatch }, currency) {
    if (!currency) {
      let setting = state.company && state.company.setting
      let { baseCurrency } = setting
      currency = baseCurrency
    }
    let selector = { base: currency }
    return new Promise((resolve, reject) => {
      Meteor.call('app.findLastExchange', { selector }, (err, res) => {
        if (err) {
          dispatch('app/messageE', 'Please insert exchange', { root: true })
          reject(err)
        } else {
          commit('UPDATE_EXCHANGE', res)
          resolve(res)
        }
      })
    })
  },
}