<template>
  <div>
    <!--Modal Form-->
    <component
      :is="currentModal"
      :visible="modalVisible"
      :form-type="formType"
      :update-doc="updateDoc"
      @modal-close="handleModalClose"
    />

    <!-- Toolbar -->
    <TableToolbar
      v-model="tableFilters"
      @new="addNew"
    />

    <!-- Data Table -->

    <DataTables
      :data="tableData"
      :table-props="tableProps"
      :filters="tableFilters"
      :loading="loading"
      :pagination-props="tablePagination"
      style="height: calc(100vh - 320px)"
    >
      <el-table-column
        prop="username"
        :label="$t(`app.user.Username`)"
        sortable
      >
        <template #default="scope">
          <span
            class="ra-text-link"
            @click="edit(scope.row)"
          >
            {{ scope.row.username }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="profile.fullName"
        :label="$t(`app.user.Fullname`)"
        sortable
      />

      <el-table-column
        prop="emails[0].address"
        :label="$t(`app.user.Email`)"
        sortable
      />

      <el-table-column
        prop="profile.allowedBranches"
        :label="$t(`app.user.Allowed branches`)"
        sortable
      >
        <template #default="scope">
          {{ formatValue(scope.row.profile.allowedBranches, 'array') }}
        </template>
      </el-table-column>

      <el-table-column
        prop="groupDoc.name"
        :label="$t(`app.user.Role group`)"
        sortable
      />

      <el-table-column
        prop="profile.expiryDay"
        :label="$t(`app.user.Expiry day`)"
      >
        <template #default="scope">
          {{ scope.row.profile.expiryDay }} ({{
            formatValue(scope.row.profile.expiryDate, 'date')
          }})
        </template>
      </el-table-column>

      <el-table-column
        prop="profile.status"
        :label="$t(`app.user.Status`)"
        sortable
      />
    </DataTables>
  </div>
</template>

<script>
import moment from 'moment'

// Mixin
// import dataTablesMixin from '/imports/client/mixins/data-tables'
// import removeMixin from '/imports/client/mixins/remove'
import Notify from '/imports/ui/lib/notify'

// Table Action
import TableToolbar from '/imports/ui/components/TableToolbar.vue'
import TableAction from '/imports/ui/components/TableAction.vue'

// Method
// import { findUsers, removeUser } from '../../../api/users/methods'
// import { findUsers, removeUser } from "../../../api/users/methods";

// Component
import { ElTableColumn } from 'element-plus'
import DataTables from "../../components/DataTable.vue";
import UserForm from "./UserForm.vue";

export default {
  name: 'User',
  components: {
    [ElTableColumn.name]: ElTableColumn,
    DataTables,
    TableToolbar,
    TableAction,
    UserForm,
  },
  // mixins: [dataTablesMixin, removeMixin],
  data() {
    return {
      loading: false,
      formType: '',
      tableData: [],
      tableFilters: [
        {
          prop: ['username'],
          value: '',
        },
      ],
      tablePagination: {
        pageSizes: [20, 50, 100],
        pagerCount: 5,
        layout: 'prev, pager, next,jumper,sizes,total',
      },
      // Modal
      currentModal: null,
      modalVisible: false,
      updateDoc: null,
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.app.currentUser
    },
  },
  created() {
    // Extend data tables props (Mixin)
    // this.tableProps.defaultSort = {
    //   prop: 'profile.status',
    //   order: 'ascending',
    // }
  },
  mounted() {
    // this.getData()
  },
  methods: {
    // Get data
    getData() {
      this.loading = true

      findUsers
        .callPromise({
          selector: { username: { $ne: 'super' } },
          options: { sort: { 'profile.status': 1 } },
        })
        .then((result) => {
          this.tableData = result
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          Notify.error({ message: error })
        })
    },
    // Add new
    addNew() {
      this.formType = 'New'
      this.currentModal = 'UserForm'
      this.$nextTick(() => {
        this.modalVisible = true
      })
    },
    edit(row) {
      this.formType = 'Edit'
      this.updateDoc = row
      this.currentModal = 'UserForm'
      this.$nextTick(() => {
        this.modalVisible = true
      })
    },
    remove(row) {
      this.$_removeMixin({
        meteorMethod: removeUser,
        selector: { _id: row._id },
        successMethod: 'getData',
        loading: 'loading',
        title: row.title,
      })
    },
    formatValue(value, type) {
      if (type === 'array') {
        return JSON.stringify(value)
      } else if (type === 'date') {
        return moment(value).format('DD/MM/YYYY')
      }
    },
    handleModalClose() {
      this.modalVisible = false
      this.$nextTick(() => {
        this.currentModal = null
        this.getData()
      })
    },
  },
}
</script>

<style
  lang="scss"
  scoped
>
@import "../../styles/main.scss";
</style>