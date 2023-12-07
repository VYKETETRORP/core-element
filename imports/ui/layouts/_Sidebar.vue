<template>
  <el-aside :class="['sidebar', isCollapse ? '--mini' : '']">
    <section class="sidebar-header">
      <img
        src="/images/sb-logo-full.png"
        :class="['logo', isCollapse ? 'is-hidden' : '']"
      />

      <img
        src="/images/sb-logo.png"
        :class="{ 'logo-collapse': true, 'is-hidden': !isCollapse }"
      />
    </section>

    <div
      v-if="visiblePopoverNew"
      class="v-modal"
      tabindex="0"
      style="z-index: 2000"
      @click="visiblePopoverNew = !visiblePopoverNew"
    />

    <section
      v-if="newPopover.length"
      :class="['sidebar-new', isCollapse ? 'sidebar-new-mini' : '']"
    >
      <el-popover
        v-model:visible="visiblePopoverNew"
        placement="bottom"
        popper-class="popover-new"
      >
        <el-menu unique-opened :router="false" class="menu-new">
          <template v-for="(doc, key) in newPopover" :key="key">
            <div style="min-width: 220px; margin: 0 4px">
              <div class="title">
                {{ $t(`sidebar.${doc.title}`) }}
              </div>

              <template
                v-for="(item, index) in doc.data"
                :key="`${key}-${index}`"
              >
                <li
                  :index="`${key}-${index}`"
                  class="el-menu-item"
                  @click="handlePopoverClick({ route: item.route })"
                >
                  <span>{{ $t(`${item.label}`) }}</span>
                </li>
              </template>
            </div>
          </template>
        </el-menu>

        <template #reference>
          <el-button
            :class="['button-new', isCollapse ? '--mini' : '']"
            @click="visiblePopoverNew = !visiblePopoverNew"
          >
            <i v-if="isCollapse" class="far fa-plus" />
            <span :class="{ 'is-hidden': isCollapse }">
              {{ $t("sidebar.New") }}
            </span>
          </el-button>
        </template>
      </el-popover>
    </section>

    <section :class="{ 'sidebar-menu': true, 'margin-top': newPopover.length }">
      <el-menu
        :default-active="defaultActive"
        :collapse="isCollapse"
        :unique-opened="true"
        class="menu-vertical"
      >
        <template v-for="(item, index) in sidebarMenuItems" :key="index">
          <!-- Header -->
          <div v-if="item.header" :key="index">
            {{ item.header }}
          </div>

          <!-- Divider -->
          <div v-if="item.divider" :key="index" class="ra-divider" />

          <!-- Has child -->
          <el-popover
            v-if="item.children && (!item.roles || $userIsInRole(item.roles))"
            :key="index"
            placement="right-start"
            width="240"
            trigger="hover"
            class="sidebar-tooltip"
            popper-class="sidebar-popover"
          >
            <!-- Menu with children -->
            <template
              v-for="(child, childIndex) in item.children"
              :key="childIndex"
            >
              <!-- Divider -->
              <div
                v-if="child.divider"
                :key="`${index}-${childIndex}`"
                class="ra-divider light"
              />

              <!-- Child items  -->
              <el-menu-item
                v-if="
                  child.title && (!child.roles || $userIsInRole(child.roles))
                "
                :key="`${index}-${childIndex}`"
                :index="child.route.name + `-${childIndex}`"
                :class="{
                  'is-active':
                    $route.name == child.route.name &&
                    activeChildIndex == childIndex, // use '==' and not '==='
                }"
                @click="
                  handleMenuClick({
                    route: child.route,
                  })
                "
              >
                <span>
                  {{ $t(`sidebar.${child.title}`) }}
                </span>
              </el-menu-item>
            </template>

            <!-- Parent -->
            <template #reference>
              <span>
                <el-menu-item
                  :index="item.route.name + '-index'"
                  :class="{
                    'is-active': checkActiveParentClass(item),
                    'is-parent': true,
                  }"
                  @click="
                    handleMenuClick({
                      route: item.route,
                    })
                  "
                >
                  <div class="icon-wrapper">
                    <i :class="item.icon" />
                  </div>

                  <span>
                    {{ $t(`sidebar.${item.title}`) }}
                  </span>
                </el-menu-item>
              </span>
            </template>
          </el-popover>

          <!-- Menu without sub items -->
          <template v-else-if="item.title">
            <el-menu-item
              v-if="!item.roles || $userIsInRole(item.roles)"
              :key="index"
              :index="item.route.name + '-index'"
              :class="{
                'is-active': !activeParent && $route.name == item.route.name,
              }"
              @click="handleMenuClick({ route: item.route })"
            >
              <div class="icon-wrapper">
                <i :class="`${item.icon}`" />
              </div>

              <template #title>
                <span>
                  {{ getMenuTitle(item) }}
                </span>
              </template>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </section>

    <div :class="{ 'sidebar-footer': true, '--mini': isCollapse }">
      <el-menu default-active="1">
        <el-menu-item index="0">
          <i class="avatar-wrapper">
            <avatar :username="userFullName" :size="40" />
          </i>

          <div class="content">
            <span> {{ userFullName }} </span>

            <span> {{ roleGroupName || "Unknown" }} </span>
          </div>

          <div class="logout-wrapper">
            <span class="logout-btn" @click="logout">
              <i class="fal fa-sign-out-alt" />
            </span>
          </div>
        </el-menu-item>
      </el-menu>
    </div>
  </el-aside>
