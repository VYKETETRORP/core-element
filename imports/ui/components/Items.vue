<template>
  <el-form :size="`default`" ref="formRef" :model="form" class="demo-dynamic">
    <el-table
      :header-cell-style="{
        'text-transform': 'uppercase',
        padding: '8px 0px',
      }"
      stripe
      :resizable="true"
      highlight-current-row
      style="width: 100%"
      :size="`default`"
      :cell-style="{ padding: '3px 0px', height: '40px' }"
      :data="form.details"
    >
      <el-table-column width="70px" align="center" label="NO">
        <template #default="scope">
          <el-form-item style="margin: 0px">
            <el-button type="primary" plain class="custom-no-button">
              {{ scope.$index + 1 }}
            </el-button>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column width="445px" prop="itemId" label="Item">
        <template #default="scope">
          <el-form-item
            style="margin: 0px"
            :prop="'details.' + scope.$index + '.item'"
          >
            <el-input v-model="scope.row.item" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column width="220px" prop="memo" label="Memo">
        <template #default="scope">
          <el-form-item
            style="margin: 0px"
            :prop="'details.' + scope.$index + '.memo'"
          >
            <el-input v-model="scope.row.item" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column width="220px" prop="qty" label="Qty">
        <template #default="scope">
          <el-form-item
            :prop="'details.' + scope.$index + '.qty'"
            style="margin: 0px"
          >
            <el-input v-model.number="scope.row.qty" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column width="220px" prop="uom" label="UOM">
        <template #default="scope">
          <el-form-item
            :prop="'details.' + scope.$index + '.uom'"
            style="margin: 0px"
          >
            <el-input v-model.number="scope.row.uom" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column width="220px" prop="price" label="Price">
        <template #default="scope">
          <el-form-item
            :prop="'details.' + scope.$index + '.price'"
            style="margin: 0px"
          >
            <el-input v-model.number="scope.row.price" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column  prop="amount" label="Amount">
      </el-table-column>

      <el-table-column width="100px" align="right" label="☰">
        <template #default="scope">
          <el-form-item style="margin: 0px">
            <!-- <el-button 
              @click.prevent="removeDomain(scope.row)"
              type="danger"
              plain
              class="delete"
              :icon="Delete"
            /> -->
            <div   @click.prevent="removeDomain(scope.row)" class="bar-action" style="padding: 3px 0px; height: 40px">
             
             <div style="margin-left: 60px;"> <svg
               viewBox="0 0 1024 1024"
               xmlns="http://www.w3.org/2000/svg"
               class="delete-action"
               data-v-69873352=""
               style="width: 1.2em; height: 1.2em"
             >
               <path
                 fill="currentColor"
                 d="m466.752 512-90.496-90.496a32 32 0 0 1 45.248-45.248L512 466.752l90.496-90.496a32 32 0 1 1 45.248 45.248L557.248 512l90.496 90.496a32 32 0 1 1-45.248 45.248L512 557.248l-90.496 90.496a32 32 0 0 1-45.248-45.248L466.752 512z"
               ></path>
               <path
                 fill="currentColor"
                 d="M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896z"
               ></path>
             </svg></div>
           </div>
          
          </el-form-item>
        </template>
      </el-table-column>
    </el-table>

    <el-form-item
      style="
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      "
    >
      <el-dropdown
        @click="addDomain"
        split-button
        type="primary"
        placement="top-end"
      >
        + {{ $t("app.btn.new") }}
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              {{ $t("app.btn.New") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-button type="danger"  class="el-tag el-tag--danger el-tag--large el-tag--light mx-1 mt-2" plain style="margin-left: auto"
        >Total Qty :</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { FormInstance } from "element-plus";
import {
  ArrowLeft,
  ArrowRight,
  Delete,
  Edit,
  Share,
} from "@element-plus/icons-vue";
interface DomainItem {
  key: number;
  value: string;
}
const formRef = ref<FormInstance>();
const itemDetails = ref<DomainItem[]>([]);
const form = ref<any>({
  details: [
    {
      item: "",
      qty: 1,
      price: 0,
      uom: 1,
      //amount: 1,
    },
  ],
});

const removeDomain = (item: DomainItem) => {
  const index = form.value.details.indexOf(item);
  if (index !== -1) {
    form.value.details.splice(index, 1);
  }
};

const addDomain = () => {
  console.log(itemDetails);
  form.value.details.push({
    item: "",
    qty: 1,
    price: 0,
  });
};

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log("submit!", form.value);
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style lang="scss">
.custom-no-button {
  width: 5px;
  height: 25px;
}
.bar-action {
    align-items: center;
    display: flex;
    color: red;
    justify-content: center;
}
.icon-close-dynamic {
  width: 1px;
  height: 2px;
  vertical-align: middle;
  margin-left: 50px;
  border-radius: 100%;
  border-color: red;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transform-origin: 100% 50%;
  color: red;

  &:hover {
    background-color: red;
    color: #ffffff;
  }

  svg {
    width: 16px;
    height: 16px;
    transform: scale(0.6);
  }
}
</style>
