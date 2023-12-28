// import { createApp } from "vue";
// import { VueMeteor } from "vue-meteor-tracker";

// import AppLayout from "./AppLayout.vue";
// import { router } from "./router";

// import plugins from "./plugins";
// Meteor.startup(() => {
//   const app = createApp(AppLayout);
//   app.use(router);
//   plugins(app);
//   app.use(VueMeteor);
//   app.mount("#app");
// });

import { createApp, provide, h, App as Application } from "vue";

import AppLayout from "./AppLayout.vue";

import registerPlugins from "./plugins.js";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { Meteor } from "meteor/meteor";

import { VueMeteor } from "vue-meteor-tracker";
//import { createMetaManager } from 'vue-meta';
import { createMetaManager } from 'vue-meta';

import { router } from "./router";



// Create application
const app: Application = createApp({
  // setup() {
  //   provide(DefaultApolloClient, apolloClient)
  // },
  
  render() {
    return h(AppLayout);
  },
});

app.use(VueMeteor);
app.use(router);
//app.use(createMetaManager());

registerPlugins(app);
app.mount("#app");

/**
 * Navigation Guards
 **/

//router.beforeEach((to, from, next) => {
//  const isPublic = to.matched.some((record) => record.meta.public);

//  if (isPublic) {
//    next();
//  } else {
//    if (Meteor.userId()) {
//      next();
//    } else {
//      next("/login");
//    }
//  }
//});