</template>
<script>
import { findIndex, map, cloneDeep, without } from "lodash";
import Notify from "/imports/ui/lib/notify.js";
// Module Menu
import { sidebarMenu } from "/imports/navmenu";
import popOverList from "/imports/popoverlist.js";

//import reportRoles from "/imports/report-roles.ts";
// Component
import {
  ElAside,
  ElMenu,
  ElMenuItem,
  ElPopover,
  ElButton,
  ElSubMenu,
  ElMenuItemGroup,
  ElImage,
} from "element-plus";
import Avatar from "../components/Avatar.vue";

// Method

export default {
  name: "Sidebar",
  components: {
    [ElAside.name]: ElAside,
    [ElMenu.name]: ElMenu,
    [ElSubMenu.name]: ElSubMenu,
    [ElMenuItem.name]: ElMenuItem,
    [ElMenuItemGroup.name]: ElMenuItemGroup,
    [ElPopover.name]: ElPopover,
    [ElButton.name]: ElButton,
    [ElImage.name]: ElImage,
    Avatar,
  },
  data() {
    return {
      roleGroupName: "",
      visiblePopoverNew: false,
      device: "desktop",
      menuList: [
        {
          title: "Dashboard",
          icon: "fal fa-tachometer-fastest",
          route: { name: "Dashboard" },
        },
        ...sidebarMenu,
        {
          title: "Audit Log",
          icon: "fal fa-history",
          roles: ["audit-log"],
          route: { name: "AuditLog" },
          noTranslate: true,
        },
        {
          title: "Demo Page",
          icon: "fal fa-newspaper",
          roles: ["super"],
          route: { name: "Demo" },
          noTranslate: true,
        },
        {
          title: "Tool",
          icon: "fal fa-wrench",
          roles: ["super"],
          route: { name: "Tool" },
          noTranslate: true,
        },
        {
          title: "Changelog",
          icon: "fal fa-sticky-note",
          roles: ["super"],
          route: { name: "Changelog" },
          noTranslate: true,
        },
      ],
    };
  },

  computed: {
    currentUserProfile() {
      return this.$store.state.app.currentUser?.profile || {};
    },
    userFullName() {
      return this.currentUserProfile.fullName || "Unknown";
    },
    isCollapse() {
      return this.$store.getters["app/sidebar/isCollapse"];
    },
    defaultActive() {
      return this.$route.name || "Dashboard";
    },
    linkActive() {
      return this.$store.state.app.tagView.linkActive;
    },
    activeParent() {
      return this.$store.state.app.sidebar.activeParent;
    },
    activeChildIndex() {
      return this.$store.state.app.sidebar.activeChildIndex;
    },
    keptView() {
      return this.$store.state.app.tagView.keptViewTags;
    },
    userExpiryDay() {
      return this.$store.getters["app/userExpiryDay"];
    },
    langUI() {
      return this.$store.getters["app/langUI"];
    },
    newPopover() {
      // Reload menu
      this.$store.state.app.currentUser;

      const checkOpts = [];
      if (this.$userIsInRole(`super`)) return popOverList;

      for (const it of popOverList) {
        const modRole = popOverList.find((mo) => mo.title == it.title);
        const role = [];
        for (const checkModRole of modRole.data) {
          if (checkModRole && checkModRole.modules) {
            if (this.$moduleIsInRole(checkModRole.modules)) {
              if (checkModRole && checkModRole.roles) {
                if (this.$userIsInRole(checkModRole.roles)) {
                  role.push(checkModRole);
                }
              }
            }
          } else if (
            checkModRole &&
            checkModRole.name == "report-create-statement"
          ) {
            if (this.$userIsInRole(checkModRole.roles)) {
              role.push(checkModRole);
            }
          }
        }
        const data = {
          title: modRole.title,
          index: modRole.index,
          data: role,
        };
        if (role.length) checkOpts.push(data);
      }

      return checkOpts;
    },
    sidebarMenuItems() {
      // Reload menu
      this.$store.state.app.currentUser;

      const list = [];
      const menuSide = cloneDeep(this.menuList);

      // User super
      if (this.$userIsInRole("super")) return menuSide;

      // Check role in sub menu (child)
      const checkRoleInChild = (data) => {
        if (!data.length) return [];

        const list = [];
        for (const ch of data) {
          if (ch.roles) {
            if (this.$userIsInRole(ch.roles)) list.push(ch);
          } else {
            if (list.length == 0) {
              if (!(ch && ch.divider)) list.push(ch);
            } else {
              list.push(ch);
            }
          }
        }
        return list;
      };
      // loop pick menu
      for (const it of menuSide) {
        // check report
        if (it.title == "Reports") {
          if (this.$userIsInRole(reportRoles)) list.push(it);
          continue;
        }

        if (
          it.modules &&
          it.role &&
          !this.$moduleIsInRole(it.modules) &&
          !this.$userIsInRole(it.roles)
        ) {
          continue;
        }

        let child = [];
        if (it.children && it.children.length) {
          if (it && it.modules) {
            if (this.$moduleIsInRole(it.modules)) {
              child = checkRoleInChild(it.children);
            }
          } else {
            child = checkRoleInChild(it.children);
          }
          delete it.children;
          if (child && child.length) {
            it.children = child;
          }
          list.push(it);
        } else {
          let cond = !it.modules;
          if (it.modules && this.$moduleIsInRole(it.modules)) {
            cond = true;
          }

          if (it.roles && this.$userIsInRole(it.roles) && cond) {
            list.push(it);
          } else if (!it.roles && cond) {
            list.push(it);
          }
        }
      }
      return list;
    },
  },
  watch: {
    device(val) {
      if (val === "mobile") {
        this.collapseSidebar(true);
      } else {
        this.collapseSidebar(false);
      }
    },
    $route: {
      handler(route) {
        const routeName = route.name;

        // Get active menu
        const activeMenuArr = without(
          map(this.sidebarMenuItems, (item) => {
            if (item.route?.name && item.children) {
              if (item.route.name == routeName) {
                return { name: item.route.name, childIndex: null };
              } else {
                const childIndex = findIndex(item.children, (child) => {
                  return child.route?.name == routeName;
                });

                if (childIndex >= 0) {
                  return { name: item.route.name, childIndex: childIndex };
                }
              }
            }
          }),
          undefined
        );

        // Get first item from array
        const activeMenu = activeMenuArr.length ? activeMenuArr[0] : null;

        if (activeMenu) {
          // Set active parent
          this.$store.dispatch("app/sidebar/setActiveParent", activeMenu.name);
          // Set exact child index
          this.$store.dispatch(
            "app/sidebar/setActiveChildIndex",
            activeMenu.childIndex
          );
        } else {
          // Reset active parent
          this.$store.dispatch("app/sidebar/setActiveParent", null);
          // Reset exact child index
          this.$store.dispatch("app/sidebar/setActiveChildIndex", null);
        }
      },
      immediate: true,
    },
    "currentUserProfile.roleGroup": {
      handler(val) {
        this.getUserRoleGroup(val);
      },
      immediate: true,
    },
  },
  beforeMount() {
    window.addEventListener("resize", this.resizeWindow);
  },
  beforeUnmount() {
    window.addEventListener("resize", this.resizeWindow);
  },
  methods: {
    getUserRoleGroup() {
      if (this.currentUserProfile?.roleGroup == "super")
        return (this.roleGroupName = "Super");

      const roleGroupId = this.currentUserProfile?.roleGroup || null;
      if (!roleGroupId) return (this.roleGroupName = null);

      findOneRoleGroup
        .callPromise({ selector: { _id: roleGroupId } })
        .then((result) => {
          this.roleGroupName = result?.name || null;
        })
        .catch((error) => {
          Notify.error({ message: error });
        });
    },
    collapseSidebar(value) {
      this.$store.dispatch("app/sidebar/collapseSidebar", value);
    },
    getMenuTitle(item) {
      if (item.noTranslate) {
        return item.title;
      } else {
        return this.$t(`sidebar.${item.title}`);
      }
    },
    checkActiveParentClass(item) {
      // on click item
      if (
        this.$route.name == item.route.name &&
        this.activeParent == item.route.name
      ) {
        return true;
      }
      // on click sub item
      else if (
        this.linkActive[item.route.name] &&
        this.activeParent == item.route.name
      ) {
        return true;
      }

      return false;
    },
    handlePopoverClick({ route }) {
      this.$router.push(route);
      this.visiblePopoverNew = false;
    },
    handleMenuClick({ route, popover }) {
      this.$router.push(route);
    },
    resizeWindow() {
      if (!document.hidden) {
        const rect = document.body.getBoundingClientRect();

        if (rect.width < 1264) {
          this.device = "mobile";
        } else {
          this.device = "desktop";
        }
      }
    },
    logout() {
      this.$store.dispatch("app/logout");
    },
    resizeWindow() {
      if (!document.hidden) {
        const rect = document.body.getBoundingClientRect();

        if (rect.width < 1264) {
          this.device = "mobile";
        } else {
          this.device = "desktop";
        }
      }
    },
    logout() {
      this.$store.dispatch("app/logout");
    },
  },
};
</script>

