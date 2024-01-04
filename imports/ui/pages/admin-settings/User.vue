<template>
    <div>
      <el-dialog
        :model-value="visible"
        :before-close="handleModalClose"
        width="70%"
      >
        <!-- Dialog Title -->
        <template #header>
          <i :class="'fas fa-' + (formType === 'New' ? 'plus' : 'pencil-alt')" />
          {{ $t('app.user.User') }}
        </template>
  
        <el-form
          ref="form"
          v-loading="loading"
          :model="form"
          :rules="rules"
          label-width="150px"
          label-position="left"
        >
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item
                :label="$t('app.user.Username')"
                prop="username"
              >
                <el-input v-model="form.username" />
              </el-form-item>
              <el-form-item
                :label="$t('app.user.Fullname')"
                prop="fullName"
              >
                <el-input v-model="form.fullName" />
              </el-form-item>
              <el-form-item
                :label="$t('app.user.Email')"
                prop="email"
              >
                <el-input v-model="form.email" />
              </el-form-item>
              <el-form-item
                v-if="form._id"
                :label="$t('app.profile.changePassword')"
              >
                <el-switch
                  v-model="changePassword"
                  class="mb-2"
                />
              </el-form-item>
              <el-form-item
                v-if="changePassword"
                :label="$t('app.user.Password')"
                prop="password"
              >
                <el-input
                  v-model="form.password"
                  show-password
                  type="password"
                />
              </el-form-item>
              <el-form-item
                :label="$t('app.user.Expiry day')"
                prop="expiryDay"
              >
                <el-input
                  v-model.number="form.expiryDay"
                  type="number"
                >
                  <template #append>
                    {{ expiryDate }}
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
  
            <el-col :span="14">
              <el-form-item
                :label="$t('app.user.Allowed branches')"
                prop="allowedBranches"
              >
                <el-select
                  v-model="form.allowedBranches"
                  multiple
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in allowedBranchOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('app.user.Role group')"
                prop="roleGroup"
              >
                <el-select
                  ref="roleGroup"
                  v-model="form.roleGroup"
                  style="width: 100%"
                  @change="handleGroupChange"
                >
                  <el-option
                    v-for="item in roleGroupOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('app.user.Status')"
                prop="status"
              >
                <el-radio-group v-model="form.status">
                  <el-radio
                    v-for="item in statusOpts"
                    :key="item.value"
                    :label="item.value"
                  />
                </el-radio-group>
              </el-form-item>
  
              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitForm"
                >
                  {{ $t('app.btn.save') }}
                </el-button>
                <el-button
                  v-if="formType === 'Edit'"
                  disabled
                  type="danger"
                  @click="remove"
                >
                  {{ $t('app.btn.delete') }}
                </el-button>
                <el-button @click="handleModalClose">
                  {{ $t('app.btn.cancel') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
  
          <fieldset class="ra-fieldset">
            <legend>{{ $t('app.user.Role details') }}:</legend>
            <el-row :gutter="20">
              <el-col
                v-for="item in form.roles"
                :key="item"
                :span="6"
              >
                {{ item }}
              </el-col>
            </el-row>
          </fieldset>
        </el-form>
  
        <!-- <span slot="footer">
          <el-button
            type="primary"
            @click="submitForm"
          >
            Save
          </el-button>
          <el-button
            v-if="formType === 'Edit'"
            disabled
            type="danger"
            @click="remove"
          >
            }
          }
        },
        deep: true,
            Delete
          </el-button>
          <el-button @click="handleModalClose">
            Cancel
          </el-button>
        </span> -->
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { clone } from 'lodash'
  import moment from 'moment'
//  import Msg from '/imports/client/lib/message'
//  import Notify from '/imports/client/lib/notify'
//  import wrapCurrentTime from '/imports/client/lib/wrap-current-time'
  
  // Mixins
//  import removeMixin from '/imports/client/mixins/remove'
  
  // Libs
//  import LookupValue from '../lib/lookup-value'

 import LookupValue from '../../lib/lookup-value'
  
