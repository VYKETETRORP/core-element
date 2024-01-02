<template>
    <div class="profile">
      <el-row :gutter="30">
        <el-col :span="16">
          <!-- <span class="user-avatar">
            <avatar
              :username="userFullName"
              :size="100"
            />
          </span> -->
  
          <el-form
            ref="form"
            v-loading="loading"
            :model="form"
            :rules="rules"
            label-width="200px"
            label-position="left"
          >
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item :label="$t('app.profile.fullName')" prop="fullName">
                  <el-input v-model="form.fullName" />
                </el-form-item>
  
                <el-form-item :label="$t('app.profile.username')" prop="username">
                  <el-input v-model="form.username" />
                </el-form-item>
                <el-form-item :label="$t('app.profile.email')" prop="email">
                  <el-input v-model="form.email" />
                </el-form-item>
  
                <el-form-item :label="$t('app.profile.changePassword')">
                  <el-switch
                    v-model="changePassword"
                    class="mb-2"
                  />
                </el-form-item>
  
                <template v-if="changePassword">
                  <el-form-item
                    :label="$t('app.profile.oldPwd')"
                    prop="oldPassword"
                  >
                    <el-input
                      v-model="form.oldPassword"
                      show-password
                      type="password"
                    />
                  </el-form-item>
  
                  <el-form-item
                    :label="$t('app.profile.newPwd')"
                    prop="password"
                  >
                    <el-input
                      v-model="form.password"
                      show-password
                      type="password"
                    />
                  </el-form-item>
  
                  <el-form-item
                    :label="$t('app.profile.newConfirmPwd')"
                    prop="confirmPassword"
                  >
                    <el-input
                      v-model="form.confirmPassword"
                      show-password
                      type="password"
                    />
                  </el-form-item>
                </template>
                <el-form-item
                  :label="$t('app.profile.expiry')"
                  prop="expiry"
                >
                  <span v-if="form.expiryDay">
                    {{ form.expiryDay }} day [{{ expiryDate.oldDate }} ->
                    {{ expiryDate.newDate }}]
                  </span>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm">
                    {{ $t('app.btn.save') }}
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
  import _ from 'lodash'
//  import moment from 'moment'
//  import Notify from '/imports/client/lib/notify'
  
  // Methods
