import state from "./state";
import mutations from "./mutations";
import actions from "./actions";

// modules
import sidebar from "./modules/sidebar";
import tagView from "./modules/tagView";
import alert from './modules/alert'
import lookup from "./modules/lookup"

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  modules: {
    sidebar,
    tagView,
    lookup,
    alert,
  },
};
