import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "./layouts/MainLayout.vue";
import Dashboard from "./pages/Dashboard.vue";
import Profile from "./pages/admin-setting/Profile.vue";
import User from "./pages/admin-setting/User.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "/",
          redirect: {
            name: "Dashboard",
          },
        },
        {
          path: "/dashboard",
          name: "Dashboard",
          component: Dashboard,
        },
        {
          path: "/profile",
          name: "Profile",
          component: Profile,
        },
        {
          path: "/user",
          name: "User",
          component: User,
        },
      ],
    },
  ],
});
