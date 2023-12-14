<template>
  <div>
    <el-row :gutter="16">
      <el-col :xs="8" :sm="7" :md="5">
        <el-card shadow="never" class="card-overflow kh-battambang">
          <!-- Item Table -->
          <el-menu :default-active="activeCom" class="menu-setting">
            <template v-for="(menu, key) in menuItems" :key="key">
              <!-- :key="menu.title" -->
              <el-menu-item :index="menu.component" @click="handleSelect(menu)">
                <!-- :disabled="menu.roles ? !$userIsInRole(menu.roles) : false" -->
                <i :class="`${menu.icon}`" />
                <span class="menu-setting-title">
                  <!-- {{ menu.title }} -->
                  {{ $t(`app.admin-setting.${menu.title}`) }}
                </span>
              </el-menu-item>
            </template>
          </el-menu>
        </el-card>
      </el-col>

      <el-col :xs="16" :sm="17" :md="19">
        <el-card shadow="never" class="card-overflow">
          <template #header>
            <div class="header">
              <span>
                <!-- <i
                  v-if="comIcon"
                  :class="comIcon"
                /> -->
                <!-- {{ comTitle }} -->
                {{ $t(`app.admin-setting.${comTitle}`) }}
              </span>
            </div>
          </template>

          <!-- Dynamic Component -->
          <!-- <keep-alive> -->
          <component :is="activeCom" :parent-prop="parentProp" />
          <!-- </keep-alive> -->
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import _ from "lodash";

import UserProfile from "./Profile.vue";

// Component
import { ElCard, ElRow, ElCol, ElMenu, ElMenuItem } from "element-plus";
import User from "./User.vue";

export default {
  name: "AdminSetting",
  components: {
    [ElCard.name]: ElCard,
    [ElRow.name]: ElRow,
    [ElCol.name]: ElCol,
    [ElMenu.name]: ElMenu,
    [ElMenuItem.name]: ElMenuItem,
    UserProfile,
    User,

    //RoleGroup,
    RoleGroup: defineAsyncComponent(() => import("./RoleGroup.vue")),
    //RoleGroup: defineAsyncComponent(() => import("./RoleGroup")),

    //Modules: defineAsyncComponent(() => import("./ModuleForm")),
    //Exchange: defineAsyncComponent(() => import("./Exchange")),
  },
  data() {
    return {
      activeCom: "UserProfile",
      comTitle: "Profile",
      comIcon: "fal fa-user-circle",
      menuItems: [
        {
          title: "Profile",
          icon: "fal fa-user-circle",
          component: "UserProfile",
        },

        {
          title: "Modules",
          icon: "fal fa-sitemap",
          component: "Modules",
          roles: ["super"],
        },
        {
          title: "Company",
          icon: "fal fa-building",
          component: "Company",
          roles: ["admin-setting"],
        },
        {
          title: "Branch",
          icon: "fal fa-code-branch",
          component: "Branch",
          roles: ["admin-setting"],
        },
        {
          title: "Exchange",
          icon: "fal fa-exchange-alt",
          component: "Exchange",
          roles: ["exchange"],
        },
        {
          title: "Group",
          icon: "fal fa-layer-group",
          component: "RoleGroup",
          roles: ["group-user"],
        },
        {
          title: "User",
          icon: "fal fa-users",
          component: "User",
          roles: ["user"],
        },
        {
          title: "Employee",
          icon: "fal fa-people-carry",
          component: "Employee",
          roles: ["employee"],
        },
        {
          title: "User Mapping",
          icon: "fal fa-user-cog",
          component: "UserAccountMapping",
          roles: ["user-mapping"],
        },
        {
          title: "Location",
          icon: "fal fa-sitemap",
          component: "Location",
          roles: ["location"],
        },
        {
          title: "Closing Date",
          icon: "fal fa-calendar-check",
          component: "ClosingDate",
          roles: ["closing-date"],
        },
        {
          title: "Closing Report",
          icon: "fal fa-newspaper",
          component: "ClosingReport",
          roles: ["closing-report"],
        },
        {
          title: "Data Backup",
          icon: "fal fa-database",
          component: "DataBackup",
          roles: ["admin-setting"],
        },
        {
          title: "Data Import",
          icon: "fal fa-file-import",
          component: "DataImport",
          roles: ["super"],
        },
        {
          title: "Data Reset",
          icon: "fal fa-trash-alt",
          component: "DataReset",
          roles: ["super"],
        },
        {
          title: "Shell Js",
          icon: "fal fa-terminal",
          component: "ShellJs",
          roles: ["super"],
        },
      ],
      parentProp: {},
    };
  },
  created() {
    const activeCom = _.find(this.menuItems, {
      component: this.$route.params.active,
    });
    if (activeCom) {
      this.activeCom = activeCom.component;
      this.comTitle = activeCom.title;
      this.comIcon = activeCom.icon;
    }
  },
  methods: {
    handleSelect(com) {
      // Check parent prop
      if (com.title === "Data Import") {
        this.parentProp = {
          typeOpts: [
            { label: "Employee", value: "Employee" },
            { label: "Location", value: "Location" },
          ],
          defaultType: "Employee",
          sampleFile: "Admin_Import.xlsx",
        };
      } else if (com.title === "Data Reset") {
        this.parentProp.resetType = "Admin";
      }

      this.comTitle = com.title;
      this.comIcon = com.icon;
      this.activeCom = com.component;
    },
  },
};
</script>

<style lang="scss" scoped>
// {
//  /*@import "./imports/ui/styles/setting-menu.scss";*/
//}
@import "../../styles/setting-menu.scss";
</style>
