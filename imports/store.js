import { createStore } from "vuex";
import { Session } from "meteor/session";

// Create a new store instance.
export const store = createStore({
  state() {
    return {
      lang: "en",

      currentUser: Meteor.user() || Session.get("currentUser"),
    };
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
});