//   // Methods
//  import { lookupRoleGroup } from '../../../api/lookups/role.js'
//  import { validateUserExist } from '../../../api/validations/user'
//  import { insertUser, updateUser, removeUser } from '../../../api/users/methods'
  
  // Components
  import {
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ElSelect,
    ElOption,
    ElRadio,
    ElRadioGroup,
    ElRow,
    ElCol,
    ElButton,
    ElSwitch,
  } from 'element-plus'
  
  export default {
    name: 'UserForm',
    components: {
      [ElDialog.name]: ElDialog,
      [ElForm.name]: ElForm,
      [ElFormItem.name]: ElFormItem,
      [ElInput.name]: ElInput,
      [ElSelect.name]: ElSelect,
      [ElOption.name]: ElOption,
      [ElRadio.name]: ElRadio,
      [ElRadioGroup.name]: ElRadioGroup,
      [ElRow.name]: ElRow,
      [ElCol.name]: ElCol,
      [ElButton.name]: ElButton,
      [ElSwitch.name]: ElSwitch,
    },
   
    props: {
      formType: {
        type: String,
        default: 'New',
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
      // Custom validate
      const validateUsername = (rule, value, callback) => {
        if (value) {
          const _id = this.updateDoc && this.updateDoc._id
          const selector = {
            _id: {
              $ne: _id,
            },
            username: value,
          }
  
          validateUserExist
            .callPromise({ selector })
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
          const _id = this.updateDoc && this.updateDoc._id
          const selector = {
            _id: {
              $ne: _id,
            },
            emails: { $elemMatch: { address: value } },
          }
  
          validateUserExist
            .callPromise({
              selector,
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
  
      const validateExpiryDay = (rule, value, callback) => {
        if (!Number.isInteger(value)) {
          callback(new Error('Please input digits'))
        } else {
          callback()
        }
      }
  
      return {
        loading: false,
        roleOpts: [],
        roleGroupOpts: [],
        statusOpts: LookupValue.status,
        changePassword: false,
        form: {
          fullName: '',
          username: '',
          email: '',
          password: '',
          expiryDay: 30,
          status: 'Active',
          allowedBranches: [],
          roleGroup: '',
          roles: [],
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
          status: [{ required: true, message: 'Status is required' }],
          password: [
            { required: true, message: 'Password is required' },
            {
              min: 6,
              message: 'Length should be greater than 6',
              trigger: 'blur',
            },
          ],
          expiryDay: [
            { required: true, message: 'Expiry day is required' },
            { validator: validateExpiryDay, trigger: 'blur' },
          ],
          allowedBranches: [
            { required: true, message: 'Allowed branches is required' },
          ],
          roleGroup: [{ required: true, message: 'Role group is required' }],
        },
      }
    },
    computed: {
      // Lookup
      allowedBranchOpts() {
        return this.$store.state.app.lookup.branches
      },
      expiryDate() {
        return moment().add(this.form.expiryDay, 'days').format('DD/MM/YYYY')
      },
    },
    watch: {
      changePassword() {
        this.form.password = ''
      },
      updateDoc: {
        handler: function (val) {
          if (this.formType == 'Edit') {
            this.form = {
              _id: val._id,
              fullName: val.profile.fullName,
              username: val.username,
              email: val.emails[0].address,
              password: '',
              expiryDay: val.profile.expiryDay,
              status: val.profile.status,
              allowedBranches: val.profile.allowedBranches,
              roleGroup: val.profile.roleGroup,
              roles: val.profile.roles,
            }
          } else {
            this.changePassword = true
            this.form = {
              fullName: '',
              username: '',
              email: '',
              password: '',
              expiryDay: 30,
              status: 'Active',
              allowedBranches: [],
              roleGroup: '',
              roles: [],
            }
          }
        },
        deep: true,
        immediate: true,
      },
    },
    created() {
      this.getAllowedBranchOpts()
      this.getRoleGroup()
    },
    methods: {
      getAllowedBranchOpts() {
        // this.$store.dispatch('app/lookup/getBranch')
      },
      getRoleGroup() {
      
      },
      handleGroupChange(val) {
        const group = this.roleGroupOpts.find((o) => o.value === val)
        if (group) {
          this.form.roles = group.doc.roles
        } else {
          this.form.roles = []
        }
      },
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
  
            // Make data
            const doc = clone(this.form)
            doc.expiryDate = wrapCurrentTime(
              moment(this.expiryDate, 'DD/MM/YYYY').toDate()
            )
            if (this.formType == 'New') {
              insertUser
                .callPromise({ user: doc })
                .then((result) => {
                  if (result) {
                    this.loading = false
                    Msg.success()
                    this.handleModalClose()
                  }
                })
                .catch((error) => {
                  this.loading = false
                  Notify.error({ message: error })
                })
            } else {
              updateUser
                .callPromise({ user: doc })
                .then((result) => {
                  if (result) {
                    this.loading = false
                    if (result === 'logout') {
                      this.$store.dispatch('app/logout')
                      Msg.success('User update is success')
                    } else {
                      Msg.success()
                      this.handleModalClose()
                    }
                  }
                })
                .catch((error) => {
                  this.loading = false
                  Notify.error({ message: error })
                })
            }
          } else {
            return false
          }
        })
      },
      remove() {
        this.$_removeMixin({
          meteorMethod: removeUser,
          selector: {
            _id: this.updateDoc._id,
          },
          successMethod: 'handleModalClose',
          loading: 'loading',
          // title: row.title,
        })
      },
      resetForm() {
        this.$refs['form'].resetFields()
      },
      handleModalClose() {
        this.$emit('modal-close')
      },
    },
  }
  </script>
  
  <style
    lang="scss"
    scoped
  >
  /*@import './imports/client/styles/main.scss';*/
  </style>