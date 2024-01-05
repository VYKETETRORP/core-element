<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="200px"
          label-position="left"
        >
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item prop="fullName" label="Full Name">
                <el-input v-model="form.fullName" />
              </el-form-item>
              <el-form-item prop="username" label="User Name">
                <el-input v-model="form.username" />
              </el-form-item>
              <el-form-item prop="email" label="Email">
                <el-input v-model="form.email" />
              </el-form-item>
              <el-form-item label="Change Password">
                <el-switch v-model="changePassword"></el-switch>
              </el-form-item>
              <template v-if="changePassword">
                <el-form-item prop="oldPassword" label="Old Password">
                  <el-input v-model="form.oldPassword" />
                </el-form-item>
                <el-form-item prop="password" label="New Password">
                  <el-input v-model="form.password" />
                </el-form-item>
                <el-form-item prop="confirmPassword" label="Confirm Password">
                  <el-input v-model="form.confirmPassword" />
                </el-form-item>
              </template>
              <el-form-item>
                <el-button type="primary" @click="onSubmit()">
                  <template #icon> <i class="fas fa-save"></i> </template>
                  <span> Save </span>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Meteor } from "meteor/meteor";
import { clone } from "lodash";
export default {
  name: "UserProfile",

  data() {
    // Custom validate
    const validateOldPassword = (rule, value, callback) => {
      if (value) {
        Meteor.callAsync("app.validateUserPassword", {
          password: this.form.oldPassword,
        })
          .then((result) => {
            if (result.error) {
              callback(new Error("Old password is incorrect"));
            } else {
              callback();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    const validateUsername = (rule, value, callback) => {
      if (value) {
        Meteor.callAsync("app.validateUserExist", {
          selector: {
            _id: { $ne: this.currentUser._id },
            username: value,
          },
        })
          .then((res) => {
            if (res) {
              callback(new Error("Username exist"));
            } else {
              callback();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    const validateEmail = (rule, value, callback) => {
      if (value) {
        Meteor.callAsync("app.validateUserExist", {
          selector: {
            _id: { $ne: this.currentUser._id },
            emails: { $elemMatch: { address: value } },
          },
        })
          .then((res) => {
            if (res) {
              callback(new Error("Email exist"));
            } else {
              callback();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    const validateNewPassword = (rule, value, callback) => {
      if (value) {
        if (value === this.form.oldPassword) {
          callback(new Error(`New password must don't match the old`));
        } else if (this.form.confirmPassword != null) {
          this.$refs.formRef.validateField("confirmPassword");
        }
        callback();
      }
    };

    const validateConfirmNewPassword = (rule, value, callback) => {
      if (value && value !== this.form.password) {
        callback(new Error(`New password don't match`));
      } else {
        callback();
      }
    };

    return {
      changePassword: false,
      loading: false,
      form: {
        _id: "",
        fullName: "",
        username: "",
        email: "",
        oldPassword: "",
        password: "",
        confirmPassword: "",
        allowedBranches: [],
        roles: [],
        expiryDay: "",
        expiryDate: "",
        status: "",
      },

      rules: {
        fullName: [{ required: true, message: "Full name is required" }],
        username: [
          { required: true, message: "Username is required" },
          {
            min: 3,
            max: 20,
            message: "Length should be 3 to 20",
            trigger: "blur",
          },
          { validator: validateUsername, trigger: "blur" },
        ],
        email: [
          { required: true, message: "Email is required" },
          { type: "email", message: "Email is not a valid email" },
          { validator: validateEmail, trigger: "blur" },
        ],
        oldPassword: [
          { required: true, message: "Old password is required" },
          {
            min: 6,
            message: "Length should be greater than 6",
            trigger: "blur",
          },
          { validator: validateOldPassword, trigger: "blur" },
        ],
        password: [
          { required: true, message: "New password is required" },
          {
            min: 6,
            message: "Length should be greater than 6",
            trigger: "blur",
          },
          { validator: validateNewPassword, trigger: "blur" },
        ],
        confirmPassword: [
          { required: true, message: "New confirm password is required" },
          {
            min: 6,
            message: "Length should be greater than 6",
            trigger: "blur",
          },
          { validator: validateConfirmNewPassword, trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.app.currentUser;
    },
  },
  methods: {
    onSubmit() {
      this.$refs["formRef"].validate((valid) => {
        if (valid) {
          this.loading = true;
          const doc = clone(this.form);
          Meteor.callAsync("app.updateUser", { user: doc })
            .then((res) => {
              this.loading = false;
              this.$message({
                type: "success",
                message: "Success",
                showClose: true,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
  },
  mounted() {
    this.form = {
      _id: this.currentUser._id,
      username: this.currentUser.username,
      fullName: this.currentUser.profile.fullName,
      email: this.currentUser.emails[0].address,
      status: this.currentUser.profile.status,
      roleGroup: this.currentUser.profile.roleGroup,
      roles: this.currentUser.profile.roles,
      allowedBranches: this.currentUser.profile.allowedBranches,
    };
  },
};
</script>

<style scoped></style>
