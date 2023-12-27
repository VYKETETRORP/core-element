<template>
  <div class="bg-white px-[10px] shadow-sm rounded">
    <div class="box-heading">
      Customer Info
    </div>
    <el-row :gutter="20">
    <el-col :span="12">
      <div class="box bg-indigo">
        <div class="bx-icon">
          <i class="fal fa-dollar-sign" />
        </div>
        <div class="bx-content">
          <div class="title">
            <b>Deposit</b>
          </div>
          <div class="bx-amount">800 $</div>
        </div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="box bg-green">
        <div class="bx-icon">
          <i class="fal fa-fas fa-users" />
        </div>
        <div class="bx-content">
          <div class="title">
            <b>Sale</b>
          </div>
          <div class="bx-amount">800 $</div>
        </div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="box bg-orange">
        <div class="bx-icon">
          <i class="fal fa-file-invoice-dollar" />
        </div>
        <div class="bx-content">
          <div class="title">
            <b>Invoice</b>
          </div>
          <div class="bx-amount">800 $</div>
        </div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="box bg-danger">
        <div class="bx-icon">
          <i class="fal fa-file-invoice-dollar" />
        </div>
        <div class="bx-content">
          <div class="title">
            <b>Overdue</b>
          </div>
          <div class="bx-amount">800 $</div>
        </div>
      </div>
    </el-col>
  </el-row>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";

export default {
  setup() {
    const state = reactive({
      count: 0,
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
.box-heading {
font-weight: 600;  
text-align: center;
font-size: 14px;
margin-bottom: 8px;
}
.box {
  background-color: orange;
  height: 75px;
  -ms-box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  margin-bottom: 10px;
  cursor: default;
  .bx-icon {
    width: 55px;
    float: left;
    background-color: rgba(0, 0, 0, 0.1);
    text-align: center;
    overflow: hidden;
    i {
      line-height: 53px;
      font-size: 30px;
    }
  }
  .bx-content {
    float: left;
    padding: 0px 7px;

    .title {
      margin-top: 4px;
      font-size: 15px;
      line-height: 1.42857143;
      b {
        font-weight: 700;
        font-size: 12px;
        line-height: 1.42857143;
      }
    }
    .bx-amount {
      font-weight: 700;
    }
  }
}

.bg-danger {
  background: linear-gradient(36deg, #f5222d, #f97a81);
  color: #fff !important;
  height: 54px;
  border-radius: 5px;
}

.bg-orange {
    background: linear-gradient(36deg, #ff9800, #fbb52b);
    color: #fff !important;
    height: 54px;
    border-radius: 5px;
  }
  .bg-indigo {
    background: linear-gradient(36deg, #1a73e8, #5db1ff);
    color: #fff !important;
    height: 54px;
    border-radius: 5px;
  }
  .bg-green {
    background: linear-gradient(36deg, #4caf50, #75d048);
    color: #fff !important;
    height: 54px;
    border-radius: 5px;
  }
  
</style>