<style lang="scss">
// For style that cannot overwrite in scoped
.sidebar-menu > .el-menu--collapse > .el-menu-item > div {
  padding: 0 12px !important;
}

// ElPopover Menu (Child Items)
.sidebar-popover {
  padding: 0px !important;
  margin-top: 0px;
  padding: 8px 0 !important;

  .el-menu-item {
    font-weight: 500;
    text-transform: capitalize;
    font-size: 14px;
    border-radius: 10px;
    margin: 0px 8px 8px 8px;
    padding-left: 16px !important;
    height: 40px;
    line-height: 40px;
    &:last-of-type {
      margin-top: 8px;
      margin-bottom: 0px;
    }

    &:focus,
    &:hover {
      background-color: rgba(17, 17, 29, 255);
      color: #ffffff;
    }

    // Active menu item
    &.is-active {
      background-color: rgba(17, 17, 29, 255);
      color: #ffffff;
    }
  }
}
</style>

<style lang="scss" scoped>
.basicFlyoutWidgetContainer .flyoutWrapper {
  background-color: #ffffff;

  position: relative;
  overflow: hidden;
}
.flyoutContainer {
  width: inherit;
  min-width: 200px;
  border-radius: 8px;
  display: inline-block;
  background: #ffffff;
  transition: none;
}
.flyoutContainer .flyoutHeader {
  top: 0px;
  width: 100%;
  position: absolute;
  background-color: #eceef1;
  border: none;
}

