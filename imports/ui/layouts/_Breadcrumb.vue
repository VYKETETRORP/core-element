<template class="kh-battambang">
  <el-breadcrumb separator="/" class="kh-battambang">
    <el-breadcrumb-item
      v-for="(bc, index) in breadcrumbs"
      :key="`bc-${index}`"
      :to="bc.route"
    >
      <span v-if="bc.icon">
        <i :class="bc.icon" />
      </span>
      <!--{{ bc.title }}-->
      {{ $t(`breadcrumb.${bc.title}`) }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script setup lang="ts">
import _ from "lodash";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const currentRoute = computed(() => route);

const addParentRoute = (route: any) => {
  let parent = getParentRoute(route);

  // Check parent exist
  if (parent) {
    return _.concat(addParentRoute(parent), parent);
  }
  return [];
};

const getParentRoute = (route: any) => {
  const parent = route.meta.breadcrumb && route.meta.breadcrumb.parent;
  if (parent) {
    return router.resolve({ name: parent });
  }
  return null;
};

const getBreadcrumbs = (route: any) => {
  let crumb = {
    route: {} as Record<string, any>,
    title: route.meta.title || "No-Title",
    icon: (route.meta.breadcrumb && route.meta.breadcrumb.icon) || null,
  };

  // Check name
  if (route.name) {
    crumb.route.name = route.name;
  } else {
    crumb.route.path = route.path;
  }

  // Check params
  if (route.meta.breadcrumb && route.meta.breadcrumb.params) {
    crumb.route.params = _.pick(
      currentRoute.value.params,
      route.meta.breadcrumb.params
    );
  }

  // Check query
  if (route.meta.breadcrumb && route.meta.breadcrumb.query) {
    crumb.route.query = _.pick(
      currentRoute.value.query,
      route.meta.breadcrumb.query
    );
  }

  return crumb;
};

const breadcrumbs = computed(() => {
  let crumbList = [];
  let parents = addParentRoute(currentRoute.value);
  parents.forEach((route) => {
    crumbList.push(getBreadcrumbs(route));
  });
  // Add last current route
  crumbList.push(getBreadcrumbs(currentRoute.value));

  return crumbList;
});
</script>

<style lang="scss" scoped></style>
