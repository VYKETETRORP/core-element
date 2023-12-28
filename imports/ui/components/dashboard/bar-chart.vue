<template>
  <div class="box box-success" style="margin-top: 10px; padding-top: 4px">
    <div class="box-header with-border">
      <h3 class="box-title">
        {{ $t("app.account-setting-account-type.daily income") }}
      </h3>
      <div style="width: 110px" class="box-tools pull-right">
        <el-select v-model="value" placeholder="Last 30 Days">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </el-select>
      </div>
    </div>

    <div class="box-body">
      <div class="row">
        <div class="col-md-9 col-sm-8">
          <div class="pad">
            <canvas id="myChart" width="400" height="200"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
export default {
  mounted() {
    // Get the canvas element after the component is mounted
    const ctx = this.$el.querySelector("#myChart");
    // Check if the canvas element exists
    if (!ctx) {
      console.error("Canvas element not found");
      return;
    }
    // Create the chart
    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Red",
          "Blue",
          "Yellow",
          "Green",
          "Purple",
          "Orange",
          "Ke",
          "Trorp",
          "Good Game",
          "Ble",
        ],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 12, 9, 11, 15, 12, 12, 13, 16],
            backgroundColor: [
              "rgba(255, 127, 132, 0.4)",

              // 'rgb(256,188,188)', // Red
            ],
            // backgroundColor:'#ffbcbc',
            borderColor: "#FC2525",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                size: 10, // Adjust the font size of the legend
              },
            },
          },
        },
        // Adjust bar width properties
        indexAxis: "x", // Horizontal bar chart
        barPercentage: 0.8, // Adjust the width of individual bars
        categoryPercentage: 0.8, // Adjust the width of bar categories
      },
    });
  },
};
</script>
<style lang="scss" scoped>
// @import "./imports/client/styles/main.scss";

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
