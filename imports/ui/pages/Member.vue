<template>
  <div>
    <canvas ref="areaChartCanvas"></canvas>
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
    labels: ['Paris', 'Nîmes', 'Toulon', 'Perpignan', 'Autre'],
    datasets: [
      {
        label: 'Cities 1',
        data: [30, 40, 60, 70, 5],
        backgroundColor: 'rgba(119,206,255,0.3)',
        borderColor: '#77CEFF',
        borderWidth: 2,
        fill: true,
      },
      {
        label: 'Cities 2',
        data: [10, 20, 30, 40, 50],
        backgroundColor: 'rgba(255,99,132,0.3)',
        borderColor: '#FF6384',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  new Chart(ctx, {
    type: 'line',
    data: testData,
  });
});
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
