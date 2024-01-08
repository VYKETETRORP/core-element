<template>
  <div>
    <el-dialog
      :model-value="visible"
      width="70%"
      :before-close="handleModalClose"
    >
      <template #header>
        <i :class="`fas fa-${showId ? 'pencil' : 'plus'}`"></i>
        <span class="ml-2">
          {{ showId ? "Edit User" : "Add Role Group" }}
        </span>
      </template>
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="100px"
        label-position="top"
      >
        <el-row :gutter="10">
          <el-col :span="24">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item prop="name" label="Name">
                  <el-input v-model="form.name" placeholder="Name" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item prop="status" label="Status">
                  <el-radio-group v-model="form.status">
                    <el-radio
                      border
                      v-for="status in statusOpts"
                      :key="status.value"
                      :label="status.label"
                    ></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item  prop="roles" label="Role">
              <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                border
                @change="handleCheckAll"
               
              >
                Check All
              </el-checkbox>
            </el-form-item>
            <el-form-item>
              <fieldset class="ra-fieldset antialiased shadow-sm">
                <legend>Role</legend>
                <el-row :gutter="20">
                  <el-col
                    :xs="24"
                    :sm="24"
                    :md="12"
                    :lg="8"
                    :xl="8"
                    v-for="(role, idx) in roleGroupOpts"
                    :key="idx"
                  >
                    <el-checkbox-group
                      v-model="form.roles"
                      @change="handleCheckRole"
                    >
                      <el-checkbox :label="role.name">
                        {{ startCase(role.name) }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-col>
                </el-row>
              </fieldset>
              {{ roleOpts }}
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="Username" prop="username">
              <el-input v-model="form.username" />
            </el-form-item>
            <el-form-item label="Full Name" prop="fullName">
              <el-input v-model="form.fullName" />
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>
            <el-form-item label="Password" prop="password">
              <el-input type="password" v-model="form.password" />
            </el-form-item>
            <el-form-item label="Status" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="item in statusOpts"
                  :key="item.value"
                  :label="item.value"
                />
              </el-radio-group>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="onSubmit()">
          <template #icon>
            <i class="fas fa-save"></i>
          </template>
          Save</el-button
        >
        <el-button @click="handleModalClose"> Cancel</el-button>
        <!-- <el-button type="danger">
            <template #icon>
                <i class="fas fa-trash"></i>
            </template>
            Remove</el-button> -->
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { cloneDeep, map, startCase } from "lodash";
import role from "../../role";
export default {
  name: "RoleGroupForm",
  name: "RoleGroupForm",
  props: {
    visible: {
      type: Boolean,
      defaults: () => false,
    },
    showId: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      form: {
        name: "",
        roles: [],
        status: "Active",
      },
      role: role,
      statusOpts: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ],
      rules: {
        name: [
          { required: true, message: "Name is required" },
          // { validator: validateName, trigger: 'blur' },
        ],
        roles: [{ required: true, message: "Roles name is required" }],
        status: [{ required: true, message: "Status is required" }],
      },
      isIndeterminate: false,
      checkAll: false,
    };
  },
  computed: {
    roleGroupOpts() {
      return this.role;
    },
    roleOpts() {
      const roleOpts = cloneDeep(this.$store.state.app.lookup.userRole) || {};
    },
  },
  watch: {
    showId: {
      handler: function (val) {
        if (val) {
          Meteor.callAsync("app.findOneRoleGroup", { selector: { _id: val } })
            .then((res) => {
              this.form = res;

              this.$nextTick(() => {
                this.handleCheckRole(res.roles);
              });
            })
            .catch((err) => console.log(err));
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    lookupRole() {
      this.loading = true;
      this.$store
        .dispatch("app/lookup/getUserRole", {})
        .then(() => {
          // this.loading = false
        })
        .catch((err) => {
          // this.loading = false
          // this.$store.dispatch('app/messageE', err)
        });
    },
    startCase(val) {
      return startCase(val);
    },
    handleModalClose() {
      this.$emit("modal-close");
    },
    handleCheckAll(val) {
      this.form.roles = val ? map(this.role, (o) => o.name) : [];
      this.isIndeterminate = false;
    },
    handleCheckRole(value) {
      if (value.length === this.role.length) {
        this.checkAll = true;
        this.indeterminate = true;
      } else {
        this.checkAll = false;
        this.indeterminate = false;
      }
    },
    async onSubmit() {
      this.$refs["formRef"].validate((valid) => {
        if (valid) {
          let methods = "app.insertRoleGroup";
          if (this.showId) {
            methods = "app.updateRoleGroup";
          }
          Meteor.callAsync(methods, this.form).then((res) => {
            this.handleModalClose();
            this.$message({
              type: "success",
              message: this.showId
                ? "Updated Role Group"
                : "Created Role Group",
            });
          });
        } else {
          return false;
        }
      });
    },
  },
  mounted() {
    this.lookupRole();
  },
};
</script>

