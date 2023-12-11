//export default {
//  namespaced: true,
//  state: {
//    linkActive: {},
//  },
//  mutations: {
//    SET_LINK_ACTIVE(state, name) {
//      if (name) {
//        state.linkActive = {
//          [name]: true,
//        };
//      } else {
//        state.linkActive = {};
//      }
//    },
//  },
//  actions: {
//    setLinkActive({ commit }, name) {
//      commit("SET_LINK_ACTIVE", name);
//    },
//  },
//};
//import router from "/imports/router";
//import router from ".../router";

const homeView = {
  path: "/",
  name: "Dashboard",
  meta: {
    title: "Dashboard",
    icon: "fas fa-tachometer-alt",
    noCache: true,
    affix: true,
  },
};

export default {
  namespaced: true,
  state: {
    linkActive: {},
    visitedViews: [homeView],
    maxCache: 10,
  },
  getters: {
    cachedViews(state) {
      return state.visitedViews
        .filter((el) => el.meta?.cacheName || !el.meta?.noCache)
        .map((el) => el.meta?.cacheName || el.name);
    },
  },
  mutations: {
    MAKE_LINK_ACTIVE(state, name) {
      if (name) {
        state.linkActive = {
          [name]: true,
        };
      } else {
        state.linkActive = {};
      }
    },
    ADD_VISITED_VIEW: (state, view) => {
      if (state.visitedViews.some((v) => v.path === view.path)) return false;
      state.visitedViews.push(view);
    },
    DEL_VISITED_VIEW: (state, view) => {
      const index = state.visitedViews.findIndex((el) => el.path == view.path);
      if (index >= 0) {
        state.visitedViews.splice(index, 1);
      }
    },
    DEL_OTHERS_VISITED_VIEWS: (state, view) => {
      state.visitedViews = state.visitedViews.filter((v) => {
        return v.meta.affix || v.path === view.path;
      });
    },
    DEL_ALL_VISITED_VIEWS: (state) => {
      state.visitedViews = [homeView];
    },
    UPDATE_VISITED_VIEW: (state, view) => {
      for (let v of state.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view);
          break;
        }
      }
    },
  },
  actions: {
    makeLinkActive({ commit }, name) {
      commit("MAKE_LINK_ACTIVE", name);
    },
    addView({ commit }, view) {
      commit("ADD_VISITED_VIEW", view);
    },
    delView({ commit, state }, view) {
      let route = view || router?.currentRoute?.value;

      return new Promise((resolve) => {
        commit("DEL_VISITED_VIEW", route);
        resolve({
          visitedViews: [...state.visitedViews],
        });
      });
    },
    delOthersViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit("DEL_OTHERS_VISITED_VIEWS", view);
        resolve({
          visitedViews: [...state.visitedViews],
        });
      });
    },
    delAllViews({ commit, state }) {
      return new Promise((resolve) => {
        commit("DEL_ALL_VISITED_VIEWS");
        resolve({
          visitedViews: [...state.visitedViews],
        });
      });
    },
    updateVisitedView({ commit }, view) {
      commit("UPDATE_VISITED_VIEW", view);
    },
    refreshVisitedView({ state }, view) {
      const name = view.meta?.cacheName || view.name;
      const index = state.visitedViews.findIndex((el) => el.name == name);
      if (index >= 0) {
        state.visitedViews[index].meta.cacheKey = state.visitedViews[index].meta
          .cacheKey
          ? state.visitedViews[index].meta.cacheKey + 1
          : 1;
      }
    },
    /**
     * @param {Object} to - ex: {name: '***', query: {***} } or just router path
     * @param {Object} from - ex: {name: '***', query: {***} } or just router path
     **/
    pushRouteFrom({ state }, { to, from }) {
      router.push(to);

      const toRoute = router.resolve(to);
      const index = state.visitedViews.findIndex(
        (el) => el.path == toRoute.path
      );
      if (index >= 0) {
        state.visitedViews[index].meta = {
          ...state.visitedViews[index].meta,
          from,
        };
      } else {
        state.visitedViews.push({
          ...toRoute,
          meta: { ...toRoute.meta, from },
        });
      }
    },
    afterDeleteView({ state }, view) {
      if (router.currentRoute?.value?.path == view.path) {
        // Check if from view still in visitedViews
        if (view?.meta.from) {
          const fromRoute = router.resolve(view.meta.from);
          const index = state.visitedViews.findIndex(
            (el) => el.path == fromRoute.path
          );
          if (index >= 0) {
            router.push(view.meta.from);
            return;
          }
        }

        // Or active latest view
        const latestView = state.visitedViews.slice(-1)[0];
        if (latestView) {
          router.push(latestView);
        } else {
          router.push("/");
        }
      }
    },
  },
};
