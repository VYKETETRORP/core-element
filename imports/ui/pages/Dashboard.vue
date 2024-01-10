<script setup>
import BoxInfo from "../components/dashboard/box-info.vue";
import AccChart from "../components/dashboard/AccChart.vue";
import barChart from "../components/dashboard/bar-chart.vue";
import AreaChart from "../components/dashboard/AreaChart.vue";
</script>

<template>
  <div shadow="never" class="dashboard">
    <h3 class="title">Welcome to Rabbit Tech!</h3>

    <el-row :gutter="20" class="card-wrapper">
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <BoxInfo />
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
        :xl="12"
        style="display: flex"
      >
        <AccChart style="align-self: stretch; width: 100%" />
      </el-col>
    </el-row>


    <!-- row 2 -->
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24"> </el-col>
    </el-row>
    <el-row :gutter="20" class="card-wrapper">
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <barChart />
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
        :xl="12"
        style="display: flex"
      >
        <AreaChart style="align-self: stretch; width: 100%" />
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24"> </el-col>
    </el-row>

 
  </div>
</template>

<style lang="scss" scoped>
@import ".././styles/main.scss";


.title {
    // font-family: "Lobster";
    margin: 0 0 12px 0;
    font-size: 25px;
    color: black;
    font-weight: 700;
    background: linear-gradient(pink, orange);
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    filter: drop-shadow(0px 3px 2px rgba(0, 0, 0, 0.1));
    text-align: center;
  }
.company-heading {
  font-weight: 700;
  clear: both;
  width: 100%;
  font-size: 20px;
  color: #ff9800;
  font-family: Moul !important;
  height: 25px;
}
.box.box-success {
  // border-top-color: #1890ff;
  border-top-color: #3f51b5;
}
.box {
  position: relative;
  border-radius: 3px;
  background: #ffffff;
  border-top: 3px solid #d2d6de;
  margin-bottom: 20px;
  width: 100%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.box-header.with-border {
  border-bottom: 1px solid #f4f4f4;
}
.box-header {
  color: #444;
  display: block;
  padding: 4px;
  position: relative;
}
.box-header:before,
.box-body:before,
.box-footer:before,
.box-header:after,
.box-body:after,
.box-footer:after {
  content: " ";
  display: table;
}
.box-header > .fa,
.box-header > .glyphicon,
.box-header > .ion,
.box-header .box-title {
  display: inline-block;
  font-size: 16px;
  margin: 0;
  line-height: 1;
}
.box-header > .box-tools {
  position: absolute;
  right: 10px;
  top: 2px;
}
.pull-right {
  float: right;
}

.pull-right {
  float: right !important;
}
.box-header:after,
.box-body:after,
.box-footer:after {
  clear: both;
}
.box-header:before,
.box-body:before,
.box-footer:before,
.box-header:after,
.box-body:after,
.box-footer:after {
  content: " ";
  display: table;
}
.no-padding {
  padding: 0 !important;
}
.box-body {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
  padding: 10px;
}
.btn {
  border-radius: 3px;
  -webkit-box-shadow: none;
  box-shadow: none;
  border: 1px solid transparent;
}
.btn-box-tool {
  padding: 5px;
  font-size: 12px;
  background: transparent;
  color: #97a0b3;
}
.dashboard-height {
  height: 771px;
  // height: calc(100vh - 155px);
  // overflow: scroll;
}
@media only screen and (max-width: 1600px) {
  .dashboard-height {
    height: 758px;
  }
}
@media only screen and (max-width: 1440px) {
  .dashboard-height {
    height: 660px;
  }
}
@media only screen and (max-width: 1366px) {
  .dashboard-height {
    height: 668px;
  }
}
@media only screen and (max-width: 1280px) {
  .dashboard-height {
    height: 758px;
  }
}
@media only screen and (max-width: 1024px) {
  .dashboard-height {
    height: 672px;
  }
}
</style>
