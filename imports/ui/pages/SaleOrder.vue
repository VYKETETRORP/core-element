<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <template #header>
      <div>
        <span><i class="fas fa-plus" /></span>
        <span class="customer">{{ $t("app.saleOrder.saleOrder") }}</span>
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
            <!--Date -->
            <el-form-item
              :rules="rules.Date"
              :label="$t('app.customer.Date')"
              prop="Date"
            >
              <el-date-picker
                v-model="form.Date"
                type="date"
                format="DD/MM/YYYY"
                style="width: 100%"
              />
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
            <el-form ref="myForm" :model="formData" label-position="top">
              <fieldset>
                <legend class="legend">Info</legend>

                <el-row :gutter="20" class="info-style">
                  <el-col :span="12">
                    <span>Credit Limit: </span>
                    <span class="error">
                      <i class="fa fa-usd" aria-hidden="true"></i>
                    </span>
                  </el-col>
                  <el-col :span="12" class="right-align"> Telephone: </el-col>
                  <el-col :span="12">
                    Deposit Bal:
                    <span> <i class="fa fa-usd" aria-hidden="true"></i></span>
                    <span class="error">
                      ( <i class="fa fa-usd" aria-hidden="true"></i> )</span
                    ></el-col
                  >
                  <el-col :span="12" class="right-align"> Address: </el-col>
                  <el-col :span="12"></el-col>
                  <el-col :span="12" class="right-align legend">
                    Total Amount: $
                  </el-col>
                </el-row>
              </fieldset>
            </el-form>
          </el-col>

          <!-- Second column -->
          <el-col :span="24" :sm="24" :md="12" :lg="12">
            <!--Expect Date-->
            <el-form-item
              :rules="rules.exDate"
              :label="$t('app.saleOrder.exDate')"
              prop="Date"
            >
              <el-date-picker
                v-model="form.exDate"
                type="date"
                format="DD/MM/YYYY"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item
              :rules="rules.Employee"
              :label="$t('app.saleOrder.Employee')"
              prop="warehouse"
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
            <!-- Deposit Acoount -->
            <el-form-item
              :label="$t('app.saleOrder.Deposit Amount')"
              prop="name"
            >
              <el-input v-model="form.DepositAmount" />
            </el-form-item>
            <!--Case Account-->

            <el-form-item
              :label="$t('app.saleOrder.Cash Account')"
              prop="warehouse"
            >
              <el-select
                v-model="form.caseAccount"
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
          </el-col>
        </el-row>

        <!--item-->
        <!--Sub Items List-->

        <el-tabs type="border-card">
          <el-tab-pane>
            <template #label>
              <i class="el-icon-date" />
              {{ $t("app.item.Item") }}
            </template>
            <Item
              :items="Iteminit"
              :rows="3"
              :min-row="2"
              @item-change="changeRateDetail"
              @submit-form="submitRateDetailForm"
            />
          </el-tab-pane>
        </el-tabs>

        <el-row style="padding-top: 20px" :gutter="20">
          <el-col :span="24" :sm="24" :md="12" :lg="12">
            <el-input
              type="textarea"
              placeholder="Memo..."
              v-model="form.memo"
              :rows="5"
            />
          </el-col>

          <!-- Second column -->
          <el-col style="display: flex" :span="24" :sm="24" :md="12" :lg="12">
            <el-card class="el-card__body" shadow="never">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <span class="right-align">SubTotal:</span>
                <span class="right-align">$</span>
              </div>
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <span class="right-align">Total Discount:</span>
                <span class="right-align">$</span>
              </div>
            </el-card>
          </el-col>
        </el-row>

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
import Item from "../components/Items.vue";
import { ref } from "vue";
import _ from "lodash";

const industryOpts = ref([]);
const loading = ref(false);
const form = ref({
  // Your form properties go here
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
  exDate: [{ required: true, message: "Date is required" }],
  Date: [{ required: true, message: "Date is required" }],
  Employee: [{ required: true, message: "Employee is required" }],
  name: [{ required: true, message: "Name is required" }],
  address: [{ required: true, message: "Address is required" }],
  refNo: [{ required: true, message: "refNo is required" }],
  email: [{ type: "email" }],
  website: [{ type: "url" }],
  customerType: [{ required: true, message: "Industry is required" }],
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
.right-align {
  text-align: right;
}
.float-right {
  float: right;
}
.el-card .el-card__body {
  padding: 10px !important;
  width: 300px;
  margin-left: 390px;
}

.form {
  text-align: right;
  margin-left: 300px;
  width: 300px;
}
.info-style {
  font-size: 0.98em;
  font-weight: 700;
  color: #000;
}
.error {
  color: #f56c6c;
}
.legend {
  font-size: 1.3em;
  color: #1890ff;
  font-weight: 700;
}

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
