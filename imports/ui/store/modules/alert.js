import { EJSON } from 'meteor/ejson'
import _ from 'lodash'

import {
  ElNotification as Notification,
  ElMessageBox as MessageBox,
  ElMessage as Message,
} from 'element-plus'

export default {
  state: {
    opts: { visible: false, title: '' },
  },
  getters: {},
  mutations: {
    SET_ALERT(state, opts) {
      state.opts = opts
    },
  },
  actions: {
    // Alert
    alert({ commit }, title) {
      let opts = {
        visible: true,
        title,
      }

      commit('SET_ALERT', opts)
    },
    disAlert({ commit }) {
      let opts = {
        visible: false,
        title: '',
      }

      commit('SET_ALERT', opts)
    },
    // Message
    message(context, opts) {
      if (!_.isString(opts.message))
        opts.message = EJSON.stringify(opts.message)
      _.defaults(opts, {
        type: 'success',
        message: 'No message',
        showClose: true,
      })

      Message(opts)
    },
    messageS({ dispatch }, message) {
      let opts = { type: 'success', message }
      dispatch('message', opts)
    },
    messageI({ dispatch }, message) {
      let opts = { type: 'info', message }
      dispatch('message', opts)
    },
    messageW({ dispatch }, message) {
      let opts = { type: 'warning', message }
      dispatch('message', opts)
    },
    messageE({ dispatch }, message) {
      let opts = { type: 'error', message }
      dispatch('message', opts)
    },
    // Notify
    notify(context, opts) {
      _.defaults(opts, {
        message: 'No message!',
        position: 'bottom-right',
      })

      // Check type
      switch (opts.type) {
        case 'success':
          opts.title = 'Success'
          // opts.message = 'Your transaction is success'
          break
        case 'warning':
          opts.title = 'Warning'
          break
        case 'info':
          opts.title = 'Info'
          break
        case 'error':
          opts.title = 'Error'
          // opts.message = 'Your transaction is error'
          break
      }

      Notification(opts)
    },
    // Confirm
    confirm(context, opts) {
      // Message type: delete, exist, empty

      _.defaults(opts, {
        type: 'error',
        title: 'Confirm',
        message: 'No message!',
        showClose: true,
      })
      if (opts.messageType === 'Delete') {
        opts.message = `Are you sure to delete this [${opts.item}]?`
      } else if (opts.messageType === 'Exist') {
        opts.message = `There are duplicate fields  
        [${opts.item}]. Continue?`
      } else if (opts.messageType === 'Empty') {
        opts.message = `There are empty fields  
        [${opts.item}]. Continue?`
      }

      return new Promise((resolve, reject) => {
        MessageBox.confirm(opts.message, opts.title, opts)
          .then(() => {
            resolve('OK')
          })
          .catch(() => {
            reject()
          })
      })
    },
  },
}
