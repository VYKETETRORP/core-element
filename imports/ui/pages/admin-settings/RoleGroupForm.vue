<template>
  <div>
    <el-dialog
      :model-value="visible"
      :before-close="handleModalClose"
      width="80%"
    >
      <!-- Dialog Title -->
      <template #header>
        <i :class="'fas fa-' + (formType === 'New' ? 'plus' : 'pencil-alt')" />
        {{ $t("app.groupRole.Role Group") }}
      </template>
      <el-form
        ref="form"
        v-loading="loading"
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="top"
      >
        <el-row :gutter="10">
          <el-col :span="24">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item :label="$t('app.groupRole.Name')" prop="name">
                  <el-input v-model="form.name" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item :label="$t('app.groupRole.Status')" prop="status">
                  <el-radio-group v-model="form.status">
                    <el-radio
                      v-for="item in statusOpts"
                      :key="item.value"
                      :label="item.label"
                      border
                    />
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item :label="$t('app.groupRole.Roles')" prop="roles">
              <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                border
                @change="handleCheckAllChange"
              >
                Check all
              </el-checkbox>
            </el-form-item>
            <el-tabs>
              <el-form-item>
                <template v-for="(item, index) in roleOpts.data" :key="index">
                  <el-tab-pane :label="item._id">
                    <fieldset
                      v-for="modName in item.module"
                      :key="modName.module"
                      class="ra-fieldset shadow-sm antialiased"
                    >
                      <legend>
                        <b>{{ modName.module }}</b>
                      </legend>
                      <el-checkbox-group
                        v-model="form.roles"
                        v-loading="loadingRole"
                        @change="handleCheckedRolesChange"
                      >
                        <el-row :gutter="20">
                          <template
                            v-for="list in modName.title"
                            :key="list.label"
                          >
                            <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
                              <el-checkbox :label="list.label">
                                <span
                                  class="break-words antialiased md:break-all sm:break-all"
                                >
                                  {{ startCase(list.label) }}
                                </span>
                                <el-tooltip
                                  v-if="list.label == 'hide-profit-loss-amount'"
                                  content="Hide Margin,Markup and Gross Profit on report"
                                  placement="top"
                                  effect="light"
                                >
                                  <el-icon :size="15">
                                    <InfoFilled />
                                  </el-icon>
                                </el-tooltip>
                                <el-tooltip
                                  v-if="list.label == 'hide-cost-on-form'"
                                  content="Hide Cost and Avg Cost on Form"
                                  placement="top"
                                  effect="light"
                                >
                                  <el-icon :size="15">
                                    <InfoFilled />
                                  </el-icon>
                                </el-tooltip>
                                <el-tooltip
                                  v-if="list.label == 'hide-cost-on-report'"
                                  content="Hide Cost and Avg Cost on Report"
                                  placement="top"
                                  effect="light"
                                >
                                  <el-icon :size="15">
                                    <InfoFilled />
                                  </el-icon>
                                </el-tooltip>
                              </el-checkbox>
                            </el-col>
                          </template>
                        </el-row>
                      </el-checkbox-group>
                    </fieldset>
                  </el-tab-pane>
                </template>
              </el-form-item>
            </el-tabs>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <span>
          <el-button type="primary" @click="submitForm">
            {{ $t("app.btn.save") }}
          </el-button>
          <el-button v-if="formType === 'Edit'" type="danger" @click="remove">
            {{ $t("app.btn.delete") }}
          </el-button>
          <el-button @click="handleModalClose">
            {{ $t("app.btn.cancel") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { startCase, toUpper, clone, cloneDeep, pick } from "lodash";

// Methods
// import {
//   findOneRoleGroup,
//   insertRoleGroup,
//   updateRoleGroup,
//   removeRoleGroup,
//   checkRoleGroupIsUsed,
// } from "../../api/roles/methods";

// Components
import { InfoFilled } from "@element-plus/icons-vue";
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElCheckbox,
  ElCheckboxGroup,
  ElTabs,
  ElTabPane,
  ElRadio,
  ElRadioGroup,
  ElRow,
  ElCol,
  ElButton,
  ElTooltip,
  ElIcon,
} from "element-plus";

export default {
  name: "RoleGroupForm",
  components: {
    [ElDialog.name]: ElDialog,
    [ElForm.name]: ElForm,
    [ElFormItem.name]: ElFormItem,
    [ElInput.name]: ElInput,
    [ElCheckbox.name]: ElCheckbox,
    [ElCheckboxGroup.name]: ElCheckboxGroup,
    [ElTabs.name]: ElTabs,
    [ElTabPane.name]: ElTabPane,
    [ElRadio.name]: ElRadio,
    [ElRadioGroup.name]: ElRadioGroup,
    [ElRow.name]: ElRow,
    [ElCol.name]: ElCol,
    [ElButton.name]: ElButton,
    [ElTooltip.name]: ElTooltip,
    [ElIcon.name]: ElIcon,
    [InfoFilled.name]: InfoFilled,
  },
  props: {
    formType: {
      type: String,
      default: "New",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    updateDoc: {
      type: Object,
      default: null,
    },
  },
  data() {
    var validateName = (rule, value, callback) => {
      if (value) {
        findOneRoleGroup
          .callPromise({
            selector: {
              _id: {
                $ne: this.updateDoc && this.updateDoc._id,
              },
              name: value,
            },
          })
          .then((result) => {
            if (result) {
              callback(new Error("Name is exist"));
            } else {
              callback();
            }
          })
          .catch((err) => {
            this.$store.dispatch("app/messageE", err);
          });
      }
    };

    return {
      loading: false,
      loadingRole: false,
      loopLength: 0,
      renderEl: "",
      // Check all
      checkAll: false,
      isIndeterminate: false,

      form: {
        name: "",
        roles: [],
        status: "Active",
      },
      rules: {
        name: [
          { required: true, message: "Name is required" },
          { validator: validateName, trigger: "blur" },
        ],
        roles: [{ required: true, message: "Roles name is required" }],
        status: [{ required: true, message: "Status is required" }],
      },
    };
  },
  computed: {
    roleOpts() {
      // Authorize report
      const authorizeList = this.$store.state.app.lookup.authorizes;
      const roleOpts = cloneDeep(this.$store.state.app.lookup.userRole) || {};

      if (roleOpts.data && roleOpts.data.length) {
        roleOpts.data.forEach((obj) => {
          obj.module.forEach((mod) => {
            if (mod.module == "Account Form") {
              authorizeList.forEach((it) => {
                roleOpts.tmp.push({
                  name: it["name"],
                  value: `${it["level"]}-`,
                });
                mod.title.push({ label: it["name"], value: `${it["level"]}-` });
              });
            }
          });
        });
      }
      //console.log('roleOpts', roleOpts)
      return roleOpts;
    },
    statusOpts() {
      return this.$store.state.app.lookup.status;
    },
  },
  watch: {
    updateDoc: {
      immediate: true,
      handler: function (val) {
        if (this.formType == "Edit") {
          this.form = val;
        } else {
          this.form = {
            name: "",
            roles: [],
            status: "Active",
          };
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.lookupRole();
  },
  methods: {
    toUpper(value) {
      return toUpper(value);
    },
    startCase(value) {
      return startCase(clone(value));
    },
    lookupRole() {
      this.loading = true;
      this.$store
        .dispatch("app/lookup/getUserRole", {})
        .then(() => {
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$store.dispatch("app/messageE", err);
        });
    },
    // Check all
    handleCheckAllChange(val) {
      this.form.roles = val ? this.roleOpts.tmp.map((o) => o.name) : [];
      this.isIndeterminate = false;
    },
    handleCheckedRolesChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.roleOpts.tmp.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.roleOpts.tmp.length;
    },
    // Submit form
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.formType === "New") {
            insertRoleGroup
              .callPromise(this.form)
              .then((result) => {
                if (result) {
                  this.loading = false;
                  this.$store.dispatch(
                    "app/messageS",
                    `Group ${this.form.name} saved`
                  );
                  this.resetForm();
                }
              })
              .catch((err) => {
                this.loading = false;
                this.$store.dispatch("app/messageE", err);
              });
          } else {
            // Pick data
            const doc = pick(this.form, ["_id", "name", "roles", "status"]);
            updateRoleGroup
              .callPromise(doc)
              .then((result) => {
                if (result) {
                  this.loading = false;
                  this.$store.dispatch(
                    "app/messageS",
                    `Group ${this.form.name} saved`
                  );
                  this.handleModalClose();
                }
              })
              .catch((err) => {
                this.loading = false;
                this.$store.dispatch("app/messageE", err);
              });
          }
        } else {
          return false;
        }
      });
    },
    remove() {
      this.loading = true;

      const _id = this.updateDoc && this.updateDoc._id;
      const selector = { "profile.roleGroup": _id };
      checkRoleGroupIsUsed
        .callPromise({ selector })
        .then((result) => {
          this.loading = false;
          if (result) {
            this.$store.dispatch(
              "app/messageE",
              `Group ${this.form.name} has been used`
            );
          } else {
            this.$store
              .dispatch("app/confirm", {
                messageType: "Delete",
                item: this.form.name,
              })
              .then(() => {
                this.loading = true;

                removeRoleGroup
                  .callPromise({ _id: this.updateDoc._id })
                  .then((res) => {
                    this.loading = false;
                    this.handleModalClose();
                    this.$store.dispatch(
                      "app/messageS",
                      `Group ${this.form.name} deleted`
                    );
                  })
                  .catch((err) => {
                    this.loading = false;
                    this.$store.dispatch("app/messageE", err);
                  });
              });
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$store.dispatch("app/messageE", err);
        });
    },

    resetForm() {
      this.$refs["form"].resetFields();
    },
    handleModalClose() {
      this.$emit("modal-close");
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  height: calc(100vh - 350px);
}
</style>
