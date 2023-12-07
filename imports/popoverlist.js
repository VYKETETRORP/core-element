import { Meteor } from "meteor/meteor";

//------ Module -----
//imports/ui/popOverButton.js
import popOverButton from "/imports/ui/popOverButton.js";
let popOverList = popOverButton.sort((a, b) => (a.index > b.index ? 1 : -1));
export default popOverList;
// let sidebarMenu = []
// let reportMenu = []
// let toolMenu = []

// Dev mode
// if (Meteor.isDevelopment) {
//   sidebarMenu = sidebarMenu.concat(sampleSidebarMenu)
//   reportMenu = reportMenu.concat(sampleReportMenu)
// }
// sidebarMenu = sidebarMenu.concat(appSidebarMenu)
// reportMenu = reportMenu.concat(appReportMenu)
// toolMenu = toolMenu.concat(appToolMenu)

// export { sidebarMenu, reportMenu, toolMenu }
