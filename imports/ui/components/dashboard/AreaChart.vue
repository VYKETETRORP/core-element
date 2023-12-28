

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
                  <canvas ref="areaChartCanvas"></canvas>
    
                </div>
              </div>
            </div>
          </div>
        </div>
    
    </template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const areaChartCanvas = ref(null);

onMounted(() => {
  const ctx = areaChartCanvas.value.getContext('2d');

  const testData = {
    labels: ['Paris', 'Nîmes', 'Toulon', 'Perpignan', 'Autre','Paris', 'Nîmes', 'Toulon', 'Perpignan', 'Autre'],
    datasets: [
      {
       
        data: [60, 50, 60, 54, 55,61, 40, 41, 40, 50],
        label: 'Income',
            borderColor: '#05CBE1',
            pointBackgroundColor: '#05CBE1',
            pointBorderColor: '#05CBE1',
            borderWidth: 1,
            backgroundColor: [
              'rgba(0, 231, 255, 0.9)',
              'rgba(0, 231, 255, 0.25)',
              'rgba(0, 231, 255, 0)',
            ],
            fill: true,
            tension: 0.4,
       

       
      },
      {
     
        data: [60, 51, 61, 53, 55,60, 40, 42, 40, 50],
        label: 'Expense',
            borderColor: '#FC2525',
            pointBackgroundColor: '#FC2525',
            pointBorderColor: '#FC2525',
            borderWidth: 1,
            // backgroundColor: [
            //   'rgba(255, 0,0, 0.5)',
            //   'rgba(255, 0, 0, 0.25)',
            //   'rgba(255, 0, 0, 0)',
            // ],
               backgroundColor:'#ffbcbc',
            fill: true,
            tension: 0.4,

        
      },
    ],
  };

  new Chart(ctx, {
    type: 'line',
    data: testData,
  });
});
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
color: #444;
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