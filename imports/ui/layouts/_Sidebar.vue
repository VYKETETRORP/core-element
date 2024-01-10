<template class="kh-battambang">
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

    <section class="sidebar-new kh-battambang">
      <section :class="{ 'sidebar-menu': true }">
        <el-menu
          :collapse="isCollapse"
          :default-active="defaultActive"
          :unique-opened="true"
          class="menu-vertical"
        >
          <template v-for="(item, index) in sidebarMenuItems" :key="index">
            <!-- Has child  -->
            <el-popover
              :key="index"
              placement="right-start"
              width="240"
              trigger="hover"
              class="sidebar-tooltip"
              popper-class="sidebar-popover"
              v-if="item.children"
            >
              <!-- Menu with children -->
              <template v-for="(child, idx) in item.children" :key="idx">
                <!-- Child items  -->
                <el-menu-item
                  :key="`${index}-${idx}`"
                  :index="child.route.name + `-${idx}`"
                  v-if="child.title"
                  :class="{
                    'is-active':
                      $route.name === child.route.name &&
                      activeChildIndex == idx,
                  }"
                  @click="
                    handleMenuClick({
                      route: child.route,
                    })
                  "
                >
                  {{ $t(`sidebar.${child.title}`) }}
                  <!--{{ child.title }}-->
                </el-menu-item>
              </template>
              <!-- Parent -->
              <template #reference>
                <span>
                  <el-menu-item
                    :index="item.route ? item.route.name + '-index' : null"
                    :class="{
                      'is-active': checkActiveParentClass(item),
                      'is-parent': true,
                    }"
                    @click="handleMenuClick({ route: item.route })"
                  >
                    <div class="icon-wrapper">
                      <i :class="item.icon" />
                    </div>

                    <span> {{ $t(`sidebar.${item.title}`) }}</span>
                  </el-menu-item>
                </span>
              </template>
              <!--<template #reference>
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
                    <span>{{ item.title }}</span>
                  </el-menu-item>
                </span>
              </template>-->
            </el-popover>
            <!-- Menu without sub items -->
            <template v-else-if="item.title">
              <el-menu-item
                :key="index"
                :index="item.route.name + '-index'"
                @click="handleMenuClick({ route: item.route })"
                :class="{
                  'is-active': !activeParent && $route.name == item.route.name,
                }"
              >
                <div class="icon-wrapper">
                  <i :class="`${item.icon}`" />
                </div>
                <template #title>
                  <span>
                    {{ $t(`sidebar.${item.title}`) }}
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
            <div class="avatar-wrapper">
              <Avatar name="Super" background="#1E90FF" />  

            </div>
           
            <div class="content">
              <span>
                <p v-if="currentUser">{{ currentUser.profile.fullName }}</p>
                <p v-else>Unknown</p></span
              >
              <span>{{ roleGroupName }}</span>
            </div>
            <div class="logout-wrapper">
              <el-button :loading="loading" class="logout-btn" @click="logout">
                <i class="fal fa-sign-out-alt" />
              </el-button>
            </div>
          </el-menu-item>
        </el-menu>
      </div>
    </section>
  </el-aside>
