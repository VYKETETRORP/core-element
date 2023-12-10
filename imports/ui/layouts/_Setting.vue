<template>
  <div style="display: inline-block">
    <el-tooltip effect="dark" content="Settings" placement="bottom-end">
      <el-button link class="btn-link" @click="handleSetting">
        <template #icon>
          <i class="far fa-cog fa-lg" />
        </template>
      </el-button>
    </el-tooltip>
  </div>
</template>
<script>
import { ElButton, ElTooltip } from "element-plus";
export default {
  name: "SettingSideBar",
  components: {
    [ElButton.name]: ElButton,
    [ElTooltip.name]: ElTooltip,
  },
  methods: {
    handleSetting() {
      this.$router.push({ name: "Setting" });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../style/header-menu.scss";

.btn-link {
  color: #303133 !important;
  &:hover {
    color: var(--el-color-primary) !important;
  }
}
</style>
