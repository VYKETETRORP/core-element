import { createI18n } from "vue-i18n";

//// Element UI
//import enLocale from 'element-plus/lib/locale/lang/en'
//import kmLocale from 'element-plus/lib/locale/lang/km'

// Lang
import enApp from "/imports/ui/lang/en";
import kmApp from "/imports/ui/lang/km";
import enSidebarApp from "/imports/ui/lang/sidebar-en";
import kmSidebarApp from "/imports/ui/lang/sidebar-km";
import enReportApp from "/imports/ui/lang/report-en";
import kmReportApp from "/imports/ui/lang/report-km";
import enBreadcrumbApp from "/imports/ui/lang/breadcrumb-en";
import kmBreadcrumbApp from "/imports/ui/lang/breadcrumb-km";
// Sample

const messages = {
  en: {
    message: "hello",

    app: enApp,
    sidebar: { ...enSidebarApp },
    report: { ...enReportApp },
    breadcrumb: { ...enBreadcrumbApp },
  },
  km: {
    message: "សួស្តី",
    app: kmApp,

    sidebar: { ...kmSidebarApp },
    report: { ...kmReportApp },
    breadcrumb: { ...kmBreadcrumbApp },
  },
};
// Create VueI18n instance with options
const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: "en",
  fallbackLocale: "en",
  messages,
});

export default i18n;
