<template>
  <div class="bg-white shadow-sm rounded-sm px-[10px]">
    <div class="bx-heading">Perfomance</div>
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="box">
          <div class="left-indicator bg-green-400"></div>
          <div class="bx-wrapper">
            <div class="bx-content-left">
              <div class="bx-title">Income</div>
            </div>
            <div class="bx-content-right">
              <div class="badge badge-success shadow">36,475.70 $</div>
            </div>
          </div>
        </div>

        <div class="box">
          <div class="left-indicator bg-orange-400"></div>
          <div class="bx-wrapper">
            <div class="bx-content-left">
              <div class="bx-title">Expense</div>
            </div>
            <div class="bx-content-right">
              <div class="badge badge-warning shadow">36,475.70 $</div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="box">
          <div class="left-indicator bg-red-400"></div>
          <div class="bx-wrapper">
            <div class="bx-content-left">
              <div class="bx-title">Asset</div>
            </div>
            <div class="bx-content-right">
              <div class="badge badge-danger shadow">36,475.70 $</div>
            </div>
          </div>
        </div>

        <div class="box">
          <div class="left-indicator bg-green-600"></div>
          <div class="bx-wrapper">
            <div class="bx-content-left">
              <div class="bx-title">Net Income</div>
            </div>
            <div class="bx-content-right">
              <div class="badge badge-warning shadow">36,475.70 $</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.bx-heading {
  font-weight: 600;
  font-size: 14px;
  text-align: center;
}
.box {
  position: relative;
  border-bottom: 1px solid rgba(26, 54, 126, 0.125);
  display: block;
  padding: 7px 0;
  .left-indicator {
    position: absolute;
    width: 4px;
    left: 0;
    height: 60%;
    top: 20%;
    border-radius: 4px;
  }
  .bx-wrapper {
    display: flex;
    flex: 1;
    position: relative;
    align-items: center;
    
    .bx-title {
      opacity: 0.8;
      font-weight: 700;
      padding-left: 15px;
      font-size: 12px;
    }
    .bx-content-right {
      margin-left: auto;
      .badge {
        text-transform: uppercase;
        font-size: 13px;
        font-weight: 600;
        padding: 0 10px;
        min-width: 19px;
        border-radius: 4px;
      }
    }
  }
}

.badge-success {
  color: #fff;
  /* background-color: #4caf50; */
  background: linear-gradient(36deg, #4caf50, #75d048);
}
.badge-warning {
  color: #fff;
  /* background-color: #ff9800 !important; */
  background: linear-gradient(36deg, #ff9800, #fbb52b);
}

.badge-info {
  color: #fff;
  /* background-color: #3f51b5 !important; */
  background: linear-gradient(36deg, #1a73e8, #5db1ff);
}

.badge-danger {
  background: linear-gradient(36deg, #f5222d, #f97a81);
  color: #fff !important;

}
</style>
