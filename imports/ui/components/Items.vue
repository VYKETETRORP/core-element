<template>
  <div>
    <!--Table List-->
    <el-form ref="form" v-loading.body="loading" :model="form">
      <el-table
        v-click-outside="unsetCurrentRowIndex"
        :data="form.items"
        :header-cell-style="{
          'text-transform': 'uppercase',
          padding: '8px 0px',
        }"
        :cell-style="{ padding: '3px 0px', height: '40px' }"
        :size="formSize"
        :row-style="tableRowStyle"
        stripe
        border
        :resizable="true"
        highlight-current-row
        style="width: 100%"
        @header-click="handleHeaderClick"
        @cell-click="handleCellClick"
      >
        <!-- No -->
        <el-table-column
          type="index"
          :label="$t('app.rate-details.NO')"
          width="70px"
          align="center"
        />
        <!--Base Currecy -->
        <el-table-column
          prop="baseExchangeCurrencyId"
          :label="$t('app.rate-details.BaseCurrency')"
          align="left"
        >
          <template v-slot:default="scope">
            <template v-if="scope.$index === currentRowIndex">
              <el-form-item>
                <el-select
                  :ref="$t('app.rate-details.BaseCurrency')"
                  v-model="scope.row.baseExchangeCurrencyId"
                  :size="formSize"
                  filterable
                  automatic-dropdown
                  default-first-option
                  clearable
                  remote
                  placeholder="Base Exchange Currency"
                  @change="handleBaseNameChange(scope.row)"
                >
                  <el-option
                    v-for="doc in filteredCurrencyOpts"
                    :key="doc._id"
                    :label="doc.name"
                    :value="doc._id"
                    :disabled="doc._id === scope.row.toExchangeCurrencyId"
                  >
                    <span v-html="doc.name" />
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-else>
              <span id="LabelClick" class="text-left">
                {{ scope.row.baseName }}
              </span>
            </template>
          </template>
        </el-table-column>

        <!--To Currecy -->
        <el-table-column
          prop="toExchangeCurrencyId"
          :label="$t('app.rate-details.ToCurrency')"
          align="left"
        >
          <template #default="scope">
            <el-form-item
              :key="scope.$index + '.toExchangeCurrencyId'"
              :prop="'items.' + scope.$index + '.ToCurrency'"
              class="form-item"
              style="margin: 0"
            >
              <el-select
                :ref="$t('app.rate-details.ToCurrency')"
                v-model="scope.row.toExchangeCurrencyId"
                :size="formSize"
                filterable
                automatic-dropdown
                clearable
                remote
                placeholder="To Exchange Currency"
                @change="handleToNameChange(scope.row)"
              >
                <el-option
                  v-for="doc in currencyOpts"
                  :key="doc._id"
                  :label="doc.name"
                  :value="doc._id"
                  :disabled="doc._id === scope.row.baseExchangeCurrencyId"
                >
                  <span v-html="doc.name" />
                </el-option>
              </el-select>
            </el-form-item>

            <span id="LabelClick" class="text-left">
              {{ scope.row.toName }}
            </span>
          </template>
        </el-table-column>

        <!-- bid  -->
        <el-table-column
          prop="Bid"
          :label="$t('app.rate-details.Bid')"
          align="center"
        >
          <template #default="scope">
            <el-form-item
              v-if="scope.$index === currentRowIndex"
              :prop="'items.' + scope.$index + '.Bid'"
              class="form-item"
              style="margin: 0"
            >
              <!--<el-input-number
                :ref="$t('exchange.rate-details.Bid')"
                v-model.number="scope.row.bid"
                v-inputmask="numericMask"
                :size="formSize"
                :min="0"
                autofocus
                :controls="false"
                style="width: 100%"
                @focus="$event.target.select()"
              />-->
              <InputNumberMask
                :ref="$t('exchange.rate-details.Bid')"
                v-model.number="scope.row.bid"
                :size="formSize"
                :min="0"
                autofocus
                :zero-precision="true"
                style="width: 100%"
                @focus="$event.target.select()"
              />
            </el-form-item>

            <span v-else id="LabelClick" class="text-right">
              {{ $filters.numberDigit(scope.row.bid) }}
            </span>
          </template>
        </el-table-column>
        <!-- ask  -->
        <el-table-column
          prop="Ask"
          :label="$t('app.rate-details.Ask')"
          align="center"
        >
          <template #default="scope">
            <el-form-item
              v-if="scope.$index === currentRowIndex"
              :prop="'items.' + scope.$index + '.Ask'"
              class="form-item"
              style="margin: 0"
            >
              <!-- <el-input-number
                  :ref="$t('exchange.rate-details.Ask')"
                  v-model.number="scope.row.ask"
                  v-inputmask="numericMask"
                  :size="formSize"
                  :min="scope.row.bid"
                  autofocus
                  :controls="false"
                  style="width: 100%"
                  @focus="$event.target.select()"
                /> -->
              <InputNumberMask
                :ref="$t('exchange.rate-details.Ask')"
                v-model.number="scope.row.ask"
                :size="formSize"
                :min="scope.row.bid"
                autofocus
                style="width: 100%"
                :zero-precision="true"
                @focus="$event.target.select()"
              />
            </el-form-item>

            <span v-else id="LabelClick" class="text-right">
              {{ $filters.numberDigit(scope.row.ask) }}
            </span>
          </template>
        </el-table-column>
        <!-- Action -->
        <el-table-column
          header-align="center"
          align="left"
          width="61px"
          class="action"
        >
          <template #header>
            <i class="el-icon-menu popover-icon" />
          </template>

          <template #default="scope">
            <i
              v-if="visibleRemoveAction()"
              class="el-icon-remove remove-action"
              @click="removeRowByIndex(scope.row)"
            />
            <i
              v-if="visibleNewAction(scope.$index)"
              class="el-icon-circle-plus new-action"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
