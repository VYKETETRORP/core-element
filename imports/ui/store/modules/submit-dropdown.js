export default {
  namespaced: true,

  state: {
    lastClickedOpts: {}
  },
  // getters: {},
  mutations: {
    SET_LAST_CLICKED_OPTS(state, { value, componentName }) {
      state.lastClickedOpts[componentName] = value;
    }
  },
  actions: {
    updateLastClickedOpts({ commit }, { value, componentName }) {
      commit("SET_LAST_CLICKED_OPTS", { value, componentName });
    },
  }
};
