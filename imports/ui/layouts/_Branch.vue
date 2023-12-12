<template class="kh-battambang">
  <el-tooltip effect="dark" content="Branch" placement="bottom-end">
    <el-dropdown trigger="click" class="header-item" @command="handleCommand">
      <el-button link class="btn-link">
        <template #icon>
          <i class="far fa-sitemap fa-lg icon-link" />
        </template>
        Branch A
      </el-button>
      <!--<i class="fa fa-home"></i> Home-->

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item> branch item </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-tooltip>
</template>

<script>
//import { mapState } from 'vuex'
// Component
//import {
//  ElButton,
//  ElDropdown,
//  ElDropdownItem,
//  ElDropdownMenu,
//  ElTooltip,
//} from 'element-plus'

//export default {
//  name: 'Branch',
//  components: {
//    [ElButton.name]: ElButton,
//    [ElDropdown.name]: ElDropdown,
//    [ElDropdownMenu.name]: ElDropdownMenu,
//    [ElDropdownItem.name]: ElDropdownItem,
//    [ElTooltip.name]: ElTooltip,
//  },
//  computed: {
//    ...mapState({
//      currentBranch(state) {
//        const branch = state.app.currentBranch
//        return branch && `${branch._id} : ${branch.shortName}`
//      },
//      allowedBranches(state) {
//        return state.app.allowedBranches
//      },
//    }),
//    currentBranchId() {
//      const branch = this.$store.state.app.currentBranch
//      return branch && branch._id
//    },
//  },
//  mounted() {
//    if (this.currentBranchId)
//      this.$store.dispatch('app/updateClosingDate', this.currentBranchId)
//  },
//  methods: {
//    handleCommand(com) {
//      this.$store.dispatch('app/updateClosingDate', com['_id'])
//      this.$store.dispatch('app/updateCurrentBranch', com)
//    },
//  },
//}
</script>

<style lang="scss" scoped>
@import "../styles/header-menu.scss";
.current-branch {
  text-transform: uppercase;
}
.btn-link {
  color: #303133 !important;
  &:hover {
    color: #409eff !important;
  }

  :deep(.el-icon) {
    i {
      font-size: 16px;
    }
  }
}
</style>
