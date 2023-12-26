<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <template #header>
      <div>
        <span><i class="fas fa-plus" /></span>
        <span class="customer">{{ $t("app.customer.Customer") }}</span>
      </div>
    </template>
    <!-- card body -->

    <div class="company">
      <el-form
        ref="form"
        v-loading="loading"
        :model="form"
        label-width="150px"
        label-position="left"
      >
        <el-row :gutter="20">
          <el-col :span="24" :sm="24" :md="12" :lg="12">
            <!-- Register Date -->
            <el-form-item
              :rules="rules.exDate"
              :label="$t('app.customer.Register Date')"
              prop="exDate"
            >
              <el-date-picker
                v-model="form.exDate"
                type="date"
                format="DD/MM/YYYY"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item
              :rules="rules.refNo"
              :label="$t('app.customer.refNo')"
              prop="refNo"
            >
              <el-input v-model="form.refNo">
                <template #append>
                  <el-button @click="_getNextRefNum">
                    <template #icon>
                      <i class="fa fa-barcode" />
                    </template>
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <!-- Customer Type -->
            <el-form-item
              :rules="rules.customerType"
              :label="$t('app.customer.Customer Type')"
              prop="customerType"
            >
              <el-select
                v-model="form.customerType"
                placeholder="Select"
                style="width: 100%"
              >
                <el-option
                  v-for="item in industryOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!-- Name -->
            <el-form-item
              :rules="rules.name"
              :label="$t('app.customer.Name')"
              prop="name"
            >
              <el-input v-model="form.name" />
            </el-form-item>
            <!-- Employee -->
            <el-form-item
              :rules="rules.Employee"
              :label="$t('app.customer.Employee')"
              prop="Employee"
            >
              <el-select
                v-model="form.EmployeeType"
                placeholder="Select"
                style="width: 100%"
              >
                <el-option
                  v-for="item in industryOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!-- Default Price -->
            <el-form-item
              :rules="rules.defaultPrice"
              :label="$t('app.customer.Default Price')"
              prop="defaultPrice"
            >
              <el-radio-group v-model="form.defaultPrice">
                <el-radio label="1" border>Retail Price</el-radio>
                <el-radio label="2" border>Wholesale Price</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--Status-->
            <el-form-item
              :rules="rules.status"
              :label="$t('app.customer.Status')"
              prop="status"
            >
              <el-radio-group v-model="form.status">
                <el-radio label="1" border>Active</el-radio>
                <el-radio label="2" border>Inactive</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <!-- Second column -->
          <el-col :span="24" :sm="24" :md="12" :lg="12">
            <el-row :gutter="10">
              <el-col :sm="24" :md="12" :lg="12" :span="12">
                <!--upload profile-->
                <el-upload
                  class="avatar-uploader"
                  action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  label="Your Upload Label Here"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon"
                    ><Plus
                  /></el-icon>
                </el-upload>
                <!--<el-form-item :label="$t('app.customer.Default Price')">
                </el-form-item>-->
                <div class="text-upload-profile">
                  {{ $t("app.customer.Profile") }}
                </div>
              </el-col>

              <!--upload banner-->
              <el-col :sm="24" :md="12" :lg="12" :span="12">
                <el-upload
                  class="avatar-uploader1"
                  action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  label="Your Upload Label Here"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon"
                    ><Plus
                  /></el-icon>
                </el-upload>

                <!--<el-form-item
                  class="text-upload"
                  :label="$t('app.customer.Default Price')"
                >
                </el-form-item>-->
                <div class="text-upload-banner">Shop Banner</div>
              </el-col>
            </el-row>

            <!--Warehouse-->

            <el-form-item
              style="margin-left: 35px"
              :rules="rules.warehouse"
              :label="$t('app.customer.Warehouse')"
              prop="warehouse"
            >
              <el-select
                v-model="form.industry"
                placeholder="Select"
                style="width: 100%"
              >
                <el-option
                  v-for="item in industryOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!--Memo-->
            <el-form-item
              style="margin-left: 35px"
              :rules="rules.memo"
              :label="$t('app.customer.Memo')"
              prop="memo"
            >
              <el-input v-model="form.memo" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>

        <!--tab-->

        <el-tabs type="border-card">
          <!-- Tab 1 -->
          <el-tab-pane>
            <template #label>
              <span class="custom-tabs-label">
                <i class="fa-regular fa-address-book"></i>
                <span style="margin-left: 5px">
                  {{ $t("app.customer.Contact") }}</span
                >
              </span>
            </template>
            <el-row :gutter="20">
              <el-col :span="24" :md="12">
                <el-form-item
                  :rules="rules.telephone"
                  :label="$t('app.customer.Telephone')"
                  prop="telephone"
                >
                  <el-input v-model="form.telephone" />
                </el-form-item>
                <el-form-item
                  :rules="rules.email"
                  :label="$t('app.customer.Email')"
                  prop="email"
                >
                  <el-input v-model="form.email" />
                </el-form-item>
                <el-form-item
                  :rules="rules.industry"
                  :label="$t('app.customer.Geography')"
                  prop="geography"
                >
                  <el-select
                    v-model="form.geography"
                    placeholder="Select"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in industryOpts"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item
                  :label="$t('app.customer.Address')"
                  prop="address"
                >
                  <el-input v-model="form.address" type="textarea" />
                </el-form-item>
              </el-col>

              <el-col :span="24" :md="12">
                <el-form-item
                  style="margin-left: 35px"
                  :rules="rules.email"
                  :label="$t('app.customer.Location')"
                  prop="location"
                >
                  <el-input
                    placeholder="Search...(100)"
                    v-model="form.location"
                  />
                </el-form-item>
                <el-form-item
                  style="margin-left: 35px"
                  :rules="rules.map"
                  :label="$t('app.customer.Map')"
                  prop="map"
                >
                  <el-input v-model="form.map">
                    <template #append>
                      <el-button @click="_getNextRefNum">
                        <template #icon>
                          <i
                            class="fa-sharp fa-solid fa-location-dot fa-lg"
                            style="color: #f89898"
                          />

                          <!--<i class="fa fa-barcode" />-->
                        </template>
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item
                  style="margin-left: 35px"
                  :label="$t('app.customer.Delivery Address')"
                  prop="deliverAddress"
                >
                  <el-input v-model="form.deliverAddress" type="textarea" />
                </el-form-item>

                <el-form-item
                  style="margin-left: 35px"
                  :label="$t('app.customer.Billing Address')"
                  prop="billingAddress"
                >
                  <el-input v-model="form.billingAddress" type="textarea" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <!-- Tab 2 -->
          <el-tab-pane>
            <template #label>
              <span class="custom-tabs-label">
                <i class="fa-solid fa-money-check-dollar"></i>
                <span style="margin-left: 5px">
                  {{ $t("app.customer.Payment") }}</span
                >
              </span>
            </template>
            <el-row :gutter="20">
              <el-col :span="24" :md="12">
                <el-form-item
                  :rules="rules.paymentTerm"
                  :label="$t('app.customer.Payment Term')"
                  prop="setting.paymentTerm"
                >
                  <el-select
                   
                    placeholder="Select"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in currencyOpts"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" :md="12">
                <el-form-item
                  style="margin-left: 35px"
                  :rules="rules.target"
                  :label="$t('app.customer.Credit Limit')"
                  prop="email"
                >
                  <el-input v-model="form.target" /> </el-form-item
              ></el-col>

              <el-col :span="12">
                <el-form-item
                  :rules="rules.target"
                  :label="$t('app.customer.Target')"
                  prop="email"
                >
                  <el-input v-model="form.target" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <!-- Tab 3 -->
          <el-tab-pane :label="$t('app.Company.Setting')">
            <template #label>
              <span class="custom-tabs-label">
                <i class="fa-solid fa-file-invoice-dollar"></i>
                <span style="margin-left: 5px">
                  {{ $t("app.customer.Account") }}</span
                >
              </span>
            </template>
            <el-row :gutter="20">
              <el-col :span="24" :md="12">
                <el-form-item
                  :rules="rules.accountReceivable"
                  :label="$t('app.customer.Account Receivable')"
                  prop="setting.paymentTerm"
                >
                  <el-select
                
                    placeholder="Select"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in currencyOpts"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item
                  :rules="rules.CashAccount"
                  :label="$t('app.customer.Cash Account')"
                  prop="setting.paymentTerm"
                >
                  <el-select
                    
                    placeholder="Select"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in currencyOpts"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" :md="12">
                <el-form-item
                  style="margin-left: 35px"
                  :rules="rules.TradeDiscount"
                  :label="$t('app.customer.Trade Discount')"
                  prop="setting.TradeDiscount"
                >
                  <el-select
                  
                    placeholder="Select"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in currencyOpts"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>

        <!--Submit-->
        <el-form-item style="float: right; margin-top: 10px" class="ra-mt">
          <el-dropdown split-button type="primary" placement="top-end">
            {{ $t("app.btn.saveAndClose") }}
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  {{ $t("app.btn.saveAndNew") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button
            v-if="showId"
            :disabled="!$userIsInRole(['super'])"
            type="danger"
            @click="remove"
            style="margin-left: 20px; padding: 15px"
          >
            <!-- Delete -->
            {{ $t("app.btn.delete") }}
          </el-button>
          <el-button style="margin-left: 10px; padding: 15px" @click="cancel()">
            <!-- Cancel -->
            {{ $t("app.btn.cancel") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import moment from "moment";

import { ref, reactive } from "vue";
import _ from "lodash";
// Components
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElDatePicker,
  ElSelect,
  ElOption,
  ElSwitch,
  ElUpload,
  ElTabs,
  ElTabPane,
  ElRow,
  ElCol,
  ElRadio,
  ElRadioGroup,
  ElCheckbox,
  ElButton,
} from "element-plus";

const loading = ref(false);
const form = ref({
  name: "",

  exDate:"",
  refNo:"",
  TradeDiscount:"",
  CashAccount:"",
  address: "",
  telephone: "",
  email: "",
  website: "",
  customerType: "",
  logo: "",

  accountReceivable:"",
  paymentTerm:"",
  Employee:"",
  map:"",
  deliverAddress:"",
  EmployeeType:"",
  geography:"",
  location:"",
  industry:"",
  memo:"",


});

const rules = ref({
  defaultPrice: [{ required: true, message: "Default Price is required" }],
  status: [{ required: true, message: "Status is required" }],
  accountReceivable: [
    { required: true, message: "Account Receivable is required" },
  ],
  TradeDiscount: [{ required: true, message: " Trade Discount is required" }],
  CashAccount: [{ required: true, message: "CashAccount is required" }],
  paymentTerm: [{ required: true, message: "Payment Term is required" }],
  SettlementDiscount: [
    { required: true, message: "Settlement Discount is required" },
  ],
  exDate: [{ required: true, message: "Register Date is required" }],
  Employee: [{ required: true, message: "Employee is required" }],
  name: [{ required: true, message: "Name is required" }],
  address: [{ required: true, message: "Address is required" }],
  refNo: [{ required: true, message: "refNo is required" }],
  email: [{ type: "email" }],
  website: [{ type: "url" }],
  customerType: [{ required: true, message: "Customer Type is required" }],
  fiscalDate: [{ required: true, message: "Fiscal date is required" }],
  baseCurrency: [{ required: true, message: "Base currency date is required" }],
  decimalNumber: [
    { required: true, message: "Decimal number date is required" },
  ],
  dateFormat: [{ required: true, message: "Date format date is required" }],
});
</script>

<style>
.avatar-uploader1 .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  width: 536px;
  height: 133px;
  /*padding: 5px;*/
  margin-left: -150px;
  /*margin-right: 160px;*/

  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 20px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

/*banner*/
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  width: 133px;
  height: 133px;
  /*padding: 5px;*/
  margin-left: 25px;

  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 20px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>

<style lang="scss" scoped>
.example-showcase .el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.text-upload-profile {
  font-size: 13px;
  margin-left: 70px;
  padding: 5px;
  margin-bottom: 5px;
  color: rgb(103, 100, 100);
}
.text-upload-banner {
  font-size: 13px;
  margin-left: -155px;
  padding: 5px;
  margin-bottom: 5px;
  color: rgb(103, 100, 100);
}
.avatar-uploader1 .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.tab-title {
  font-size: 18px;
  font-weight: 400;
  color: #1f2f3d;
  margin-bottom: 15px;
}
.customer {
  padding: 3px;
}
.company {
  // min-height: calc(100vh - 218px);
}
// Upload log css is on element.less
</style>
