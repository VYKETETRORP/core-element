<template>
  <div style="display: inline-block">
    <el-tooltip effect="dark" content="Notification" placement="bottom-end">
      <el-dropdown>
        <el-badge :value="12" is-dot class="badge-item">
          <el-button link class="btn-link">
            <template #icon>
              <i class="fas fa-bell fa-lg icon-link" />
            </template>
          </el-button>
        </el-badge>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item> Notification </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
//import { useRouter, RouteLocationRaw } from "vue-router";
//  import useNotification from '../composables/useNotification'

// Component
import {
  ElButton,
  ElBadge,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElTooltip,
} from "element-plus";

//const router = useRouter();
//const { notifications } = useNotification();
//
//const handleCommand = (refRoute: RouteLocationRaw) => {
//  if (refRoute) router.push(refRoute);
//};
</script>

<style lang="scss" scoped>
@import "../styles/header-menu.scss";
.btn-link {
  color: #303133 !important;
  &:hover {
    color: var(--el-color-primary) !important;
  }
}
.badge-item {
  margin-top: 0px;
}
</style>
