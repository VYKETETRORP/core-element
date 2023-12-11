<template>
  <div>
    <el-drawer v-model="drawerVisible" v-bind="parentAttrs">
      <!-- Component -->
      <component
        :is="currentDrawer"
        v-bind="childProps"
        @save="handleFormSave"
        @cancel="handleDrawerClose"
      />
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import _ from "lodash";
import { ref, computed, nextTick } from "vue";
import { ElDrawer } from "element-plus";

const drawerVisible = ref(false);
const currentDrawer = ref(null);
const updateId = ref(null);
const updateDoc = ref(null);
const parentAttrs = ref({});
let resolve = null;
let reject = null;

const childProps = computed(() => ({
  isDrawer: true,
  updateId: updateId.value,
  updateDoc: updateDoc.value,
}));

const open = ({
  component,
  updateId = null,
  updateDoc = null,
  attrs = null,
}) => {
  // Open drawer
  drawerVisible.value = true;

  // Child props
  updateId.value = updateId;
  updateDoc.value = updateDoc;

  // Parent options
  parentAttrs.value = _.defaults(attrs, {
    title: "Drawer",
    direction: "rtl",
  });

  nextTick(() => {
    currentDrawer.value = component;
  });

  // Return promise
  return new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
};

const handleFormSave = (result) => {
  // Return resolve
  resolve(result);
  // Close drawer
  drawerVisible.value = false;
  nextTick(() => {
    currentDrawer.value = null;
  });
};

const handleDrawerClose = () => {
  // Return resolve
  resolve(false);
  // Close drawer
  drawerVisible.value = false;
  nextTick(() => {
    currentDrawer.value = null;
  });
};
</script>
