<template>
  <el-container class="main-container">
    <metainfo>
      <template #title="{ content }"> Rabbit - {{ content }}</template>
    </metainfo>

    <Sidebar />
    <el-container>
      <!-- Dialog -->
      <Dialog ref="dialog" />
      <!-- Drawer -->
      <Drawer ref="drawer" />

      <el-header class="header clearfix">
        <div class="content-left">
          <Hamburger
            :is-collapse="isCollapseSidebar"
            @click="collapseSidebar()"
          />
          <div class="breadcrumb"><Breadcrumb /></div>
        </div>

        <div class="content-right">
          <div class="item">
            <branch />
          </div>
          <div class="item">
            <SettingSideBar />
          </div>
          <div class="item">
            <notification />
          </div>

          <div class="item">
            <el-tooltip effect="dark" content="Language" placement="bottom-end">
              <img :src="langFlagSrc" @click="updateLang" />
            </el-tooltip>
          </div>

          <div class="item">
            <full-screen />
          </div>
        </div>
      </el-header>

      <!-- Main -->
      <el-main class="main">
        <TagView />
        <div>
          <div
            class="scroll"
            :class="{ show: isScrollActive }"
            @touchstart="touchStart"
          >
            <div
              id="toTop"
              v-touch:hold="toTopHover"
              v-touch:release="toTopOut"
              @click="toTop"
            >
              <i class="arrow up" />
            </div>

            <div
              id="toBottom"
              v-touch:hold="toBottomHover"
              v-touch:release="toBottomOut"
              @click="toBottom"
            >
              <i class="arrow down" />
            </div>
          </div>
          <div
            id="scroll-layout"
            style="
              max-height: calc(100vh - 95px);
              overflow-y: auto;
              overflow-x: hidden;
            "
            @scroll="startScroll"
          >
            <div class="content">
              <!--Global Alert -->
              <!--<el-alert
                v-if="alert.visible"
                show-icon
                type="error"
                class="mb-[15px]"
                @close="closeAlert"
              >
                <template #title>
                  {{ alert.title }}
                </template>
              </el-alert>-->

              <router-view> </router-view>
            </div>

            <!-- Footer -->
            <div class="footer">
              {{ copyright }}
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import {
  reactive,
  computed,
  watch,
  nextTick,
  onMounted,
  toRefs,
  inject,
} from "vue";
import { startCase } from "lodash";
import moment from "moment";
import { useRoute, useRouter, RouteLocationNormalizedLoaded } from "vue-router";
//import {useStore} from "/imports/store";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
//import { useMeta } from "vue-meta";
// Release version
import release from "../release";
// Components
import FullScreen from "./_FullScreen.vue";
import Hamburger from "./_Hamburger.vue";
import Breadcrumb from "./_Breadcrumb.vue";
import TagView from "./_TagView.vue";
import Branch from "./_Branch.vue";
import Notification from "./_Notification.vue";
import Sidebar from "./_Sidebar.vue";
import Dialog from "./../components/Dialog.vue";
import Drawer from "./../components/Drawer.vue";
import SettingSideBar from "./_Setting.vue";
import {
  ElAlert,
  ElContainer,
  ElHeader,
  ElMain,
  ElTooltip,
} from "element-plus";

// State
const store = useStore();
const router = useRouter();
const route = useRoute();
const i18n = useI18n();
// Injection
//const userIsInRole = inject("$userIsInRole") as (
//  roles: string | string[]
//) => boolean;
// Meta
//const title = computed<string>(() => {
//  return (route.meta.title ||
//    startCase(route.name as string) ||
//    "No-TiTle") as string;
//});
//const { meta } = useMeta({
//  title: title.value,
//  htmlAttrs: { lang: "en" },
//});
//watch(
//  title,
//  (value) => {
//    meta.title = value;
//  },
//  { immediate: true }
//);