.flyoutContainer .flyoutHeader .headerTitle {
  font-weight: 600;
  font-size: 1.6rem !important;
  color: #393a3d;
  white-space: normal;
  line-height: 28px;
  margin: 0;
}

.columnList {
  display: flex;
  justify-content: flex-start;
  // margin: 28px 4px 20px 4px;
}
.columnList .flyoutColumn {
  display: table-cell;
  vertical-align: top;
  word-wrap: break-word;
  min-width: 224px;
  margin: 0 4px;
}
.columnList .flyoutColumn .columnHeader {
  font-size: 1rem;
  line-height: 1.1;
  letter-spacing: 0px;
  color: #393a3d;
  font-weight: 600;
  margin: 0 auto !important;
  padding: 12px 20px;
  white-space: nowrap;
}
.columnList .flyoutColumn ul {
  margin: 0;
  padding-left: 0px;
}
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

ol li,
ul li {
  font-size: 1em;
  line-height: 1.5em;
  margin: 0;
  list-style-type: none;
  cursor: pointer;
}
.columnList .flyoutColumn ul li .columnLink {
  display: block;
  font-size: 0.8rem;
  line-height: 1.43;
  color: #393a3d;
  padding: 8px 20px;
  position: relative;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
}
.columnList .flyoutColumn ul li .columnLink:hover,
.columnList .flyoutColumn ul li .columnLink:focus {
  // color: transparent;
  background-color: #eceef1;
  text-decoration: none;
  outline: 0 none;
  font-weight: bold;
}
.columnList .flyoutColumn ul li .columnLink:hover:after,
.columnList .flyoutColumn ul li .columnLink:focus:after {
  content: attr(data-content);
  position: absolute;
  left: 20px;
  top: 8px;
  font-weight: 500;
  line-height: 1.43;
  color: #393a3d;
}
.sidebar {
  position: relative;
  width: auto !important;
  background-color: rgba(17, 17, 29, 255);
  overflow: hidden;

  .sidebar-header {
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: left;
    min-height: 60px;
    line-height: 59px;
    background-color: rgba(17, 17, 29, 255);
    color: #ffff;
    font-size: 16px;
    border: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0;
    padding: 0 12px;

    .logo {
      position: absolute;
      height: 50px;
      object-fit: cover;
      transform: translate3d(0, 0, 0);
      transition: transform 0.3s, opacity 0.3s;

      &.is-hidden {
        opacity: 0;
        transform: translate3d(-36px, 0, 0);
      }
    }

    .logo-collapse {
      position: absolute;
      height: 50px;
      object-fit: cover;
      transform: translate3d(0, 0, 0);
      transition: transform 0.3s, opacity 0.3s;

      &.is-hidden {
        opacity: 0;
        transform: translate3d(36px, 0, 0);
      }
    }
  }

  .sidebar-new {
    position: absolute;
    width: 230px;
    height: 52px;
    padding: 10px 10px 0 10px;
    box-sizing: border-box;
    transition: width 0.36s;

    &.sidebar-new-mini {
      width: 64px;
    }

    .button-new {
      width: 100%;
      height: 42px;
      top: 0px;
      z-index: 1;
      line-height: 0;
      background-color: rgba(17, 17, 29, 255);
      color: #ffffff;
      border-radius: 10px;
      border: solid 2px #ffffff;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      padding: 0;
      transition: all 0.3s;
      cursor: pointer;

      &:hover {
        background-color: #ffffff;
        color: #212121;
      }

      i {
        font-size: 14px;
        line-height: 14px;
        margin-right: 2px;
      }
      span {
        display: inline-block;
        font-size: 14px;
        line-height: 14px;
        transition: transform 0.3s ease-in, opacity 0.3s ease-in;
        opacity: 1;
        transform: translateZ(0);

        &.is-hidden {
          position: absolute;
          opacity: 0;
          transform: translate3d(-15px, 0, 0);
        }
      }

      &.--mini {
        i {
          margin-right: 0px;
        }
      }
    }
  }

  /*************
    **  Sidebar **
    **************/
  .margin-top {
    margin-top: 52px;
  }
  .sidebar-menu {
    position: relative;
    height: calc(100vh - 175px);
    padding: 10px 0 0 0;
    box-sizing: border-box;
    overflow: auto;
    visibility: hidden;
    transition: visibility 0.2s;

    &:hover,
    &:focus {
      visibility: visible;
    }
    .menu-vertical {
      background-color: rgba(17, 17, 29, 255) !important;
      min-height: 400px;
      border-right: none !important;
      visibility: visible;

      .el-menu-item {
        color: #ffffff;
        font-weight: 500;
        text-transform: capitalize;
        font-size: 14px;
        border-radius: 10px;
        height: 42px;
        line-height: 42px;
        margin: 0 10px 12px 10px;
        padding: 0 12px !important;
        &:focus,
        &:hover,
        &:active {
          opacity: 1;
          background: hsla(0, 0%, 100%, 0.23);
        }

        // Select all class start with these words
        // Font awesome icon
        [class^="fa"],
        [class^="fab"],
        [class^="fas"],
        [class^="far"],
        [class^="fal"],
        [class^="fad"] {
          width: 20px;
          vertical-align: middle;
          font-size: 16px;
          color: #fff;
          text-align: center;
        }

        // Active menu item
        &.is-active {
          color: #212121;
          background: #ffffff;

          i {
            color: #212121;
          }
        }

        .el-submenu__title {
          height: 42px !important;
          line-height: 42px !important;
        }

        .icon-wrapper {
          margin-right: 8px;
        }
      }

      // Normal Sidebar
      &:not(.el-menu--collapse) {
        width: 230px;
        max-width: 230px;
      }

      // Mini Sidebar
      &.el-menu--collapse {
        /* max-width: 64px; */
        .el-menu-item {
          .icon-wrapper {
            margin-right: 0;
            i {
              margin: 0;
            }
          }

          span {
            display: none;
          }
        }
      }
    }
  }

  .sidebar-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: auto;
    background-color: rgba(17, 17, 29, 255);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff;

    .el-menu {
      border-right: none !important;
      background-color: rgba(17, 17, 29, 255);
      .el-menu-item {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        color: #ffffff;
        font-weight: 500;
        text-transform: capitalize;
        font-size: 14px;
        border-radius: 10px;
        min-height: 60px;
        line-height: 60px;
        cursor: inherit;
        padding: 0 0 0 10px !important;

        &:focus,
        &:hover,
        &:active {
          opacity: 1;
          background: transparent !important;
        }

        .avatar-wrapper {
          visibility: visible;
          transition: all 0.3s;
        }

        .content {
          flex: 1;
          display: block;
          line-height: unset;
          max-height: 60px;
          overflow: hidden;
          padding: 0 4px;

          span:first-child {
            display: block;
            line-height: 40px;
            max-height: 30px;
            font-size: 14px;
            font-weight: 600;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }

          span:last-child {
            line-height: 21px;
            height: 30px;
            display: block;
            font-size: 14px;
            max-height: 30px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }

        .logout-wrapper {
          padding-right: 10px;
          transition: all 0.2s;

          .logout-btn {
            flex: 0;
            vertical-align: middle;
            padding: 6px 6px;
            font-size: 16px;
            display: inline-flex;
            border-radius: 6px;
            background: rgba(245, 34, 45, 0.8);
            border: 1px solid rgba(245, 34, 45, 0.4);
            cursor: pointer;
            transition: all 0.2s;
            box-sizing: border-box;

            i {
              color: #fff;
              transition: color 0.3s;
            }

            &:hover {
              background: rgba(245, 34, 45, 0.9);
              border: 1px solid rgba(245, 34, 45, 0.4);
              box-shadow: 0px 0px 1px #fff;
            }
          }
        }
      }
    }

    &.--mini {
      .el-menu {
        .el-menu-item {
          .avatar-wrapper {
            visibility: hidden;
          }

          .logout-wrapper {
            position: absolute;
            background-color: rgba(17, 17, 29, 255);
            width: 44px;
            right: 0;
            box-sizing: content-box;

            .logout-btn {
              border-radius: 10px;
              padding: 10px 10px;
              font-size: 18px;
              box-shadow: 0px 0px 1px #fff;
            }
          }
        }
      }
    }
  }
}

:global(.popover-new) {
  min-width: 220px !important;
  width: unset !important;
}
.popover-new {
  .menu-new {
    border-right: none !important;
    display: flex;
    flex-flow: row nowrap;
    .title {
      font-size: 1rem;
      font-weight: bold;
      margin-bottom: 5px;
      padding-left: 12px;
      color: #393a3d;
    }

    .el-menu-item {
      font-weight: 500;
      text-transform: capitalize;
      border-radius: 10px;
      margin: 0;
      padding: 0 12px !important;
      height: 35px;
      font-size: 0.8rem;
      line-height: 35px;

      &:focus,
      &:hover,
      &:active {
        opacity: 1;
        background-color: rgba(17, 17, 29, 255);
        color: #ffffff !important;
      }
    }
  }
}
</style>
