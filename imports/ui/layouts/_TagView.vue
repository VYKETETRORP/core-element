<template>
  <div id="tags-view-container" class="tags-view-container kh-battambang">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper kh-battambang">
      <!-- tag="span" -->
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag) ? 'is-active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        class="tags-view-item"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        <!-- @click.middle.native="closeSelectedTag(tag)" -->
        <!-- {{ tag.meta.title }} -->
        {{ $t(`breadcrumb.${tag.meta.title}`) }}

        <template v-if="!tag.meta.affix">
          <el-icon
            class="icon-close"
            @click.prevent.stop="closeSelectedTag(tag)"
          >
            <close />
          </el-icon>
        </template>
      </router-link>
    </scroll-pane>
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top - 50 + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
      <li
        v-if="!(selectedTag.meta && selectedTag.meta.affix)"
        @click="closeSelectedTag(selectedTag)"
      >
        Close
      </li>
      <li @click="closeOthersTags">Close Others</li>
      <li @click="closeAllTags(selectedTag)">Close All</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from "./_ScrollPane.vue";

// Component
import { ElButton, ElTabs, ElTabPane, ElIcon } from "element-plus";
export default {
  name: "TagView",
  components: {
    ScrollPane,
    [ElButton.name]: ElButton,
    [ElTabs.name]: ElTabs,
    [ElTabPane.name]: ElTabPane,
    [ElIcon.name]: ElIcon,
  },
  data() {
    return {
      activeRouterPath: this.$route.path,
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.app.tagView.visitedViews;
    },
    maxCache() {
      return this.$store.state.app.tagView.maxCache || 10;
    },
  },
  watch: {
    $route: {
      handler(val) {
        this.activeRouterPath = val.path;
        this.$store.dispatch("app/tagView/makeLinkActive", val.meta.linkActive);
        this.addTags();
      },
      immediate: true,
    },
    visitedViews: {
      handler(val) {
        if (val.length > this.maxCache) {
          const firstTag = val[1];
          this.closeSelectedTag(firstTag);
        }
      },
      immediate: true,
      deep: true,
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
  },
  mounted() {
    this.addTags();
  },

  methods: {
    isActive(route) {
      return route.path === this.$route.path;
    },
    addTags() {
      const route = this.$route;
      if (route && route.meta?.title && !route.meta?.noTagView) {
        this.$store.dispatch("app/tagView/addView", route);
      }
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag);
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch(
                "app/tagView/updateVisitedView",
                this.$route
              );
            }
            break;
          }
        }
      });
    },
    refreshSelectedTag(view) {
      this.$store.dispatch("app/tagView/refreshVisitedView", view);
    },
    closeSelectedTag(view) {
      this.$store.dispatch("app/tagView/delView", view).then(() => {
        this.$store.dispatch("app/tagView/afterDeleteView", view);
      });
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag);
      this.$store
        .dispatch("app/tagView/delOthersViews", this.selectedTag)
        .then(() => {
          this.moveToCurrentTag();
        });
    },
    closeAllTags(view) {
      this.$store.dispatch("app/tagView/delAllViews").then(() => {
        if (this.affixTags.some((tag) => tag.path === view.path)) {
          return;
        }

        this.$router.push("/");
      });
    },
    openMenu(tag, e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft + 15; // 15: margin right
      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }
      this.top = e.clientY;
      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
// .clearfix:before,
// .clearfix:after {
//   display: table;
//   content: '';
// }
// .clearfix:after {
//   clear: both;
// }
// .tag-view .close-all {
//   margin: -32px 20px 0px 5px;
//   .el-button--mini {
//     padding: 5px 5px;
//   }
// }

.tags-view-container {
  position: sticky;
  top: 0;
  z-index: 999;
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 3px;
      border-radius: 3px;
      text-decoration: none;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.is-active {
        background-color: #409eff;
        color: #fff;
        border-color: #409eff;
        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .icon-close {
      width: 16px;
      height: 16px;
      vertical-align: middle;
      margin-left: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;

      &:hover {
        background-color: #409eff;
        color: #ffffff;
      }

      svg {
        width: 16px;
        height: 16px;
        transform: scale(0.6);
      }
    }
  }

  .is-active {
    .icon-close {
      &:hover {
        background-color: #ffffff;
        color: #409eff;
      }
    }
  }
}
</style>
