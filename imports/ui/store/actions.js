export default {
  updateLang({ commit }, value) {
    value = value || "en";
    commit("UPDATE_LANG", value);
  },
  UPDATE_LANG(state, value) {
    state.lang = value;
  },
};
