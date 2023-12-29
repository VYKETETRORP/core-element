<template>
  <div class="system-table-box">
    <el-table
      class="system-table"
      v-bind="$attrs"
      ref="table"
      height="100%"
      :data="data"
      style="width: 100%"
      :header-cell-style="{ color: '#000000' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="50"
        v-if="showSelection"
      />
      <el-table-column label="No" width="60" align="center" v-if="showIndex">
        <template #default="scope">
          {{ (page.currentPage - 1) * page.size + scope.$index + 1 }}
        </template>
      </el-table-column>
      <slot></slot>
    </el-table>
    <el-pagination
      v-show="showPage"
      class="system-page-table"
      background
      :layout="pageLayout"
      v-model:current-page="page.currentPage"
      :total="page.total"
      :page-size="page.size"
      :page-sizes="pageSizes"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>

<script lang="ts">
import { ref, onActivated } from "vue";

export default {
  props: {
    data: {
      type: Array,
      defaults: () => [],
    },
    page: {
      type: Object,
      default: () => {
        return { currentPage: 1, size: 20, total: 0 };
      },
    },
    select: { type: Array, default: () => [] },
    showIndex: { type: Boolean, default: false },
    showSelection: { type: Boolean, default: false },
    showPage: { type: Boolean, default: true },
    pageSizes: { type: Array, default: [10, 20, 50, 100] },
    pageLayout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper",
    },
  },
  setup(props, context) {
    const table: any = ref(null);
    let timer: any = null;

    const handleCurrentChange = (val: Number) => {
      if (timer) {
        props.page.currentPage = 1;
      } else {
        props.page.index = val;
        context.emit("getTableData");
      }
    };

    const handleSelectionChange = (val: []) => {
      context.emit("selection-change", val);
    };

    const handleSizeChange = (val: Number) => {
      timer = "work";
      setTimeout(() => {
        timer = null;
      }, 100);
      props.page.size = val;
      context.emit("getTableData", true);
    };

    // keep-alive
    onActivated(() => {
      table.value.doLayout();
    });
    return {
      table,
      handleCurrentChange,
      handleSizeChange,
      handleSelectionChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.system-table-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  .system-table {
    flex: 1;
    height: 100%;
  }

  .system-page-table {
    margin-top: 20px;
  }
}
</style>
