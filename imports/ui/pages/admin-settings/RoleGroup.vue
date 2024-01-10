<template>
  <div>
    <!--Modal Form-->
    <component
      :is="currentModal"
  
      :update-doc="updateDoc"
      :visible="modalVisible"
      @modal-close="handleModalClose"
      :show-id="showId"
    />

    <!-- Toolbar -->
    <TableToolbar v-model="tableFilters" @new="addNew" />

    <!-- Data Table -->
    <DataTables
      v-loading="loading"
      :data="tableData"
      :table-props="tableProps"
      :filters="tableFilters"
      :pagination-props="tablePagination"
      style="height: calc(100vh - 320px)"
    >
      <el-table-column
        v-for="title in tableTitles"
        :key="title.label"
        :prop="title.prop"
        :label="title.label"
        sortable="custom"
      >
        <template #default="scope">
          <span
            v-if="title.prop === 'name'"
            class="ra-text-link"
            @click="edit(scope.row)"
          >
            {{ scope.row.name }}
          </span>
          <span v-else-if="title.prop === 'roles'">
            <VueJsonPretty :data="scope.row[title.prop]" :deep="0" />
          </span>
          <span v-else>
            {{ scope.row[title.prop] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" fixed="right" width="200">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            circle
            @click="handleEdit(scope.row)"
          >
            <template #icon>
              <i class="fas fa-pencil"></i>
            </template>
          </el-button>
          <el-popconfirm
            title="Are you sure delete the selection data ?"
            @confirm="remove(scope.row)"
            width="200px"
          >
            <template #reference>
              <el-button type="danger" size="small" circle>
                <template #icon>
                  <i class="fas fa-trash"></i>
                </template>
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </DataTables>
  </div>
</template>

<script>
import VueJsonPretty from "vue-json-pretty";
import { defineAsyncComponent, nextTick, onMounted, ref } from "vue"; // Message
import Msg from "/imports/ui/lib/message";
import Notify from "/imports/ui/lib/notify";

// Table
import TableToolbar from "/imports/ui/components/TableToolbar.vue";
import TableAction from "/imports/ui/components/TableAction.vue";

// Method
import { findRoleGroups, removeRoleGroup } from "../../../api/roles/methods";

// Component
import RoleGroupForm from "./RoleGroupForm.vue";
// import RoleGroupForm from './RoleGroupForm'
import { ElTableColumn } from "element-plus";

// Component

import DataTables from "../../components/DataTable.vue";
export default {
  name: "RoleGroup",
  components: {
    [ElTableColumn.name]: ElTableColumn,
    DataTables,
    VueJsonPretty,
    TableToolbar,
    TableAction,
    RoleGroupForm,
  },
  // mixins: [dataTablesMixin, softRemoveMixin, restoreMixin, removeMixin],
  data() {
    return {
      loading: false,
      formType: "New",
      showId:null,
      tableData: [],
      tableTitles: [
        // { label: 'ID', prop: '_id' },
        { label: `${this.$t("app.groupRole.Name")}`, prop: "name" },
        { label: `${this.$t("app.groupRole.Roles")}`, prop: "roles" },
        { label: `${this.$t("app.groupRole.Status")}`, prop: "status" },
      ],
      tableFilters: [
        {
          prop: ["name", "status"],
          value: "",
        },
      ],
      tablePagination: {
        pageSizes: [10, 20, 50, 100],
        pagerCount: 5,
        layout: "prev, pager, next,jumper,sizes,total",
      },
      // Modal
      currentModal: null,
      modalVisible: false,
      updateDoc: null,
    };
  },

  created() {
    // Extend data tables props (Mixin)
    // this.tableProps.defaultSort = {
    //   prop: '_id',
    //   order: 'ascending',
    // }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      findRoleGroups
        .callPromise({})
        .then((result) => {
          this.tableData = result;
          this.loading = false;
          //console.log('role group', result)
        })
        .catch((error) => {
          this.loading = false;
          Notify.error({ message: error });
        });
    },
    // Add new
    addNew() {
      this.formType = "New";
      this.currentModal = "RoleGroupForm";
      this.$nextTick(() => {
        this.modalVisible = true
      });
    },

    // Table Action
    handleEdit(row) {
      // this.formType = "Edit";
      this.updateDoc = row;
      this.currentModal = "RoleGroupForm";
    this.modalVisible = true;
      this.$nextTick(() => {
    
        this.showId = row._id;
        console.log('show id',this.showId)
      });
    },
    // remove(row) {
    //   const res = await Meteor.callAsync("app.removeRoleGroup", {
    //     // selector: { _id: { $in: ids } },
    //     _id: data._id
    //   });
    //   ElMessage({
    //     type: "success",
    //     message: "Deleted!",
    //   });
    //   // getData(tableData.value.length === 1 ? true : false);
    // },

    async remove(row) {
      try {
        await removeRoleGroup.callPromise({ _id: row._id });
    
        // Optionally, update your data or perform any other necessary actions after successful removal
        // this.getData(tableData.value.length === 1);
        // Notify.success({ message: 'Deleted!' })
        Msg.success('Deleted!')
        this.getData();
      } catch (error) {
        // Handle errors if the removal fails
        console.error("Error removing role group:", error);
        Notify.error({ message: "Failed to delete the role group." });
      }
    },

    handleModalClose() {
      this.modalVisible = false;
      this.$nextTick(() => {

        this.showId=null;
        this.currentModal = null;
        this.updateDoc = null;
        this.getData();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../styles/main.scss";
</style>
