import { getNextSeq, setNextSeq } from '/imports/api/lib/nextSequence'

export default {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    getNextSeq({ commit }, { id, defaultVal }) {
      return new Promise((resolve, reject) => {
        getNextSeq
          .callPromise({ id, defaultVal })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            console.log(err)
            reject(err.reason)
          })
      })
    },
    setNextSeq(context, { id, seqVal }) {
      return new Promise((resolve, reject) => {
        setNextSeq
          .callPromise({ id, seqVal })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            console.log(err)
            reject(err.reason)
          })
      })
    },
  },
}