//  import {
//    validateUserExist,
//    validateUserPassword,
//  } from '../../../api/validations/user.js'
//  import { updateUser } from '../../../api/users/methods'
  
  // Components
  import {
    ElForm,
    ElFormItem,
    ElInput,
    ElRow,
    ElCol,
    ElButton,
    ElSwitch,
  } from 'element-plus'
  
  export default {
    name: 'UserProfile',
    components: {
      [ElForm.name]: ElForm,
      [ElFormItem.name]: ElFormItem,
      [ElInput.name]: ElInput,
      [ElRow.name]: ElRow,
      [ElCol.name]: ElCol,
      [ElButton.name]: ElButton,
      [ElSwitch.name]: ElSwitch,
    },
    data() {
      // Custom validate
      const validateUsername = (rule, value, callback) => {
        if (value) {
          validateUserExist
            .callPromise({
              selector: {
                _id: { $ne: this.currentUser._id },
                username: value,
              },
            })
            .then((result) => {
              if (result) {
                callback(new Error('Username exist'))
              } else {
                callback()
              }
            })
            .catch((error) => {
              Notify.error({ message: error })
            })
        }
      }
  
      const validateEmail = (rule, value, callback) => {
        if (value) {
          validateUserExist
            .callPromise({
              selector: {
                _id: { $ne: this.currentUser._id },
                emails: { $elemMatch: { address: value } },
              },
            })
            .then((result) => {
              if (result) {
                callback(new Error('Email exist'))
              } else {
                callback()
              }
            })
            .catch((error) => {
              Notify.error({ message: error })
            })
        }
      }
  
      const validateOldPassword = (rule, value, callback) => {
        if (value) {
          validateUserPassword
            .callPromise({ password: value })
            .then((result) => {
              if (result.error) {
                callback(new Error('Old password is incorrect'))
              } else {
                callback()
              }
            })
            .catch((error) => {
              Notify.error({ message: error })
            })
        }
      }
  
      const validateNewPassword = (rule, value, callback) => {
        if (value) {
          if (value === this.form.oldPassword) {
            callback(new Error(`New password must don't match the old`))
          } else if (this.form.confirmPassword !== '') {
            this.$refs.form.validateField('confirmPassword')
          }
          callback()
        }
      }
  
      const validateConfirmNewPassword = (rule, value, callback) => {
        if (value && value !== this.form.password) {
          callback(new Error(`New password don't match`))
        } else {
          callback()
        }
      }
  
      return {
        loading: false,
        changePassword: false,
        form: {
          _id: '',
          fullName: '',
          username: '',
          email: '',
          oldPassword: '',
          password: '',
          confirmPassword: '',
          allowedBranches: [],
          roles: [],
          expiryDay: '',
          expiryDate: '',
          status: '',
        },
        activePass: false,
  
        rules: {
          fullName: [{ required: true, message: 'Full name is required' }],
          username: [
            { required: true, message: 'Username is required' },
            {
              min: 3,
              max: 20,
              message: 'Length should be 3 to 20',
              trigger: 'blur',
            },
            { validator: validateUsername, trigger: 'blur' },
          ],
          email: [
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Email is not a valid email' },
            { validator: validateEmail, trigger: 'blur' },
          ],
          oldPassword: [
            { required: true, message: 'Old password is required' },
            {
              min: 6,
              message: 'Length should be greater than 6',
              trigger: 'blur',
            },
            { validator: validateOldPassword, trigger: 'blur' },
          ],
          password: [
            { required: true, message: 'New password is required' },
            {
              min: 6,
              message: 'Length should be greater than 6',
              trigger: 'blur',
            },
            { validator: validateNewPassword, trigger: 'blur' },
          ],
          confirmPassword: [
            { required: true, message: 'New confirm password is required' },
            {
              min: 6,
              message: 'Length should be greater than 6',
              trigger: 'blur',
            },
            { validator: validateConfirmNewPassword, trigger: 'blur' },
          ],
        },
      }
    },
    computed: {
      currentUser() {
        return this.$store.state.app.currentUser
      },
      userFullName() {
        return this.$store.getters['app/userFullName']
      },
      expiryDate() {
        let oldDate = '',
          newDate = ''
        if (this.form.expiryDay) {
          oldDate = moment(this.form.expiryDate).format('DD/MM/YYYY')
          newDate = moment(this.form.expiryDate)
            .add(this.form.expiryDay, 'days')
            .format('DD/MM/YYYY')
        }
  
        return { oldDate, newDate }
      },
    },
    watch: {
      changePassword() {
        this.form.password = ''
        this.form.oldPassword = ''
        this.form.confirmPassword = ''
      },
      currentUser: {
        handler(val) {
          if (val) {
            this.form = {
              _id: val._id,
              fullName: val.profile.fullName,
              username: val.username,
              email: val.emails[0].address,
              oldPassword: '',
              password: '',
              confirmPassword: '',
              allowedBranches: val.profile.allowedBranches,
              roleGroup: val.profile.roleGroup,
              roles: val.profile.roles,
              expiryDay: val.profile.expiryDay,
              expiryDate: val.profile.expiryDate,
              status: val.profile.status,
            }
          }
        },
        deep: true,
        immediate: true,
      },
    },
    methods: {
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
  
            // Make data
            const doc = _.clone(this.form)
            delete doc.oldPassword
            delete doc.confirmPassword
  
            // Update expiry date
            if (doc.expiryDay) {
              doc.expiryDate = moment(
                this.expiryDate.newDate,
                'DD/MM/YYYY'
              ).toDate()
            }
  
            updateUser
              .callPromise({ user: doc })
              .then((res) => {
                if (doc.password) {
                  this.$store.dispatch('app/logout')
                }
                this.$store.dispatch('app/messageS', `Success`)
                this.loading = false
              })
              .catch((err) => {
                this.loading = false
                Notify.error({ message: err })
              })
          } else {
            return false
          }
        })
      },
    },
  }
  </script>
  
  <style
    lang="scss"
    scoped
  >
  .profile {
    // min-height: calc(100vh - 218px);
  
    .user-avatar {
      display: inline-block;
      margin: 0px 0px 20px 200px;
      text-align: center;
    }
  }
  </style>