<template>
  <ElConfigProvider :size="elConfig.size">
    <template v-if="isUnknownRoute">
      <div style="width: 100vw; height: 100vh; overflow: hidden">
        <VueElementLoading
          :active="true"
          spinner="line-wave"
          size="55"
          background-color="rgba(255, 255, 255, 1)"
          color="#ff782c"
        />
      </div>
    </template>
    <template v-else>
      <component :is="currentLayout" />
    </template>

    <vue-progress-bar></vue-progress-bar>
  </ElConfigProvider>
</template>

<script lang="ts">
import { subscribe, autoSubscribe, autoResult } from "meteor/rabbit:vue3";
import { computed, watch, defineComponent } from "vue";

// Libs
import { useStore } from "/imports/store";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

// Collection
import Company from "../../api/company/company";
import Branches from "../../api/branches/branches";
// Components
import VueElementLoading from "vue-element-loading";
import { ElConfigProvider } from "element-plus";

import layout from "/imports/layout";
import { isEmpty } from "lodash";

// namespaces
type Layout = keyof typeof layout; // use key of object as type

export default defineComponent({
  components: { ElConfigProvider, VueElementLoading },
  setup() {
    const store = useStore();
    const route = useRoute();
    const i18n = useI18n();

    // Created
    store.dispatch("app/loadCurrentUser");

    const elConfig: {
      size: "small" | "default" | "large";
    } = {
      size: "default",
    };

    // Computed
    const isUnknownRoute = computed(() => {
      return route.path === "/" && route.name === undefined;
    });
    const currentLayout = computed(() => {
      const meta = route.meta;
      const defaultLayoutName: Layout = "main";
      if (!meta) return layout[defaultLayoutName];

      let layoutName: Layout = (meta?.layout as Layout) || defaultLayoutName;
      if (meta.title == "Transaction") {
        layoutName = "tranLayout";
      }
      return layout[layoutName];
    });
    const currentUser = computed(() => {
      return store.state.app.currentUser;
    });
    const allowedBranchIds = computed(() => {
      return currentUser.value?.profile.allowedBranches || [];
    });

    // Subscribe
    const { ready: companyReady } = subscribe("app.company");
    const company = autoResult(() => {
      if (companyReady.value) return Company.findOne();
    });
    const { ready: branchReady } = autoSubscribe(() => [
      "app.branches",
      {
        _id: { $in: allowedBranchIds.value },
      },
    ]);
    const branches = autoResult(() => {
      if (branchReady.value) return Branches.find().fetch();
      return [];
    });

    // Watch
    watch(company, (value) => {
      // Set default Lang
      i18n.locale.value = value?.setting?.lang || "en";
      store.dispatch("app/updateCompany", value);
    });
    watch(branches, (value) => {
      store.dispatch("app/updateAllowedBranches", value);
    });

    return { elConfig, isUnknownRoute, currentLayout };
  },
});
</script>
