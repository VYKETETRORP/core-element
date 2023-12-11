import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
/* style */
import "/imports/ui/styles/main.scss";
import notify from "./plugins/notify";
import { store } from "./store";
import { App as Application } from 'vue'


//lang
import i18n from "../i18n.js";
//import { store } from "/imports/ui/store/index.js";
//import { plugin as vueMetaPlugin } from 'vue-meta'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default (app:Application) => {
  app.use(ElementPlus);
  app.use(notify);
  app.use(store);
  app.use(i18n);
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) 
    app.component(key, component)

};
