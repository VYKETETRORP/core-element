<template>
  <el-dialog :model-value="dialogVisible" v-bind="parentAttrs">
    <component
      :is="currentDialog"
      v-bind="childProps"
      @save="handleFormSave"
      @cancel="handleDialogClose"
    />
  </el-dialog>
</template>
<script setup lang="ts">
import _ from "lodash";
import { ref, computed, nextTick } from "vue";
import { ElDialog } from "element-plus";

const dialogVisible = ref(false);
const currentDialog = ref(null);
const updateId = ref(null);
const updateDoc = ref(null);
const parentAttrs = ref({});
let resolve = null;
let reject = null;

const childProps = computed(() => ({
  isDialog: true,
  updateId: updateId.value,
  updateDoc: updateDoc.value,
}));

const open = ({
  component,
  updateId = null,
  updateDoc = null,
  attrs = null,
}) => {
  // Open dialog
  dialogVisible.value = true;

  // Child props
  updateId.value = updateId;
  updateDoc.value = updateDoc;

  // Parent options
  parentAttrs.value = attrs;
  parentAttrs.value = _.defaults(parentAttrs.value, {
    title: "Dialog",
    fullscreen: true,
  });

  nextTick(() => {
    currentDialog.value = component;
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
  // Close dialog
  dialogVisible.value = false;
  nextTick(() => {
    currentDialog.value = null;
  });
};

const handleDialogClose = () => {
  // Return resolve
  resolve(false);
  // Close dialog
  dialogVisible.value = false;
  nextTick(() => {
    currentDialog.value = null;
  });
};
</script>
