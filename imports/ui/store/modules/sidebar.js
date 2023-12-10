export default {
  namespaced: true,
  state: {
    isCollapse: false,
    activeParent: null,
    activeChildIndex: null,
  },
  getters: {
    isCollapse: (state) => state.isCollapse,
  },
  mutations: {
    COLLAPSE_SIDEBAR(state, isCollapse = false) {
      state.isCollapse = isCollapse;
    },
    SET_ACTIVE_PARENT(state, menu) {
      state.activeParent = menu;
    },
    SET_ACTIVE_CHILD_INDEX(state, index = null) {
      // Format index value
      index = typeof index == "number" ? index.toString() : index;

      // Set value
      state.activeChildIndex = index;
    },
  },
  actions: {
    collapseSidebar({ commit }, isCollapse) {
      commit("COLLAPSE_SIDEBAR", isCollapse);
    },
    setActiveParent({ commit }, menu) {
      commit("SET_ACTIVE_PARENT", menu);
    },
    setActiveChildIndex({ commit }, index) {
      commit("SET_ACTIVE_CHILD_INDEX", index);
    },
  },
};
