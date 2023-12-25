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

      <el-table-column width="370px" prop="itemId" label="Item">
        <template #default="scope">
          <el-form-item
            style="margin: 0px"
            :prop="'details.' + scope.$index + '.item'"
          >
            <el-input v-model="scope.row.item" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column width="180px" prop="memo" label="Memo">
        <template #default="scope">
          <el-form-item
            style="margin: 0px"
            :prop="'details.' + scope.$index + '.memo'"
          >
            <el-input v-model="scope.row.item" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column width="170px" prop="qty" label="Qty">
        <template #default="scope">
          <el-form-item
            :prop="'details.' + scope.$index + '.qty'"
            style="margin: 0px"
          >
            <el-input v-model.number="scope.row.qty" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column width="170px" prop="uom" label="UOM">
        <template #default="scope">
          <el-form-item
            :prop="'details.' + scope.$index + '.uom'"
            style="margin: 0px"
          >
            <el-input v-model.number="scope.row.uom" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column width="170px" prop="price" label="Price">
        <template #default="scope">
          <el-form-item
            :prop="'details.' + scope.$index + '.price'"
            style="margin: 0px"
          >
            <el-input v-model.number="scope.row.price" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column width="140px" prop="amount" label="Amount">
      </el-table-column>

      <el-table-column width="100px" align="right" label="☰">
        <template #default="scope">
          <el-form-item style="margin: 0px">
            <el-button
              @click.prevent="removeDomain(scope.row)"
              type="danger"
              plain
              class="delete"
              :icon="Delete"
            />
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

      <el-button type="danger" plain style="margin-left: auto"
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
.delete {
  margin-left: 50px;
  width: 5px;
  height: 30px;
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