const state = reactive<{
  visibleAlert: boolean;
  alertTitle: string;
  // popoverVisible: { [key: string]: string }
  copyright: string;
  step: number;
  isScrollActive: boolean;
  clearTime: NodeJS.Timeout | undefined;
}>({
  visibleAlert: false,
  alertTitle: "System Alert",
  // popoverVisible: {},
  copyright: `© 2014-${moment().format("YYYY")}Rabbit Technology v${release}`,
  // USE FOR SCROLL
  step: 100,
  isScrollActive: false,
  clearTime: undefined,
});
// Computed
const isCollapseSidebar = computed(() => {
  return store.getters["app/sidebar/isCollapse"];
});
const langFlagSrc = computed(() => {
  return i18n.locale.value === "km"
    ? "/images/flag/united-states.svg"
    : "/images/flag/cambodia.svg";
});
const cachedViews = computed(() => {
  return store.getters["app/tagView/cachedViews"];
});
const maxCache = computed(() => {
  return store.state.app.tagView.maxCache || 10;
});
const userExpiryDay = computed(() => {
  return store.getters["app/userExpiryDay"];
});
const userIsInActive = computed(() => {
  return store.getters["app/userIsInActive"];
});
const alert = computed(() => {
  return store.getters["app/alertOpts"];
});
// Watch
watch(
  userExpiryDay,
  (val) => {
    if ((val || val == 0) && val <= 0) {
      router.push({ name: "Confirm" });
    } else if (val && val <= 7) {
      store.dispatch(
        "app/alert",
        `Your user account password will expire in ${val} day(s). Please change your password.`
      );
    }
  },
  { immediate: true }
);
watch(
  userIsInActive,
  (val) => {
    if (val) {
      store.dispatch("app/logout");
    }
  },
  { immediate: true }
);
// Methods
const getRouterKey = (_route: RouteLocationNormalizedLoaded) => {
  const visitedRoute =
    store.state.app.tagView.visitedViews?.find(
      (el: RouteLocationNormalizedLoaded) => el.fullPath == _route.fullPath
    ) || _route;
  return visitedRoute.fullPath + (visitedRoute.meta?.cacheKey || "");
};
const collapseSidebar = () => {
  store.dispatch("app/sidebar/collapseSidebar", !isCollapseSidebar.value);
};
const updateLang = () => {
  i18n.locale.value = i18n.locale.value === "en" ? "km" : "en";

  nextTick(() => {
    store.dispatch("app/updateLang", i18n.locale.value);
  });
};
const closeAlert = () => {
  store.dispatch("app/disAlert");
};
//=============SCROLL FUNCTION===============
const touchStart = (e: Event) => {
  const itemScrollTop = document.querySelector("#toTop");
  const itemScrollBottom = document.querySelector("#toBottom");
  if (e.type == "touchstart") {
    itemScrollTop?.removeEventListener("mouseover", toTopHover);
    itemScrollBottom?.removeEventListener("mouseover", toBottomHover);
  }
  document.oncontextmenu = function () {
    return false;
  };
};
const startScroll = () => {
  const mainScroll = document.getElementById("scroll-layout");
  if (!mainScroll) return;

  if (mainScroll.scrollHeight > mainScroll.clientHeight) {
    state.isScrollActive = true;
  }
  if (mainScroll.scrollTop <= 50) {
    state.isScrollActive = false;
  }
};
const toTopOut = () => {
  const itemScrollTop = document.querySelector("#toTop") as HTMLElement;
  if (!itemScrollTop) return;

  itemScrollTop.addEventListener("mouseover", toTopHover);
  itemScrollTop.style["backgroundColor"] = "rgba(0, 0, 0, 0.2)";

  if (state.clearTime) clearTimeout(state.clearTime);

  const scrollLayout = document.getElementById("scroll-layout");
  if (scrollLayout) scrollLayout.style.overflowY = "scroll";
};
const toTopHover = () => {
  const i = state.step;
  const mainScroll = document.getElementById("scroll-layout");
  if (!mainScroll) return;
  mainScroll.style["scrollBehavior"] = "smooth";
  const itemScrollTop = document.getElementById("toTop");
  if (!itemScrollTop) return;
  itemScrollTop.style["backgroundColor"] = "rgba(0, 0, 0, 0.5)";

  mainScroll.scrollTop -= i;
  if (mainScroll.scrollTop > 0) {
    state.clearTime = setTimeout(() => toTopHover(), 100);
  } else {
    if (state.clearTime) clearTimeout(state.clearTime);
  }
};
const toTop = () => {
  const mainScroll = document.getElementById("scroll-layout");
  if (!mainScroll) return;

  mainScroll.style["scrollBehavior"] = "smooth";
  if (state.clearTime) clearTimeout(state.clearTime);
  mainScroll.scrollTop = 0;
};

