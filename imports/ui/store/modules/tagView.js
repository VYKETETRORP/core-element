export default {
  namespaced: true,
  state: {
    linkActive: {},
  },
  mutations: {
    SET_LINK_ACTIVE(state, name) {
      if (name) {
        state.linkActive = {
          [name]: true,
        };
      } else {
        state.linkActive = {};
      }
    },
  },
  actions: {
    setLinkActive({ commit }, name) {
      commit("SET_LINK_ACTIVE", name);
    },
  },
};
