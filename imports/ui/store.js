import { createStore, useStore as baseUseStore, Store } from "vuex";
//import app from "/store/index.js/index";
import app from "./store/index";

export const store = createStore({
  modules: {
    app,
  },
});
