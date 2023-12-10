<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import layouts from "./layout";

// namespaces
type Layout = keyof typeof layouts; // use key of object as type

const route = useRoute();

const elConfig: {
  size: "small" | "default" | "large";
} = {
  size: "default",
};

// Dynamic layout
const currentLayout = computed(() => {
  const layout: Layout = (route?.meta?.layout as Layout) || null;
  return layouts[layout] || layouts["main"];
});
</script>

<template>
  <el-config-provider :size="elConfig.size">
    <component :is="currentLayout"></component>
  </el-config-provider>
</template>
