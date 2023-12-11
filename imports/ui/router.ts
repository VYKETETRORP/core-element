import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "./Home.vue";
import Profile from "./pages/admin-settings/Profile.vue";
import Login from "./pages/Login.vue";
import User from "./pages/admin-settings/User.vue";
import AdminSetting from "./pages/admin-settings/AdminSetting.vue";
import Member from "./pages/Member.vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Dashboard",
    component: Home,
    meta: {
      title: "Dashboard",
    },
  },
  {
    path: "/members",
    name: "Member",
    component: Member,
    meta: {
      title: "Members",
    },
  },
//  {
//    path: "/report",
//    name: "Report",
//    component: Report,
//    meta: {
//      title: "Dashboard",
//    },
//  },
  {
    path: "/admin-setting",
    name: "AdminSetting",
    component: AdminSetting,
    meta: {
      title: "Admin Setting",
      breadcrumb: {
        parent: "Dashboard",
      },
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      title: "Profile",
      linkActive: "AdminSetting",
      breadcrumb: {
        parent: "AdminSetting",
      },
    },
  },
  {
    path: "/user",
    name: "User",
    component: User,
    meta: {
      title: "User",
      linkActive: "AdminSetting",
      breadcrumb: {
        parent: "AdminSetting",
      },
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      layout: "login",
      public: true,
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
