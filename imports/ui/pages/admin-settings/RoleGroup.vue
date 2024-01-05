<template>
  <div>
    <div class="mb-2 flex justify-between">
      <div>
        <el-button type="primary" @click="addNew()">
          <template #icon>
            <i class="fas fa-plus"></i>
          </template>
          Add New
        </el-button>
        <!-- <el-popconfirm
          :title="`Remove user(${chooseData.length}) ?`"
          width="180"
          @confirm="handleDel(chooseData)"
        >
          <template #reference>
            <el-button type="danger" :disabled="chooseData.length === 0">
              <template #icon>
                <i class="fas fa-trash-alt"></i>
              </template>
              <span> remove ({{ chooseData.length }}) </span>
            </el-button>
          </template>
        </el-popconfirm> -->
      </div>
      <div class="form-search">
        <el-input
          type="text"
          v-model="search"
          @change="fetchData(true)"
          placeholder="search"
        />
        <el-button type="primary" @click="fetchData(true)">
          <template #icon>
            <i class="fas fa-search"></i>
          </template>
          <span>Search</span>
        </el-button>
      </div>
    </div>
    <div>
      <!-- v-model:page="pagination" -->
      <data-table
        v-loading="loading"
        :showIndex="true"
        :data="tableData"
        @getTableData="fetchData"
        @selection-change="handleSelectionChange"
        style="height: calc(100vh - 300px)"
      >
        <el-table-column prop="name" label="Name" sortable>
          <template #default="scope">
            <span>
              {{ scope.row.name }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="roles" label="Roles" sortable>
          <template #default="scope">
            <span>
              <VueJsonPretty :data="scope.row.roles"     :deep="0" />
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="Status" sortable>
          <template #default="scope">
            <span>
              {{ scope.row.status }}
            </span>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="name" label="Name" sortable /> -->
        <!-- <el-table-column prop="roles" label="Roles" sortable /> -->
        <!-- <el-table-column label="Roles" sortable>
          <template #default="scope">
            <VueJsonPretty :data="scope.row.roles" />
          </template>
        </el-table-column> -->

        <el-table-column
          label="Action"
          align="center"
          fixed="right"
          width="200"
        >
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
              @confirm="handleDel(scope.row)"
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
      </data-table>
    </div>
    <!--Modal Form-->
    <component
      :is="currentModal"
      :visible="modalVisible"
      @modal-close="handleModalClose"
      :show-id="showId"
    />
  </div>
</template>
<script>
import RoleGroupForm from "./RoleGroupForm.vue";
import DataTable from "../../components/DataTable.vue";
import { defineAsyncComponent, nextTick, onMounted, ref } from "vue";
import { Meteor } from "meteor/meteor";
import { ElMessage } from "element-plus";
import VueJsonPretty from "vue-json-pretty";
export default {
  components: {
    RoleGroupForm,
    DataTable,
    VueJsonPretty,
  },
  setup() {
    const tableData = ref([]);
    const currentModal = ref(null);
    const modalVisible = ref(false);
    const loading = ref(false);
    const chooseData = ref([]);
    const showId = ref(null);

    // pagination
    const pagination = ref({
      sortBy: 'name',
      descending: false,
      currentPage: 1,
      size: 20,
      total: 0,
    });

    const search = ref(null);

    const addNew = () => {
      modalVisible.value = true;
      currentModal.value = "RoleGroupForm";
    };

    const handleModalClose = () => {
      modalVisible.value = false;
      currentModal.value = null;
      nextTick(() => {
        showId.value = null;
        fetchData(tableData.value.length === 1 ? true : false);
      });
    };

    const fetchData = async (init) => {
      loading.value = true;
      if (init) {
        pagination.value.currentPage = 1;
      }
      const { currentPage, size } = pagination.value;

      const selector = {
        username: { $ne: "Super" },
      };
      let exp = new RegExp(search.value);
      const query = {};
      if (search.value) {
        selector["$or"] = [{ username: { $regex: exp, $options: "i" } }];
      }

      const options = {};
      const res = await Meteor.callAsync("app.findRoleGroup", {
        selector,
        options,
        // page: currentPage,
        // rowsPerPage: size,
      });
      // console.log(res);
      tableData.value = res;
      // pagination.value.total = total;
      loading.value = false;
    };

    const handleSelectionChange = (val) => {
      chooseData.value = val;
    };
    const handleDel = async (data) => {
      // let ids = data
      //   .map((e) => e._id)
      //   .join(",")
      //   .split(",");

      const res = await Meteor.callAsync("app.removeRoleGroup", {
        // selector: { _id: { $in: ids } },
        _id: data._id,
      });
      ElMessage({
        type: "success",
        message: "Deleted!",
      });
      fetchData(tableData.value.length === 1 ? true : false);
    };

    const handleEdit = (row) => {
      currentModal.value = "RoleGroupForm";
      modalVisible.value = true;

      nextTick(() => {
        showId.value = row._id;
      });
    };
    onMounted(() => {
      fetchData();
    });
    return {
      currentModal,
      modalVisible,
      addNew,
      handleModalClose,
      tableData,
      loading,
      pagination,
      fetchData,
      search,
      handleSelectionChange,
      chooseData,
      handleDel,
      handleEdit,
      showId,
    };
  },
};
</script>
<style lang="scss" scoped>
.form-search {
  display: flex;
  gap: 6px;
  align-items: center;
}
</style>