const toBottomOut = () => {
  const itemScrollBottom = document.querySelector("#toBottom") as HTMLElement;
  if (!itemScrollBottom) return;
  itemScrollBottom.addEventListener("mouseover", toBottomHover);
  itemScrollBottom.style["backgroundColor"] = "rgba(0, 0, 0, 0.2)";
  if (state.clearTime) clearTimeout(state.clearTime);

  const scrollLayout = document.getElementById("scroll-layout");
  if (scrollLayout) scrollLayout.style.overflowY = "scroll";
};
const toBottomHover = () => {
  const i = state.step;
  const mainScroll = document.getElementById("scroll-layout");
  if (!mainScroll) return;
  mainScroll.style["scrollBehavior"] = "smooth";
  const itemScrollBottom = document.getElementById("toBottom");
  if (!itemScrollBottom) return;
  itemScrollBottom.style["backgroundColor"] = "rgba(0, 0, 0, 0.5)";

  const clientHeight = mainScroll.clientHeight;
  const scrollHeight = mainScroll.scrollHeight;
  const height = scrollHeight - clientHeight; //Th
  mainScroll.scrollTop += i;
  if (mainScroll.scrollTop < height) {
    state.clearTime = setTimeout(() => toBottomHover(), 100);
  } else {
    if (state.clearTime) clearTimeout(state.clearTime);
  }
};
const toBottom = () => {
  const mainScroll = document.getElementById("scroll-layout");
  if (!mainScroll) return;
  mainScroll.style["scrollBehavior"] = "smooth";
  const scrollHeight = mainScroll.scrollHeight;
  if (state.clearTime) clearTimeout(state.clearTime);
  mainScroll.scrollTop = scrollHeight;
};
//===========END SCROLL FUNCTION=============
//onMounted(() => {
//  store.dispatch("app/loadAllowedModules");
//});

const { copyright, isScrollActive } = toRefs(state);
</script>

<style lang="scss" scoped>
/* Container */
.main-container {
  height: 100vh;
  position: relative;
}

/* Header */
.header {
  width: 100%;
  min-height: 50px;
  max-height: 60px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  border: 0;
  font-size: 16px;
  border-radius: 0;
  background-color: hsla(0, 0%, 100%, 0.96);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  .content-left {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    .breadcrumb {
      margin-left: 12px;
    }
  }

  .content-right {
    height: 24px;
    display: inline-flex;
    align-items: center;

    .item {
      height: 100%;
      display: flex;
      align-items: center;
      margin-right: 8px;
      flex-flow: row nowrap;
      padding: 4px 8px;
      border-radius: 10px;
      color: #606266;

      img {
        //max-height: 100%;
        height: 24px;
        width: 24px;
        margin-top: -4px;
        cursor: pointer;
      }
    }

    div:last-child {
      margin-right: 0;
    }
  }

  // Button
  .el-button--text {
    .icon-link {
      cursor: pointer;
      color: #303133;
      font-size: 14px;
    }
  }
  .el-button--text:hover {
    .icon-link {
      color: #409eff;
    }
  }
  .hamburger {
    cursor: pointer;
    color: white;
  }
}

/* Main */
.main {
  background-color: #f8f8f9;
  color: #333;
  text-align: left;
  /* line-height: 160px; */
  padding: 0px;
  // padding-bottom: 10px;
}

.el-menu {
  position: unset !important;
}

.content {
  min-height: calc(100vh - 145px);
  background-color: #f0f0f0;
  padding: 10px 10px 8px 10px;
}

.footer {
  text-align: center;
  font-size: 12px;
  color: #97a8be;
  height: 30px;
  line-height: 30px;
  background-color: #f0f0f0;
}

.mr-1 {
  margin-right: 15px;
}
.ml-1 {
  margin-left: 15px;
}
.mx-1 {
  margin-right: 15px;
  margin-left: 15px;
}

.link-active {
  color: #409eff !important;
}

// ==============================USE FOR SCROLLING
.scroll {
  position: fixed;
  right: 15px;
  bottom: 160px;
  width: 45px;
  height: 90px;
  display: none;
  z-index: 2;
}
.scroll > div {
  width: 40px;
  height: 40px;
  // transform: rotate(90deg);
  line-height: 40px;
  text-align: center;
  // font-size: 28px;
  cursor: pointer;
  font-family: "Black body";
  background-color: rgba(0, 0, 0, 0.2);
  color: #fff;
}
.arrow {
  border: solid #fff;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 5px;
}

.up {
  transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
}

.down {
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
.scroll > div:hover {
  background-color: rgba(0, 0, 0, 0.5);
}
.show {
  display: block;
}
//===========================END SCROLLING
</style>