//import Vue from 'vue';
//import vClickOutside from "click-outside-vue3";

//  import Notify from '/imports/client/lib/notify'

// methods
//  import { fetchExchangeCurrency } from '../api/exchange-currency/methods'

import {
  round,
  includes,
  cloneDeep,
  defaults,
  find,
  isNull,
  reject,
  split,
  times,
} from "lodash";
import InputNumberMask from "/imports/ui/components/InputNumberMask.vue";

// // Component
// import {
//   Form,
//   FormItem,
//   Select,
//   Option,
//   Input,
//   InputNumber,
// } from 'element-plus'
export default {
  name: "Items",
  directives: {
    //clickOutside: vClickOutside.directive,
  },
  components: {
    InputNumberMask,
    // [Form.name]: Form,
    // [FormItem.name]: FormItem,
    // [Select.name]: Select,
    // [Option.name]: Option,
    // [Input.name]: Input,
    // [InputNumber.name]: InputNumber,
  },
  props: {
    items: {
      type: Array,
      default: function () {
        return [];
      },
    },
    columns: {
      type: Array,
      default: function () {
        return ["baseExchangeCurrencyId", "toExchangeCurrencyId", "bid", "ask"];
      },
    },
    rows: {
      type: Number,
      default: 3,
    },
    minRow: {
      type: Number,
      default: 0,
    },
    totalDifference: {
      type: Number,
      default: 0,
    },
  },
  data() {
    // Validate
    const validateBid = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error("Error"));
      } else {
        const splitVal = split(rule.field, ".");
        const crVal = this.form.items[splitVal[1].bid];

        if (value === 0 && crVal === 0) {
          callback(new Error("Error"));
        }
        callback();
      }
    };

    const validateAsk = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error("Error"));
      } else {
        const splitVal = split(rule.field, ".");
        const crVal = this.form.items[splitVal[1].ask];

        if (value === 0 && crVal === 0) {
          callback(new Error("Error"));
        }
        callback();
      }
    };
    // const validateExist = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error('Name is requiered'))
    //   } else if (value) {
    //     let valueArr = this.form.items.map((item) => {
    //       return item.exchangeCurrencyId
    //     })
    //     let isDuplicate = valueArr.some(function (item, idx) {
    //       return valueArr.indexOf(item) != idx
    //     })
    //     if (isDuplicate == true) {
    //       return callback(new Error('Name is exist'))
    //     } else {
    //       return callback()
    //     }
    //   } else {
    //     return callback()
    //   }
    // }

    return {
      loading: false,
      removeAction: false,
      currencyOpts: [],

      checkedMoreColumns: this.columns,
      formSize: "large",
      inactiveIds: [],
      // Emit
      itemResult: [],
      itemError: [],
      itemErrorIndex: [],

      form: {
        items: this.items,
      },
      //currencyName: '',
      rules: {
        // exchangeCurrencyId: [
        //   { validator: validateExist, required: true, trigger: 'blur' },
        // ],
        //exchangeCurrencyId: [{ validator: validateExist, trigger: 'blur' }],
        baseExchangeCurrencyId: [
          {
            message: "Base Currency is required",
            required: true,
            trigger: "blur",
          },
        ],
        toExchangeCurrencyId: [
          {
            message: "To Currency is required",
            required: true,
            trigger: "blur",
          },
        ],
        bid: [{ validator: validateBid, trigger: "blur" }],
        ask: [{ validator: validateAsk, trigger: "blur" }],
      },
      currentRowIndex: null,
      currentRowIndexActive: false,
    };
  },

  // Add new row
  //  addEmptyRow(count) {
  //    times(count, (time) => {
  //      const row = {
  //        // exchangeCurrencyId: '',
  //        baseExchangeCurrencyId: "",
  //        toExchangeCurrencyId: "",
  //        // rate: 0,
  //        bid: 0,
  //        ask: 0,
  //        baseName: "",
  //        toName: "",
  //        status: "active",
  //      };
  //      this.form.items.push(row);
  //    });

  //    // this.emitToParent()
  //  },
};
</script>

<style lang="scss" scoped>
.new-icon {
  color: #409eff;
}
.new-action {
  color: #409eff;
  cursor: pointer;
  font-size: large;
  &:hover {
    color: #66b1ff;
  }
}

.remove-icon {
  color: #f56c6c;
}
.remove-action {
  color: #f56c6c;
  cursor: pointer;
  font-size: large;
  &:hover {
    color: #f78989;
  }
}

.form-item {
  margin-bottom: 0px;
}
.el-select {
  width: 100%;
}

.popover-icon {
  font-size: 16px;
}
</style>