</template>
<script lang="ts" setup>
import { computed, ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { findIndex, map, without } from "lodash";
import useAuth from "../composables/useAuth";
import { sidebarMenu } from "/imports/navmenu";
import Avatar from "../components/Avatar.vue";

import { findOneRoleGroup } from "../../api/roles/methods";

// const { loading, logout }  = useAuth();
const { loading } = useAuth();
const store = useStore();

const route = useRoute();

const router = useRouter();
 
const currentUser = computed(() => store.state.app.currentUser);

const userFullName = computed(()=>store.getters["app/userFullName"]);
// const FullName = computed(() => store.getters["app/FullName"]);
const defaultActive = computed(() => route.name || "Dashboard");

const isCollapse = computed(() => store.getters["app/sidebar/isCollapse"]);

const activeParent = computed(() => store.state.app.sidebar.activeParent);

const activeChildIndex = computed(
  () => store.state.app.sidebar.activeChildIndex
);
// const currentUser = computed(() => store.getters["app/currentUser"]);

const linkActive = computed(() => store.state.app.tagView.linkActive);
// const FullName = currentUser.profile.fullName;

const menu = ref<any[]>([
  {
    title: "Dashboard",
    icon: "fal fa-tachometer-fastest",
    route: { name: "Dashboard" },
  },
  ...sidebarMenu,
  {
    title: "Setting",
    icon: "fal fa-cog",
    route: {
      name: "AdminSetting",
    },
  },
]);

store.dispatch("app/loadCurrentUser");

const sidebarMenuItems = computed(() => {
  return menu.value;
});

const logout = () => {
  console.log("Starting logout process");
  store
    .dispatch("app/logout")
    .then(() => {
      console.log("Logout successful");
    })
    .catch((error) => {
      console.error("Logout error:", error);
    });
};

const roleGroupName = ref<string | null>(null);
const currentUserProfile = ref<any>(null); // Adjust the type based on your actual user profile structure

const getUserRoleGroup = async () => {
  if (currentUser.value) {
    const userRoleGroup = currentUser.value.profile?.roleGroup;

    if (userRoleGroup === "super") {
      roleGroupName.value = "Super";
      return;
    }

    if (userRoleGroup) {
      try {
        const result = await findOneRoleGroup.callPromise({
          selector: { _id: userRoleGroup },
        });
        roleGroupName.value = result?.name || null;
      } catch (error) {
        console.error("Error fetching role group:", error);
      }
    }
  }
};

// Call getUserRoleGroup on component mount
onMounted(getUserRoleGroup);

watch(
  () => route,
  (route) => {
    const routeName = route.name;
    // Get active menu
    const activeMenuArr = without(
      map(sidebarMenuItems.value, (item) => {
        if (item.route?.name && item.children) {
          if (item.route.name == routeName) {
            return { name: item.route.name, childIndex: null };
          } else {
            const childIndex = findIndex(item.children, (child: any) => {
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
      store.dispatch("app/sidebar/setActiveParent", activeMenu.name);
      // Set exact child index
      store.dispatch("app/sidebar/setActiveChildIndex", activeMenu.childIndex);
    } else {
      // Reset active parent
      store.dispatch("app/sidebar/setActiveParent", null);
      // Reset exact child index
      store.dispatch("app/sidebar/setActiveChildIndex", null);
    }
  },
  { immediate: true, deep: true }
);

const checkActiveParentClass = (item: any) => {
  if (
    item.route &&
    route.name === item.route.name &&
    activeParent.value === item.route.name
  ) {
    // On click item
    return true;
  } else if (activeParent.value === item.route?.name) {
    // On click sub item
    return true;
  }
  return false;
};

const handleMenuClick = ({ route }: any) => {
  router.push(route);
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
      //  &.is-active {
      //    // color: #212121;
      //    // background: #ffffff;
      //    background: linear-gradient(-60deg, #d9dee5, #489ddd);
      //    color: #ffffff;

      //    i {
      //      color: #212121;
      //    }
      //  }
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
      //  max-width: 64px;
      .el-menu-item {
        .icon-wrapper {
          margin-right: 0;

          i {
            margin: 0px;
          }
        }
        span {
          display: none;
        }
      }
    }
  }
}

/*************
  **  Sidebar **
  **************/

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
        vertical-align: middle;
        display: inline-flex;
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
          display: block;
          line-height: 21px;
          height: 30px;
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
          // background: rgba(245, 34, 45, 0.8);
          background: linear-gradient(to right, #c0392b, #e74c3c);
          border: 1px solid rgba(245, 34, 45, 0.4);
          cursor: pointer;
          transition: all 0.2s;
          box-sizing: border-box;

          i {
            color: #fff;
            transition: color 0.3s;
          }
          &:hover {
            // background: rgba(245, 34, 45, 0.9);
            background: linear-gradient(to right, #c0392b, #d53b2a);
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
</style>
