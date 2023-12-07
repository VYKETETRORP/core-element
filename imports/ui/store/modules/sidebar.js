import { Session } from 'meteor/session'
export default {
  namespaced: true,
  state: {
    isCollapse: false,
    activeParent: Session.get('activeParentMenu') || null,
    activeChildIndex: Session.get('activeChildMenuIndex') || null,
  },
  getters: {
    isCollapse: (state) => state.isCollapse,
    activeParent: (state) => state.activeParent,
    activeChildIndex: (state) => state.activeChildIndex,
  },
  mutations: {
    COLLAPSE_SIDEBAR(state, isCollapse = false) {
      state.isCollapse = isCollapse
    },
    SET_ACTIVE_PARENT(state, menu = null) {
      Session.setAuth('activeParentMenu', menu)
      state.activeParent = menu
    },
    SET_ACTIVE_CHILD_INDEX(state, index = null) {
      // Format index value
      index = typeof index == 'number' ? index.toString() : index

      // Set value
      Session.setAuth('activeChildMenuIndex', index)
      state.activeChildIndex = index
    },
  },
  actions: {
    collapseSidebar({ commit }, isCollapse) {
      commit('COLLAPSE_SIDEBAR', isCollapse)
    },
    setActiveParent({ commit }, menu) {
      commit('SET_ACTIVE_PARENT', menu)
    },
    setActiveChildIndex({ commit }, index) {
      commit('SET_ACTIVE_CHILD_INDEX', index)
    },
  },
}
