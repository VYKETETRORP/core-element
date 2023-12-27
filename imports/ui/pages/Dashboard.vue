<script setup>
// import BoxInfo from "../components/dashboard/box-info.vue";

// import BoxAcc from "../components/dashboard/BoxAcc.vue";
// import boxInfo from "../components/dashboard/box-info.vue";
import boxInfo from '../components/dashboard/box-info.vue';
import AccChart from '../components/dashboard/AccChart.vue';
</script>

<template>
  <div class="dashboard">
    <h5 class="title">Rabbit !</h5>
    <el-row :gutter="20" class="card-wrapper">
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <boxInfo />
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
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24"> </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {

  .card-wrapper {
  }
  .title {
    //font-family: "Lobster";
    margin: 0 0 12px 0;
    //font-size: 30px;
    color: black;
    font-weight: 700;
    background: linear-gradient(pink, orange);
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    filter: drop-shadow(0px 3px 2px rgba(0, 0, 0, 0.1));
    text-align: center;
  }
}
</style>
